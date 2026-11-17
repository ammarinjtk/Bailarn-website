import EntitiesDemo from '@/components/demos/entities-demo'
import Flow from '@/components/flow'
import { ENTITY_TYPES } from '@/lib/nlp/entity-types'
import type { TaskContent } from './types'

const th = (s: string) => <span lang="th" className="font-display">{s}</span>

export const entities: TaskContent = {
  Demo: EntitiesDemo,
  task: (
    <>
      <p>
        Named entity recognition finds the words that name something, such as a person, an organisation, a place, a date or an
        amount, and says what kind of thing each one is. English systems get a strong hint from capital letters. Thai has none,
        so the model has to judge from the surrounding words.
      </p>
      <p>The BEST2010 scheme has {Object.keys(ENTITY_TYPES).length} entity types: {Object.values(ENTITY_TYPES).join(', ').toLowerCase()}.</p>
    </>
  ),
  io: (
    <>
      <Flow steps={['Thai text', 'tokenizer → words', 'one id per word', 'rows of 60, padded with 0', 'Bi-LSTM', '39 scores per word', 'entities']} />
      <p>
        The text is first split into words by the tokenizer. Each word becomes an id from a 55,708-word vocabulary; words outside
        it share one &ldquo;unknown&rdquo; id.
      </p>
      <p>
        The model gives every word one of 39 tags: an entity type with _B for the first word of the entity or _I for a word that
        continues it, O for a word outside any entity, and a few rare tags from the corpus. Consecutive _B and _I words of the
        same type are joined into one entity.
      </p>
    </>
  ),
  architecture: [
    { model: 'tokenizer', intro: <p>Step 1, the tokenizer (see the word segmentation demo):</p> },
    { model: 'ner', intro: <p>Step 2, the entity model: a 300-dimension word embedding, one bidirectional LSTM, then a hidden dense layer before the 39-way output.</p> },
  ],
  data: (
    <>
      <p>Trained on BEST2010_I2R, NECTEC&apos;s annotated Thai corpus. F1 on its test set: 79.59% micro, 62.10% macro.</p>
      <p>
        Micro F1 counts every tagged word equally, so the common types (people, places) dominate it. Macro F1 averages the
        types equally, so rare types such as brands and abbreviated titles pull it down. The gap says the model is reliable on
        the common types and weaker on the rare ones.
      </p>
    </>
  ),
  limits: [
    <>Segmentation mistakes carry through: if the tokenizer splits a name in the wrong place, the entity is wrong too.</>,
    <>A word outside the vocabulary loses its identity, so a new name is recognised only from its context.</>,
    <>It makes type mistakes a person would not. In the first example it tags {th('เกาหลีใต้')} (South Korea) as an organisation rather than a location.</>,
    <>Text is read in rows of 60 words.</>,
  ],
}
