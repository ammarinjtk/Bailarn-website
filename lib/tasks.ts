// One entry per demo. Order is the order on the home page and in the nav.
// score: published result on the BEST2010_I2R test set (Bailarn-python-library README); null where none was reported.
export type Task = {
  slug: string
  nav: string
  title: string
  thai: string
  blurb: string
  model: string
  score: string | null
}

export const TASKS: Task[] = [
  {
    slug: 'tokenize',
    nav: 'Tokenize',
    title: 'Word segmentation',
    thai: 'ตัดคำ',
    blurb: 'Thai is written without spaces between words. The tokenizer reads character by character and marks where each word ends.',
    model: 'Character Bi-LSTM, 3 layers',
    score: 'F1 98.58%',
  },
  {
    slug: 'entities',
    nav: 'Entities',
    title: 'Named entities',
    thai: 'ชื่อเฉพาะ',
    blurb: 'Finds people, places, organisations, dates and measurements, and labels each one with its type.',
    model: 'Word embedding + Bi-LSTM',
    score: 'F1 79.59% micro, 62.10% macro',
  },
  {
    slug: 'embeddings',
    nav: 'Embeddings',
    title: 'Word similarity',
    thai: 'ความใกล้ของคำ',
    blurb: 'Scores how close two words are in meaning, from vectors learned on Thai text.',
    model: 'Skip-gram word vectors',
    score: null,
  },
  {
    slug: 'pos',
    nav: 'POS',
    title: 'Part-of-speech tags',
    thai: 'ชนิดของคำ',
    blurb: 'Labels each word with one of 34 word classes: noun, verb, classifier, particle and so on.',
    model: 'Word embedding + Bi-LSTM',
    score: 'F1 95.48% micro, 82.41% macro',
  },
  {
    slug: 'sentiment',
    nav: 'Sentiment',
    title: 'Review sentiment',
    thai: 'ความรู้สึก',
    blurb: 'Reads a short review and says whether it is positive or negative.',
    model: 'Convolutional network, 3 filter widths',
    score: null,
  },
  {
    slug: 'topics',
    nav: 'Topics',
    title: 'Topic labels',
    thai: 'หมวดหมู่',
    blurb: 'Suggests which of 38 Pantip forum tags fit a post. A post can have several.',
    model: 'Convolutional network, multi-label',
    score: null,
  },
]
