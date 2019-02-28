import React, { Component } from "react";

import "./App.css";
import "./simple-sidebar.css";

import { Route, HashRouter } from "react-router-dom";
import TokenizerUI from "./components/tokenizer";
import WordEmbedderUI from "./components/word-embedder";
import NERUI from "./components/ner";
import PosUI from "./components/pos";
import NavBar from "./components/nav_bar";
import MenuUI from "./components/menu";
import KeywordExpansionUI from "./components/keyword_expansion";
import SentimentUI from "./components/sentiment";
import TextClassifyUI from "./components/text_classify";
import AboutUI from "./components/about";
import HomeUI from "./components/home";

class App extends Component {
  footer() {
    return (
      <div>
        <div
          style={{
            display: "block",
            padding: "20px",
            height: "60px",
            width: "100%"
          }}
        />
        <div
          class="footer c1 mt-4"
          style={{
            borderTop: "1px solid #E7E7E7",
            textAlign: "center",
            padding: "20px",
            position: "fixed",
            left: "0",
            bottom: "0",
            height: "60px",
            width: "100%"
          }}
        />
      </div>
    );
  }

  render() {
    // console.log(process.env.PUBLIC_URL);
    return (
      <HashRouter>
        <div>
          <div class="row" style={{ height: "51px" }}>
            <div class="col-md-12">
              <NavBar />
            </div>
          </div>
          <div class="row" id="wrapper">
            <MenuUI
              head={["Foundation", "Application"]}
              detail={[
                {
                  Tokenization: "/tokenization",
                  "Word Embedding": "/word-embedding",
                  "Named Entity Recognition": "/ner",
                  "Part of Speech Tagging": "/pos"
                },
                {
                  "Sentiment Analysis": "/sentiment-analyzer",
                  "Text Categorization": "/text-categorization",
                  "Keyword Expansion": "/keyword-expansion"
                }
              ]}
            />
            <div
              class="col page-content-wrapper"
              style={{ "padding-top": "15px" }}
            >
              <Route exact path="/tokenization" component={TokenizerUI} />
              <Route exact path="/word-embedding" component={WordEmbedderUI} />

              <Route exact path="/ner" component={NERUI} />
              <Route exact path="/pos" component={PosUI} />

              <Route
                exact
                path="/keyword-expansion"
                component={KeywordExpansionUI}
              />
              <Route
                exact
                path="/text-categorization"
                component={TextClassifyUI}
              />
              <Route exact path="/sentiment-analyzer" component={SentimentUI} />

              <Route exact path="/about" component={AboutUI} />
              {/* <Route path="/home" component={HomeUI} /> */}
              <Route exact path="/" component={HomeUI} />
            </div>
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default App;
