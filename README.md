## Bailarn website

Thai NLP demos from the Bailarn master's thesis (Chulalongkorn University, 2017–2018), live at
https://bailarn.ammarinjtk.com. Every model runs in the visitor's browser with TensorFlow.js; nothing is sent to a server.

| Page | Task | Model |
|---|---|---|
| `/tokenize/` | Word segmentation | Character Bi-LSTM |
| `/pos/` | Part-of-speech tags | Word embedding + Bi-LSTM |
| `/entities/` | Named entities | Word embedding + Bi-LSTM |
| `/embeddings/` | Word similarity | Skip-gram word vectors |
| `/sentiment/` | Review sentiment | CNN |
| `/topics/` | Topic labels (multi-label) | CNN |

Paper: A. Jettakul et al., "A Comparative Study on Various Deep Learning Techniques for Thai NLP Lexical and Syntactic
Tasks on Noisy Data", JCSSE 2018. https://ieeexplore.ieee.org/document/8457368

### Development

    npm install
    npm run models   # converts models/ to float16 shards in public/models (also runs before every build)
    npm run dev
    npm test         # golden tests against the served models

`npm run build` writes a static site to `out/`, which the Dockerfile serves with nginx on Cloud Run.

### Layout

- `models/`: the trained Keras models as exported for TensorFlow.js (float32, the source of truth)
- `scripts/build-models.mjs`: float16 conversion, `.bin` shards, vocabularies, download sizes
- `scripts/export_constants.py`: character index and label lists from Bailarn-python-library → `lib/nlp/constants.json`
- `lib/nlp/pipeline.ts`: encoding and decoding per task, shared by the browser and the tests
- `lib/nlp/runtime.ts`: loads TensorFlow.js and models on first use, with download progress
- `lib/architecture.ts`: builds the architecture diagrams from each `model.json` at build time
- `content/`: the explainer text for each demo page
