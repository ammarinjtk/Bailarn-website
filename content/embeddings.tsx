import EmbeddingsDemo from '@/components/demos/embeddings-demo'
import Flow from '@/components/flow'
import type { TaskContent } from './types'

export const embeddings: TaskContent = {
  Demo: EmbeddingsDemo,
  task: (
    <>
      <p>
        A word embedding gives each word a list of numbers, a vector, learned from how the word is used. Words that appear in
        similar contexts end up with vectors that point in similar directions, so comparing two vectors gives a score for how
        alike two words are.
      </p>
      <p>The word-level models on this site (entities, parts of speech, sentiment, topics) each start with an embedding layer of the same kind, learned for their own task.</p>
    </>
  ),
  io: (
    <>
      <Flow steps={['two words', 'vocabulary ids', 'two 300-number vectors', 'cosine similarity', 'score from −1 to 1']} />
      <p>
        Each word is looked up in a 154,994-word vocabulary. The score is the cosine of the angle between the two vectors: 1
        means they point the same way, 0 means unrelated. A word that is not in the vocabulary has no vector, so the demo says so
        instead of guessing.
      </p>
    </>
  ),
  architecture: [{ model: 'word_embedder', intro: <p>The model is the learned table itself. The last layer normalises both vectors and multiplies them, which is the cosine similarity.</p> }],
  data: <p>Trained with gensim&apos;s Word2Vec using skip-gram: each word learns to predict the words around it. No test score was published for this model.</p>,
  limits: [
    <>Similar context is not the same as similar meaning. Opposites and related words, such as two days of the week, often score high.</>,
    <>It compares single words. A phrase has to be one entry in the vocabulary to have a vector.</>,
    <>This is the largest download on the site, about 100 MB.</>,
  ],
}
