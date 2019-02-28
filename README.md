# Thai NLP platform

[![Build Status](https://travis-ci.org/ammarinjtk/thai-nlp.svg?branch=master)](https://travis-ci.org/ammarinjtk/thai-nlp)

The project aims to develop Thai NLP Library based on Deep Learning techniques. With this library, users can train the model on their own dataset using the provided deep learning model structure and utilities. Moreover, Thai NLP Library also provides pre-trained models to process Thai text instantly. All pre-trained models was evaluated and compared across various deep learning techniques proposed in the previous researches in the experiments.

- `/tokenization`: Identify the boundaries between texts in natural languages to divide these texts into the meaningful unit as word.
- `/word-embedding`: Map a word from the vocabulary to vectors of real numbers involving a mathematical embedding.
- `/ner`: Predict Named entity of each words in a sentence.
- `/pos`: Predict Part-of-Speech of each words in a sentence.
- `/keyword-expansion`: Find the related words from the vocabulary to the query word.
- `/text-categorization`: Predict the pre-defined classes of sentences on the specific domain.
- `/sentiment-analyzer`: Predict the Sentiment of a document including Positive, Neutral and Negative sentiment.

# Prerequisite

- npm 5.6.0 or later
- node 10.0.0 or later

# Installation

```
git clone  https://github.com/KawinL/Thai_NLP_web_ui.git
cd Thai_NLP_web_ui
npm install
```

# Start server

```
npm start
```

the server will listening on port 3000

# File Functionality

- `public/`: Contain static file to serve to client
- `src/`
  - `action/`
    - `index.js`
      - Contain all APIs connecting to the back-end server.
      - Receive parameter from corresponding component and **transform** it to fit the requirement of APIs.
      - Transfer data to reducers
  - `componentes/`Contain all React component that
    - `about.jsx`
      - UI of about page
    - `dropdown.jsx`
      - Dropdown UI component
    - `example.jsx`
      - Example UI component
    - `explanation.jsx`
      - Explanation UI component
    - `home.jsx`
      - UI of home page
    - `input.jsx`
      - Input UI component
    - `keyword_expansion.jsx`
      - UI of keyword_expansion page
      - Send user input to `keywordExpand` function in `action/index.js`
    - `menu.jsx`
      - Input UI component
    - `nav_bar.css`
      - css for nav bar
    - `nav_bar.jsx`
      - nav bar UI component
    - `ner_tag_list.jsx`
      - constant static value including name entity tag list, and name entity tag description.
    - `ner.jsx`
      - UI of ner page
      - Send user input to `NER` function in `action/index.js`
    - `pos_color.jsx`
      - Contain pos tag colors
    - `pos.jsx`
      - UI of pos page
      - Send user input to `POS` function in `action/index.js`
    - `posresult.jsx`
      - Pos result UI component
      - Constant static value including part of speech tag list, and part of speech tag description.
    - `result.jsx`
      - result UI component
    - `sentiment.jsx`
      - UI of sentiment page
      - Send user input to `sentiment` function in `action/index.js`
    - `style.css`
    - `text_classify.jsx`
      - UI of text_classify page
      - Send user input to `classify` function in `action/index.js`
    - `tokenizer.jsx`
      - UI of tokenizer page
      - Send user input to `tokenizeWord` function in `action/index.js`
    - `word-embedder.jsx`
      - UI of word-embedder page
      - Send user input to `vectorizeWord` function in `action/index.js`
  - `reducer/`
    - `index.js`
      - Combine all data from other reducer
    - `keyword_expansion_reducer.js`
      - Transform data from `keywordExpand` function in `action/index.js` to useable structure for `keyword_expansion.jsx`
    - `name_entity_recognizer_reducer.js`
      - Transform data from `NER`function in `action/index.js` to useable structure for `ner.jsx`
    - `part_of_speech_reducer.js`
      - Transform data from `POS`function in `action/index.js` to useable structure for `pos.jsx`
    - `sentiment_reducer.js`
      - Transform data from `sentiment`function in `action/index.js` to useable structure for `sentiment.jsx`
    - `text_classifier_reducer.js`
      - Transform data from `classify`function in `action/index.js` to useable structure for `text_classify.jsx`
    - `tokenized_word_reducer.js`
      - Transform data from `tokenizeWord`function in `action/index.js` to useable structure for `tokenizer.jsx`
    - `vectorize_word_reducer.js`
      - Transform data from `vectorizeWord`function in `action/index.js` to useable structure for `word-embedder.jsx`
  - `images/`: Contain all image used in website
  - `App.css`
    - css for `App.js`
  - `App.js`
    - The root component of the website, The others component must use from this component
  - `index.css`
    - css for `index.js`
  - `index.js`
    - The component that connecting the React component and html template
  - `registerServiceWorker.js`
    - Auto generate by create-react-app
  - `simple-sidebar.css`
    - css for sidebar
