import React, { Component } from "react";

import * as utils from "../utils/utils";
import * as constant from "../utils/tokenizer";

import ResultUI from "./result";
import ExplainUI from "./explanation";
import InputUI, { typeOfInputValue } from "./input";
import ExampleUI from "./example";

import * as tf from "@tensorflow/tfjs";

class TokenizerUI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: "",
      isShowOutput: false,
      isTextFormat: true,
      examples: [
        "สตีฟกินกล้วย",
        "ฉันอยากรู้จักเธอ",
        "อีก 7 วันหมดเขตเปิดให้ขอเลือกตั้ง",
        "นายกฯ เดินหน้าแก้ปัญหาน้ำยั่งยืน"
      ],
      inputType: "",
      old_output: null,
      outputStatus: 1,
      wordList: [],
      isReady: false
    };

    this.setInput = this.setInput.bind(this);
    this.char_index = utils.build_tag_index(
      constant.CHARACTER_LIST,
      constant.CHAR_START_INDEX
    );
    this.tokenizer_model = undefined;
    this.tokenizer_model = this.load();
  }

  load = async () => {
    console.log("Loading model!");
    this.tokenizer_model = await tf.loadModel(
      "https://raw.githubusercontent.com/ammarinjtk/thai-nlp/master/src/models/tokenizer/model.json"
    );
    console.log("Loading model Successful!");
    // console.log(this.tokenizer_model.summary());
    this.setState({ isReady: true });
  };

  getPrediction = async (tokenizer_model, char_index, word) => {
    var x = [];
    var readable_x = [];

    for (var i = 0; i < word.length; i++) {
      var char = word[i];
      if (char in char_index) {
        x.push(char_index[char]);
      } else {
        x.push(constant.UNKNOW_CHAR_INDEX);
      }
      readable_x.push(char);
    }

    // padding
    x = utils.pad([x], constant.SEQUENCE_LENGTH, constant.PAD_CHAR_INDEX);
    readable_x = utils.pad(
      [readable_x],
      constant.SEQUENCE_LENGTH,
      constant.READABLE_PAD_CHAR
    );

    // casting
    x = tf.tensor2d(x);

    const output = tokenizer_model.predict(x);

    var y_pred = output.argMax(2);
    y_pred = y_pred.flatten();

    var all_result = [];
    for (var sample_idx = 0; sample_idx < readable_x[0].length; sample_idx++) {
      var label = y_pred.get([sample_idx]);
      var char = readable_x[0][sample_idx];

      // Pad label
      if (label === constant.PAD_TAG_INDEX) continue;
      // Pad char
      if (char === constant.READABLE_PAD_CHAR) continue;

      all_result.push(char);

      // Skip tag for spacebar character
      if (char === constant.SPACEBAR) continue;

      // Tag at segmented point
      if (label !== constant.NON_SEGMENT_TAG_INDEX) {
        all_result.push("|");
      }
    }
    console.log(all_result.join(""));

    return all_result
      .join("")
      .split("|")
      .filter(function(el) {
        return el != "";
      });
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log("hit");
    console.log(this.state.inputValue);

    this.setState({
      inputType: typeOfInputValue(this.state.inputValue) // URL or TEXT
    });

    if (this.state.inputValue !== "") {
      var val = this.state.inputValue;
      // Handle URL type
      if (this.state.inputType === "URL") {
        val = "URLs are still working in progress.";
      }
      this.getPrediction(this.tokenizer_model, this.char_index, val).then(
        words => {
          this.setState({ wordList: words, isShowOutput: true });
        }
      );
    }
  };

  isReady() {
    if (!this.state.isReady) {
      console.log("Not ready!");
      return true;
    } else {
      console.log("Ready!");
      return false;
    }
  }

  genDataForCopy() {
    if (this.state.isShowOutput) return this.state.wordList.join("|");
    return "";
  }

  genTextData() {
    return (
      <div style={{ lineHeight: "200%" }}>
        {this.state.wordList.map(word => (
          <span
            style={{
              borderStyle: "solid",
              wordWrap: "normal",
              borderColor: "#F46881",
              padding: "0px 5px",
              borderWidth: "0 1px 0 0"
            }}
          >
            {word}
          </span>
        ))}
      </div>
    );
  }

  genJSONData() {
    return this.state.wordList;
  }

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

  render() {
    return (
      <div class="container">
        <div class="row">
          <div class="col-12">
            <ExplainUI
              topic="Tokenization"
              model_description="The process of identifying the boundaries between texts in natural languages to divide these texts into the meaningful unit as word."
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
                dataForCopy={this.genDataForCopy()}
                isTextFormat={true}
                textData={this.genTextData()}
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

export default TokenizerUI;
