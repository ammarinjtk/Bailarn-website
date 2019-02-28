import React, { Component } from "react";

import "./App.css";
import "./simple-sidebar.css";

import { BrowserRouter, Route } from "react-router-dom";
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
    return (
      <BrowserRouter>
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
              <Route
                path={process.env.PUBLIC_URL + "/tokenization"}
                component={TokenizerUI}
              />
              <Route
                path={process.env.PUBLIC_URL + "/word-embedding"}
                component={WordEmbedderUI}
              />

              <Route path={process.env.PUBLIC_URL + "/ner"} component={NERUI} />
              <Route path={process.env.PUBLIC_URL + "/pos"} component={PosUI} />

              <Route
                path={process.env.PUBLIC_URL + "/keyword-expansion"}
                component={KeywordExpansionUI}
              />
              <Route
                path={process.env.PUBLIC_URL + "/text-categorization"}
                component={TextClassifyUI}
              />
              <Route
                path={process.env.PUBLIC_URL + "/sentiment-analyzer"}
                component={SentimentUI}
              />

              <Route
                path={process.env.PUBLIC_URL + "/about"}
                component={AboutUI}
              />
              {/* <Route exact path="/thainlp" component={HomeUI} /> */}
              <Route path={process.env.PUBLIC_URL + "/"} component={HomeUI} />
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
