// One entry per demo, ordered lexical → syntactic → semantic; the home page and nav follow this order.
// score: published result on the BEST2010_I2R test set (Bailarn-python-library README); null where none was reported.
// level: the linguistic level the task works at. Lexical and syntactic follow the JCSSE 2018 paper's framing.
export type Level = 'Lexical' | 'Syntactic' | 'Semantic'

export type Task = {
  level: Level
  slug: string
  nav: string // the usual short form of the title, for the desktop nav
  title: string
  thai: string
  blurb: string
  model: string
  score: string | null
}

export const TASKS: Task[] = [
  {
    slug: 'tokenize',
    level: 'Lexical',
    nav: 'Segmentation',
    title: 'Word segmentation',
    thai: 'ตัดคำ',
    blurb: 'Thai is written without spaces between words. The tokenizer reads character by character and marks where each word ends.',
    model: 'Character Bi-LSTM, 3 layers',
    score: 'F1 98.58%',
  },
  {
    slug: 'pos',
    level: 'Syntactic',
    nav: 'POS tagging',
    title: 'Part-of-speech tagging',
    thai: 'ชนิดของคำ',
    blurb: 'Labels each word with one of 34 word classes: noun, verb, classifier, particle and so on.',
    model: 'Word embedding + Bi-LSTM',
    score: 'F1 95.48% micro, 82.41% macro',
  },
  {
    slug: 'entities',
    level: 'Syntactic',
    nav: 'NER',
    title: 'Named entity recognition',
    thai: 'ชื่อเฉพาะ',
    blurb: 'Finds people, places, organisations, dates and measurements, and labels each one with its type.',
    model: 'Word embedding + Bi-LSTM',
    score: 'F1 79.59% micro, 62.10% macro',
  },
  {
    slug: 'embeddings',
    level: 'Semantic',
    nav: 'Embeddings',
    title: 'Word embeddings',
    thai: 'เวกเตอร์คำ',
    blurb: 'Scores how close two words are in meaning, from vectors learned on Thai text.',
    model: 'Skip-gram word vectors',
    score: null,
  },
  {
    slug: 'sentiment',
    level: 'Semantic',
    nav: 'Sentiment',
    title: 'Sentiment analysis',
    thai: 'ความรู้สึก',
    blurb: 'Reads a short restaurant review and says whether it is positive or negative.',
    model: 'Convolutional network, 3 filter widths',
    score: null,
  },
  {
    slug: 'topics',
    level: 'Semantic',
    nav: 'Classification',
    title: 'Multi-label text classification',
    thai: 'จัดหมวดหมู่ข้อความ',
    blurb: 'Suggests which of 38 tags from Pantip\'s mobile phone forum fit a post. A post can have several.',
    model: 'Convolutional network, multi-label',
    score: null,
  },
]
