// Encode text the way each model was trained, run it, and decode the output.
// tf and the loaded models are passed in, so the browser and the golden tests run the same code.
import C from './constants.json' with { type: 'json' }

type TF = typeof import('@tensorflow/tfjs')
type Model = import('@tensorflow/tfjs').LayersModel
type Tensor = import('@tensorflow/tfjs').Tensor
export type Vocab = Record<string, number>

export type CharLabel = { char: string; id: number; label: string }
export type Word = { text: string; tag: string | null }
export type Entity = { text: string; type: string }

// Splits ids into rows of `length`, padding the last with 0 (training's "mode 0").
function rows(ids: number[], length: number): number[][] {
  const out: number[][] = []
  for (let i = 0; i < Math.max(ids.length, 1); i += length) {
    const row = ids.slice(i, i + length)
    out.push(row.concat(Array(length - row.length).fill(0)))
  }
  return out
}

// One row, cut to `length` (training's "mode 1", used by sentiment and topics).
function truncated(ids: number[], length: number): number[][] {
  const row = ids.slice(0, length)
  return [row.concat(Array(length - row.length).fill(0))]
}

async function argmaxRows(tf: TF, model: Model, input: number[][]): Promise<number[]> {
  const x = tf.tensor2d(input)
  const y = model.predict(x) as Tensor
  const best = y.argMax(-1)
  const flat = Array.from(await best.data())
  tf.dispose([x, y, best])
  return flat
}

const lookup = (vocab: Vocab, words: string[]) => words.map((w) => vocab[w] ?? vocab.UNK)

/** Word segmentation. The model labels every character: "not a word end", or the word class of the word it ends. */
export async function segment(tf: TF, model: Model, text: string): Promise<{ words: Word[]; chars: CharLabel[] }> {
  const T = C.tokenizer
  const index = T.charIndex as Record<string, number>
  const chars = [...text.replace(/\s+/g, ' ').trim()]
  const ids = chars.map((c) => index[c] ?? T.unknownChar)
  const labels = (await argmaxRows(tf, model, rows(ids, T.sequenceLength))).slice(0, chars.length)

  const charLabels: CharLabel[] = chars.map((char, i) => ({
    char,
    id: ids[i],
    label: labels[i] >= T.tagStart ? T.tags[labels[i] - T.tagStart] : '·',
  }))

  const words: Word[] = []
  let current = ''
  chars.forEach((char, i) => {
    if (char === ' ') {
      // A space always separates words; the model's label on it is ignored.
      if (current) words.push({ text: current, tag: null })
      current = ''
      return
    }
    current += char
    const isEnd = labels[i] !== T.nonSegmentTag || i === chars.length - 1 // the last character always ends a word
    if (isEnd) {
      words.push({ text: current, tag: labels[i] >= T.tagStart ? T.tags[labels[i] - T.tagStart] : null })
      current = ''
    }
  })
  return { words, chars: charLabels }
}

/** Named entities: one BIO-style tag per word, merged into entity spans. */
export async function entities(tf: TF, model: Model, vocab: Vocab, words: string[]): Promise<{ tags: string[]; spans: (Entity | string)[] }> {
  const out = await argmaxRows(tf, model, rows(lookup(vocab, words), C.ner.sequenceLength))
  const tags = words.map((_, i) => C.ner.tags[out[i]])
  const spans: (Entity | string)[] = []
  words.forEach((w, i) => {
    const m = tags[i].match(/^(.+)_(B|I)$/)
    const last = spans[spans.length - 1]
    if (!m) spans.push(w)
    else if (m[2] === 'I' && typeof last === 'object' && last.type === m[1]) last.text += w
    else spans.push({ text: w, type: m[1] })
  })
  return { tags, spans }
}

/** Part of speech: one of 34 word classes per word. */
export async function partOfSpeech(tf: TF, model: Model, vocab: Vocab, words: string[]): Promise<Word[]> {
  const out = await argmaxRows(tf, model, rows(lookup(vocab, words), C.pos.sequenceLength))
  return words.map((text, i) => ({ text, tag: C.pos.tags[out[i]] }))
}

/** Sentiment: probability of each class for the first 60 words. */
export async function sentiment(tf: TF, model: Model, vocab: Vocab, words: string[]): Promise<{ label: string; p: number }[]> {
  const x = tf.tensor2d(truncated(lookup(vocab, words), C.sentiment.sequenceLength))
  const y = model.predict(x) as Tensor
  const p = Array.from(await y.data())
  tf.dispose([x, y])
  return C.sentiment.tags.map((label, i) => ({ label, p: p[i] }))
}

/** Topics: an independent probability per tag; a tag applies when it clears its own tuned threshold. */
export async function topics(tf: TF, model: Model, vocab: Vocab, words: string[]): Promise<{ label: string; p: number; threshold: number; applies: boolean }[]> {
  const x = tf.tensor2d(truncated(lookup(vocab, words), C.topics.sequenceLength))
  const y = model.predict(x) as Tensor
  const p = Array.from(await y.data())
  tf.dispose([x, y])
  return C.topics.tags
    .map((label, i) => ({ label, p: p[i], threshold: C.topics.thresholds[i], applies: p[i] >= C.topics.thresholds[i] }))
    .sort((a, b) => b.p - a.p)
}

/** Word similarity: cosine of the two words' vectors, or null when a word is not in the vocabulary. */
export async function similarity(tf: TF, model: Model, vocab: Vocab, a: string, b: string): Promise<number | null> {
  if (!(a in vocab) || !(b in vocab)) return null
  const x = [tf.tensor2d([[vocab[a]]]), tf.tensor2d([[vocab[b]]])]
  const y = model.predict(x) as Tensor
  const [score] = await y.data()
  tf.dispose([...x, y])
  return score
}
