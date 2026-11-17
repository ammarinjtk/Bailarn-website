// Golden tests: the served float16 models give the answers the old live site gave, and match the float32 originals.
// Needs public/models (npm run models).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { tf, loadModel, loadVocab } from './models.ts'
import { segment, entities, partOfSpeech, sentiment, topics, similarity, type Entity } from '../lib/nlp/pipeline.ts'

const served = (m: string) => loadModel(`public/models/${m}`)
const original = (m: string) => loadModel(`models/${m}`)
const vocab = (m: string) => loadVocab(`public/models/${m}/vocab.json`)
const words = async (text: string) => (await segment(tf, await served('tokenizer'), text)).words.map((w) => w.text)

test('segments the sentence the old site showed', async () => {
  const { words: w } = await segment(tf, await served('tokenizer'), 'นายกรัฐมนตรีเดินทางไปเชียงใหม่')
  assert.deepEqual(w.map((x) => x.text), ['นายก', 'รัฐมนตรี', 'เดินทาง', 'ไป', 'เชียงใหม่'])
})

test('the last character always ends a word, and spaces split words', async () => {
  const m = await served('tokenizer')
  assert.deepEqual((await segment(tf, m, 'ตากลม')).words.map((w) => w.text).join('|').endsWith('ลม'), true)
  assert.deepEqual((await segment(tf, m, 'แม่  พ่อ')).words.map((w) => w.text), ['แม่', 'พ่อ'])
})

test('finds the entities the old site showed', async () => {
  const w = await words('สถานที่ที่คุณสมชายชอบไปคือเกาหลีใต้')
  const { spans } = await entities(tf, await served('ner'), vocab('ner'), w)
  const found = spans.filter((s): s is Entity => typeof s === 'object').map((s) => `${s.type}:${s.text}`)
  assert.deepEqual(found, ['TTL:คุณ', 'PER:สมชาย', 'ORG:เกาหลีใต้'])
})

test('float16 models agree with the float32 originals', async () => {
  const w = await words('เราจะไปเดินเล่นที่หนองคาย และนั่งเรือข้ามไปประเทศลาว')
  for (const [name, run] of [
    ['ner', async (m: Awaited<ReturnType<typeof served>>) => (await entities(tf, m, vocab('ner'), w)).tags],
    ['pos', async (m: Awaited<ReturnType<typeof served>>) => (await partOfSpeech(tf, m, vocab('pos'), w)).map((x) => x.tag)],
  ] as const) {
    assert.deepEqual(await run(await served(name)), await run(await original(name)), name)
  }
  const s16 = await sentiment(tf, await served('sentiment'), vocab('sentiment'), w)
  const s32 = await sentiment(tf, await original('sentiment'), vocab('sentiment'), w)
  s16.forEach((s, i) => assert.ok(Math.abs(s.p - s32[i].p) < 0.01, 'sentiment'))
  const t16 = await topics(tf, await served('categorization'), vocab('categorization'), w)
  const t32 = await topics(tf, await original('categorization'), vocab('categorization'), w)
  assert.deepEqual(t16.filter((t) => t.applies).map((t) => t.label), t32.filter((t) => t.applies).map((t) => t.label), 'topics')
  const e16 = await similarity(tf, await served('word_embedder'), vocab('word_embedder'), 'แม่', 'พ่อ')
  const e32 = await similarity(tf, await original('word_embedder'), vocab('word_embedder'), 'แม่', 'พ่อ')
  assert.ok(e16 !== null && e32 !== null && Math.abs(e16 - e32) < 0.005, 'embeddings')
})

test('similarity is null for a word outside the vocabulary', async () => {
  assert.equal(await similarity(tf, await served('word_embedder'), vocab('word_embedder'), 'แม่', 'qwxzv'), null)
})
