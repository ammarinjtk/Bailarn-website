import SentimentDemo from '@/components/demos/sentiment-demo'
import Flow from '@/components/flow'
import type { TaskContent } from './types'

export const sentiment: TaskContent = {
  Demo: SentimentDemo,
  task: (
    <p>
      Sentiment analysis reads a piece of text and says whether its tone is positive or negative. Here the text is a restaurant
      review. Tone is often carried by a few words and phrases rather than by the sentence structure, which is why a model that
      looks for short patterns works well for it.
    </p>
  ),
  io: (
    <>
      <Flow steps={['review', 'tokenizer → words', 'first 60 word ids', 'CNN', 'probability of positive and negative']} />
      <p>
        The review is split into words and the first 60 become ids from a vocabulary of about 55,000 words; shorter reviews are padded
        with 0. The model returns two probabilities that add up to 1.
      </p>
    </>
  ),
  architecture: [
    { model: 'tokenizer', intro: <p>Step 1, the tokenizer:</p> },
    {
      model: 'sentiment',
      intro: (
        <p>
          Step 2, a convolutional network in the style of Kim (2014). Three branches slide filters 5, 3 and 2 words wide over the
          embedded review, so each filter learns to spot a short phrase. Their outputs are pooled, joined and passed to a small
          dense classifier.
        </p>
      ),
    },
  ],
  data: (
    <>
      <p>The Bailarn library does not report a test score for this model.</p>
      <p>
        As a sanity check only, it labelled 8 of the 10 Wongnai sample reviews that ship with the library correctly. Ten
        reviews is far too few to measure accuracy, and they may have been part of the training data.
      </p>
    </>
  ),
  limits: [
    <>It only reads the first 60 words.</>,
    <>It has two classes. A mixed or neutral review is still forced into one of them, often with a probability near 0.5.</>,
    <>It was built on Wongnai restaurant reviews. Reviews of other things, and sarcasm, are less reliable.</>,
  ],
}
