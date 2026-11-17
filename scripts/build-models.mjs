// Converts the trained models in models/ into what the site serves from public/models/:
// float16 weights (half the download; argmax matched float32 on 12,000 test tokens),
// 4 MB shards with a .bin extension so the CDN caches them, and the word index as vocab.json.
// Also writes lib/nlp/model-sizes.json (bytes of weights and vocab) so the UI can show "31 / 42 MB" while downloading.
//
//   node scripts/build-models.mjs
import fs from 'node:fs'
import path from 'node:path'

const SRC = 'models'
const OUT = 'public/models'
const SHARD_BYTES = 4 * 1024 * 1024
// Served models, keyed by their folder in models/. Keyword expansion is not on the site.
const MODELS = {
  tokenizer: null,
  ner: 'ner_word_index.json',
  pos: 'pos_word_index.json',
  sentiment: 'sentiment_word_index.json',
  categorization: 'categorization_word_index.json',
  word_embedder: 'word_embedder_word_index.json',
}

const f32 = new Float32Array(1)
const u32 = new Uint32Array(f32.buffer)
function toHalf(v) {
  f32[0] = v
  const x = u32[0]
  const sign = (x >>> 16) & 0x8000
  const exp = ((x >>> 23) & 0xff) - 112
  const man = x & 0x7fffff
  if (exp <= 0) {
    if (exp < -10) return sign
    const m = man | 0x800000
    const shift = 14 - exp
    let h = m >>> shift
    if ((m >>> (shift - 1)) & 1) h++
    return sign | h
  }
  if (exp >= 31) return sign | 0x7c00
  let h = sign | (exp << 10) | (man >>> 13)
  if (man & 0x1000) h++
  return h
}

fs.rmSync(OUT, { recursive: true, force: true })
const sizes = {}
for (const [name, vocab] of Object.entries(MODELS)) {
  const dir = path.join(SRC, name)
  const json = JSON.parse(fs.readFileSync(path.join(dir, 'model.json'), 'utf8'))
  const specs = []
  const parts = []
  for (const group of json.weightsManifest) {
    specs.push(...group.weights)
    for (const p of group.paths) parts.push(fs.readFileSync(path.join(dir, p)))
  }
  const all = Buffer.concat(parts)
  const floats = new Float32Array(all.buffer, all.byteOffset, all.byteLength / 4)
  if (specs.some((s) => s.dtype !== 'float32')) throw new Error(`${name}: expected float32 weights only`)

  const half = new Uint16Array(floats.length)
  for (let i = 0; i < floats.length; i++) half[i] = toHalf(floats[i])
  const bytes = Buffer.from(half.buffer)

  const out = path.join(OUT, name)
  fs.mkdirSync(out, { recursive: true })
  const count = Math.ceil(bytes.length / SHARD_BYTES)
  const paths = []
  for (let i = 0; i < count; i++) {
    const file = `group1-shard${i + 1}of${count}.bin`
    fs.writeFileSync(path.join(out, file), bytes.subarray(i * SHARD_BYTES, (i + 1) * SHARD_BYTES))
    paths.push(file)
  }
  const weights = specs.map((s) => ({ name: s.name, shape: s.shape, dtype: 'float32', quantization: { dtype: 'float16' } }))
  fs.writeFileSync(path.join(out, 'model.json'), JSON.stringify({ modelTopology: json.modelTopology, weightsManifest: [{ paths, weights }] }))

  let vocabBytes = 0
  if (vocab) {
    const min = JSON.stringify(JSON.parse(fs.readFileSync(path.join(dir, vocab), 'utf8')))
    fs.writeFileSync(path.join(out, 'vocab.json'), min)
    vocabBytes = Buffer.byteLength(min)
  }
  sizes[name] = { weights: bytes.length, vocab: vocabBytes }
  console.log(`${name}: ${((bytes.length + vocabBytes) / 1e6).toFixed(1)} MB in ${count} shards${vocab ? ' + vocab' : ''}`)
}
fs.writeFileSync('lib/nlp/model-sizes.json', JSON.stringify(sizes, null, 1) + '\n')
