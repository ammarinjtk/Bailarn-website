import PosDemo from '@/components/demos/pos-demo'
import Flow from '@/components/flow'
import { POS_FAMILIES } from '@/lib/nlp/pos-tags'
import type { TaskContent } from './types'

const th = (s: string) => <span lang="th" className="font-display">{s}</span>

export const pos: TaskContent = {
  Demo: PosDemo,
  task: (
    <>
      <p>
        Part-of-speech tagging gives each word its word class: noun, verb, classifier, particle and so on. Thai words do not
        change form to show their class, so the same word can be a noun in one sentence and a verb in the next, and the tagger has
        to decide from the words around it.
      </p>
      <p>
        Some classes barely exist in English. Classifiers, such as {th('ตัว')} in {th('แมวสามตัว')} (three cats), are required when
        counting, and prefixes such as {th('ความ')} and {th('การ')} turn a verb into a noun.
      </p>
    </>
  ),
  io: (
    <>
      <Flow steps={['Thai text', 'tokenizer → words', 'one id per word', 'rows of 60, padded with 0', 'Bi-LSTM', '35 scores per word', 'one tag per word']} />
      <p>Each word becomes an id from a 55,708-word vocabulary, and the model scores 35 classes per word: padding plus the 34 word classes below.</p>
      <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
        {POS_FAMILIES.map((f) => (
          <div key={f.family}>
            <dt className="font-medium">{f.family}</dt>
            <dd className="text-mute">{f.tags.map(([t, d]) => (d ? `${t} ${d}` : t)).join(' · ')}</dd>
          </div>
        ))}
      </dl>
      <p className="text-sm text-mute">Tags without a description follow the BEST2010_I2R annotation guideline; their exact definitions are not reproduced here.</p>
    </>
  ),
  architecture: [
    { model: 'tokenizer', intro: <p>Step 1, the tokenizer:</p> },
    { model: 'pos', intro: <p>Step 2, the tagger: a 300-dimension word embedding and one bidirectional LSTM. It accepts any length; the site feeds it rows of 60 words, as in training.</p> },
  ],
  data: <p>Trained on BEST2010_I2R, NECTEC&apos;s annotated Thai corpus. F1 on its test set: 95.48% micro, 82.41% macro. As with entities, the rare classes pull the macro score down.</p>,
  limits: [
    <>Segmentation mistakes carry through to the tags.</>,
    <>A word outside the vocabulary is tagged from its context alone, which suits nouns and names better than rarer classes.</>,
    <>The tagset is the corpus&apos;s own, so the tags do not map one to one onto those of other Thai corpora.</>,
  ],
}
