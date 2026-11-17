import TopicsDemo from '@/components/demos/topics-demo'
import Flow from '@/components/flow'
import C from '@/lib/nlp/constants.json'
import type { TaskContent } from './types'

export const topics: TaskContent = {
  Demo: TopicsDemo,
  task: (
    <>
      <p>
        Multi-label classification gives a text every label that fits, not just one. Here the texts are posts from Pantip&apos;s
        mobile phone and network forum, and the labels are the {C.topics.tags.length} tags their authors chose: phone brands,
        mobile operators, operating systems and topics such as complaints or switching networks.
      </p>
      <p className="text-sm text-mute" lang="th">{C.topics.tags.join(' · ')}</p>
    </>
  ),
  io: (
    <>
      <Flow steps={['post', 'tokenizer → words', 'first 200 word ids', 'CNN', '38 independent probabilities', '5 most likely tags']} />
      <p>
        The post is split into words and the first 200 become ids from a vocabulary of about 50,000 words. The last layer uses a sigmoid
        per tag instead of one softmax over all tags, so each tag gets its own probability between 0 and 1 and several can be
        high at once.
      </p>
      <p>
        The library also tuned a cut-off per tag for deciding which tags apply. Several of those cut-offs are 0.005, which
        accepts AIS, 3G and dtac on every post, so this page shows the five most likely tags instead.
      </p>
    </>
  ),
  architecture: [
    { model: 'tokenizer', intro: <p>Step 1, the tokenizer:</p> },
    {
      model: 'categorization',
      intro: (
        <p>
          Step 2, a convolutional network with three branches whose filters are 2, 4 and 8 words wide, each stacked twice. The
          pooled branches are joined, flattened and passed through a dense layer to 38 sigmoid outputs.
        </p>
      ),
    },
  ],
  data: (
    <>
      <p>The Bailarn library does not report a test score for this model, so here is what it does on the 200 Pantip sample posts that ship with it:</p>
      <ul className="list-disc pl-5 flex flex-col gap-1">
        <li>its most likely tag is one of the post&apos;s real tags for 45 posts (23%);</li>
        <li>at least one of its five most likely tags is a real tag for 138 posts (69%).</li>
      </ul>
      <p>
        These posts may have been part of the training data, so the true figures are likely lower. The model leans on tags that
        are common in the forum, such as truemove and Mobile Application, which is why they appear on many posts.
      </p>
    </>
  ),
  limits: [
    <>Treat the tags as suggestions. The figures above are weak, and this is the least reliable model on the site.</>,
    <>It only knows this one forum and the tags it had when the data was collected; it has no tag for anything else.</>,
    <>It reads the first 200 words of a post.</>,
  ],
}
