import TokenizeDemo from '@/components/demos/tokenize-demo'
import Flow from '@/components/flow'
import ProofLine from '@/components/proof-line'
import type { TaskContent } from './types'

const th = (s: string) => <span lang="th" className="font-display">{s}</span>

export const tokenize: TaskContent = {
  Demo: TokenizeDemo,
  task: (
    <>
      <p>
        Word segmentation splits a run of characters into words. English marks most word boundaries with spaces; Thai writes a
        whole phrase as one unbroken run and uses spaces mostly between phrases. The same characters can also split in more than
        one valid way: {th('ตากลม')} reads as <ProofLine words={['ตา', 'กลม']} className="font-display" /> (round eyes) or{' '}
        <ProofLine words={['ตาก', 'ลม']} className="font-display" /> (to sit out in the wind), and only the context decides.
      </p>
      <p>Every other task on this site works on words, so a segmentation mistake carries into all of them.</p>
    </>
  ),
  io: (
    <>
      <Flow steps={['Thai text', 'one id per character', 'rows of 60, padded with 0', 'Bi-LSTM', '36 scores per character', 'words']} />
      <p>
        Each character becomes an id from a 74-entry alphabet: every Thai letter, vowel and tone mark has its own id, while all
        Latin letters share one, all digits share one and all punctuation shares one. Anything else gets the unknown id.
      </p>
      <p>
        For every character the model scores 36 labels: padding, &ldquo;not the end of a word&rdquo;, or one of 34 word classes,
        which means &ldquo;a word ends here, and it is this kind of word&rdquo;. The table under the demo shows these labels for
        your own text.
      </p>
    </>
  ),
  architecture: [{ model: 'tokenizer', intro: <p>Three stacked bidirectional LSTMs read the characters left to right and right to left, so each label sees the characters on both sides.</p> }],
  data: <p>Trained on BEST2010_I2R, NECTEC&apos;s annotated Thai corpus. F1 on its test set: 98.58%.</p>,
  limits: [
    <>Text is read in rows of 60 characters, so a word that crosses from one row to the next can be split.</>,
    <>The model does not always mark the last character of the text as a word end (try {th('ตากลม')} and open the table). The site adds that boundary itself.</>,
    <>It was trained on text written before 2018. New words, slang and mixed-in English are more likely to be split wrongly.</>,
    <>The word classes in the table are a by-product of training. The part-of-speech demo uses a model trained for that task.</>,
  ],
}
