import React, { Component } from "react";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import Loading from "react-loading-components";

// import { sentiment } from "../action/index";

import * as tf from "@tensorflow/tfjs";
import * as utils from "../utils/utils";
import * as sentiment_constant from "../utils/sentiment";
import * as tokenizer_constant from "../utils/tokenizer";

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell
} from "recharts";

import ResultUI from "./result";
import ExplainUI from "./explanation";
import InputUI, { typeOfInputValue } from "./input";
import ExampleUI from "./example";
import DropdownUI from "./dropdown";
class SentimentUI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: "",
      isShowOutput: false,
      isTextFormat: true,
      examples: [
        "https://pantip.com/topic/37393081",
        "https://pantip.com/topic/37392967",
        "https://pantip.com/topic/37396578",
        "https://pantip.com/topic/37395554"
      ],
      inputType: "",
      old_output: null,
      outputStatus: 1,
      token_list: [],
      confidence_tag_list: [],
      isReady: false
    };

    this.setInput = this.setInput.bind(this);
    this.char_index = utils.build_tag_index(
      tokenizer_constant.CHARACTER_LIST,
      tokenizer_constant.CHAR_START_INDEX
    );
    this.tag_index = utils.build_tag_index(sentiment_constant.TAG_LIST, 0);
    this.tokenizer_model = this.load_tokenizer();
    this.sentiment_model = this.load_sentiment();
    this.word_index = this.load_word_index();
  }

  load_tokenizer = async () => {
    console.log("Loading tokenizer model!");
    this.tokenizer_model = await tf.loadModel(
      "https://raw.githubusercontent.com/ammarinjtk/thai-nlp/master/src/models/tokenizer/model.json"
    );
    console.log("Loading tokenizer model Successful!");
    // console.log(this.tokenizer_model.summary());
  };

  load_word_index = async () => {
    fetch(
      "https://raw.githubusercontent.com/ammarinjtk/thai-nlp/master/src/models/sentiment/sentiment_word_index.json"
    )
      .then(res => res.json())
      .then(out => {
        this.word_index = out;
        console.log("Index for UNK word: ", this.word_index["UNK"]);
        console.log("Index for PAD word: ", this.word_index["<PAD>"]);
      })
      .catch(err => console.error(err));
  };

  load_sentiment = async () => {
    console.log("Loading sentiment model!");
    this.sentiment_model = await tf.loadModel(
      "https://raw.githubusercontent.com/ammarinjtk/thai-nlp/dev/master/models/sentiment/model.json"
    );
    console.log("Loading sentiment model Successful!");
    this.setState({ isReady: true });
  };

  tokenize = async (tokenizer_model, char_index, word) => {
    var x = [];
    var readable_x = [];

    for (var i = 0; i < word.length; i++) {
      var char = word[i];
      if (char in char_index) {
        x.push(char_index[char]);
      } else {
        x.push(tokenizer_constant.UNKNOW_CHAR_INDEX);
      }
      readable_x.push(char);
    }

    // padding
    x = utils.pad(
      [x],
      tokenizer_constant.SEQUENCE_LENGTH,
      tokenizer_constant.PAD_CHAR_INDEX
    );
    readable_x = utils.pad(
      [readable_x],
      tokenizer_constant.SEQUENCE_LENGTH,
      tokenizer_constant.READABLE_PAD_CHAR
    );

    // casting
    x = tf.tensor2d(x);

    const output = tokenizer_model.predict(x);

    var y_pred = output.argMax(2);
    y_pred = y_pred.flatten();

    var all_result = [];
    for (var sample_idx = 0; sample_idx < readable_x[0].length; sample_idx++) {
      var label = y_pred.get([sample_idx]);
      char = readable_x[0][sample_idx];

      // Pad label
      if (label === tokenizer_constant.PAD_TAG_INDEX) continue;
      // Pad char
      if (char === tokenizer_constant.READABLE_PAD_CHAR) continue;

      all_result.push(char);

      // Skip tag for spacebar character
      if (char === tokenizer_constant.SPACEBAR) continue;

      // Tag at segmented point
      if (label !== tokenizer_constant.NON_SEGMENT_TAG_INDEX) {
        all_result.push("|");
      }
    }
    console.log(all_result.join(""));

    return all_result
      .join("")
      .split("|")
      .filter(function(el) {
        return el !== "";
      });
  };

  getSentiment = async (sentiment_model, word_index, tokens) => {
    var x = [];
    var readable_x = [];

    for (var i = 0; i < tokens.length; i++) {
      var word = tokens[i];
      if (word in word_index) {
        x.push(word_index[word]);
      } else {
        x.push("UNK");
      }
      readable_x.push(word);
    }
    // console.log(x);
    // padding
    x = utils.pad([x], sentiment_constant.SEQUENCE_LENGTH, 0);
    // readable_x = utils.pad([readable_x], ner_utils.SEQUENCE_LENGTH, "PAD");
    console.log(x);

    x = tf.tensor2d(x);

    var output = sentiment_model.predict(x);
    // console.log(output);
    var y_pred = output.dataSync();
    console.log(y_pred);

    return y_pred;
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log("hit");
    console.log(this.state.inputValue);

    this.setState({
      inputType: typeOfInputValue(this.state.inputValue) // URL or TEXT
    });

    if (this.state.inputValue !== "" && this.state.inputType === "TEXT") {
      var val = this.state.inputValue;
      this.tokenize(this.tokenizer_model, this.char_index, val).then(words => {
        // this.setState({ wordList: words, isShowOutput: true });
        this.setState({ token_list: words });
        this.getSentiment(
          this.sentiment_model,
          this.word_index,
          this.state.token_list
        ).then(tags => {
          this.setState({ confidence_tag_list: tags, isShowOutput: true });
        });
      });
    }
  };

  onInputChange = e => {
    const { value } = e.target;
    this.setState({ inputValue: value, inputType: typeOfInputValue(value) });
  };

  setInput(e) {
    console.log(e.target.innerText);
    this.setState({
      inputValue: e.target.innerText,
      inputType: typeOfInputValue(e.target.innerText)
    });
  }

  genGraph() {
    // console.log(this.state.confidence_tag_list[0]);
    // console.log(this.state.confidence_tag_list[1]);
    let datao = [
      {
        key: "positive",
        value: Number(this.state.confidence_tag_list[1].toFixed(4))
      },
      {
        key: "negative",
        value: Number(this.state.confidence_tag_list[0].toFixed(4))
      }
    ];
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datao}>
          <XAxis dataKey="key" />
          <YAxis yAxisId="a" dataKey="value" type="number" domain={[0, 1]} />

          <Tooltip />
          <CartesianGrid vertical={false} />
          <Bar yAxisId="a" dataKey="value">
            <Cell key="cell-1" fill="#41f47f" />
            <Cell key="cell-2" fill="#f44242" />
            <Cell key="cell-3" fill="#f44242" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  genJSONData() {
    var json = {
      token_list: this.state.token_list,
      confidence_tag_list: this.state.confidence_tag_list
    };
    return json;
  }

  isReady() {
    if (!this.state.isReady) {
      console.log("Not ready!");
      return true;
    } else {
      console.log("Ready!");
      return false;
    }
  }

  render() {
    return (
      <div class="container">
        <div class="row">
          <div class="col-12">
            <ExplainUI
              topic={<div>Sentiment Analysis</div>}
              dropdown={
                <DropdownUI style={{ width: "150px" }} options={["food"]} />
              }
              model_description="Predict the Sentiment of a document including Positive, Neutral and Negative sentiment. The model returns the probabilities of each sentiment class."
              explanation={
                <div class="alert alert-success" role="alert">
                  <div class="text-dark">
                    Put <strong>Thai Text</strong> or{" "}
                    <strong> Website URL </strong> in the box below and hit{" "}
                    <strong> Analyze </strong>button !
                  </div>
                </div>
              }
            />
          </div>
          <div class="col-lg-8 col-sm-12">
            <div class="row">
              <div class="col-12">
                <InputUI
                  inputType={this.state.inputType}
                  inputValue={this.state.inputValue}
                  onInputChange={this.onInputChange}
                  placeholder="Enter text or website url"
                />
              </div>

              <from
                onSubmit={this.handleSubmit}
                class="col-12 mt-4 text-center mb-4"
              >
                <button
                  type="button"
                  class="btn c2"
                  disabled={this.isReady()}
                  onClick={this.handleSubmit}
                >
                  Analyze
                </button>
              </from>
            </div>
          </div>
          <div class="col-lg-4 col-sm-12">
            <ExampleUI
              setInput={this.setInput}
              examples={this.state.examples}
            />
          </div>

          <div class="col-12">
            {this.state.isShowOutput ? (
              <ResultUI
                isTextFormat={true}
                textData={this.genGraph()}
                jsonData={this.genJSONData()}
              />
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    );
  }
}
// const mapStateToProps = state => {
//   return { sentimentValue: state.sentimentValue };
// };
// const mapDispatchToProps = dispatch => {
//   return bindActionCreators({ sentiment }, dispatch);
// };

export default SentimentUI;
