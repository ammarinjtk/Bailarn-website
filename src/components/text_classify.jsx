import React, { Component } from "react";

import "react-dropdown/style.css";

import ResultUI from "./result";
import ExplainUI from "./explanation";
import InputUI, { typeOfInputValue } from "./input";
import ExampleUI from "./example";
import DropdownUI from "./dropdown";

import * as tf from "@tensorflow/tfjs";
import * as utils from "../utils/utils";
import * as categorization_constant from "../utils/categorization";
import * as tokenizer_constant from "../utils/tokenizer";

class TextClassifierUI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: "",
      isShowOutput: false,
      isTextFormat: true,
      examples: [
        "ปัญหาการสั่งซื้อโทรศัพท์ผ่านเว็บไซต์",
        "Iphone มีปัญหาจอแตกเปิดไม่ติด",
        "รบกวนถาม Truemove เรื่องย้ายค่ายเบอร์เดิม",
        "SamsungGalaxy แบตเสื่อมครับ"
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
    this.tag_index = utils.build_tag_index(categorization_constant.TAG_LIST, 0);
    this.tokenizer_model = this.load_tokenizer();
    this.categorization_model = this.load_categorization();
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
      "https://raw.githubusercontent.com/ammarinjtk/thai-nlp/master/src/models/categorization/categorization_word_index.json"
    )
      .then(res => res.json())
      .then(out => {
        this.word_index = out;
        console.log("Index for UNK word: ", this.word_index["UNK"]);
        console.log("Index for PAD word: ", this.word_index["<PAD>"]);
      })
      .catch(err => console.error(err));
  };

  load_categorization = async () => {
    console.log("Loading categorization model!");
    this.categorization_model = await tf.loadModel(
      "https://raw.githubusercontent.com/ammarinjtk/thai-nlp/master/src/models/categorization/model.json"
    );
    console.log("Loading categorization model Successful!");
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

  getCategorization = async (categorization_model, word_index, tokens) => {
    const inv_tag_index = utils.swap(this.tag_index);

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
    x = utils.pad([x], categorization_constant.SEQUENCE_LENGTH, 0);
    // readable_x = utils.pad([readable_x], ner_utils.SEQUENCE_LENGTH, "PAD");
    console.log(x);

    x = tf.tensor2d(x);

    var output = categorization_model.predict(x);
    // console.log(output);
    var y_pred = output.dataSync();
    console.log(y_pred);

    var confidence_tag_list = {};

    for (i = 0; i < y_pred.length; i++) {
      if (y_pred[i] > 0.1) {
        confidence_tag_list[inv_tag_index[i]] = y_pred[i];
      }
    }

    // Sort confidence
    var sorted_confidence_tag_list = Object.keys(confidence_tag_list).map(
      function(key) {
        return [key, confidence_tag_list[key]];
      }
    );
    sorted_confidence_tag_list.sort(function(first, second) {
      return second[1] - first[1];
    });

    var top_5_confidence_tag_list = [];
    for (i = 0; i < 5; i++) {
      top_5_confidence_tag_list.push({
        tag: sorted_confidence_tag_list[i][0],
        confidence: sorted_confidence_tag_list[i][1]
      });
    }

    console.log(top_5_confidence_tag_list);

    return top_5_confidence_tag_list;
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
        this.getCategorization(
          this.categorization_model,
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
    return (
      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Tag</th>
            <th scope="col">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {this.state.confidence_tag_list.map(row => {
            return (
              <tr>
                <td>{row.tag}</td>
                <td>{Number(row.confidence.toFixed(4))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
              topic={<div>Text Categorization</div>}
              dropdown={
                <DropdownUI style={{ width: "150px" }} options={["mobile"]} />
              }
              explanation={
                <div class="alert alert-success" role="alert">
                  <div class="text-dark">
                    Put <strong>Thai Text</strong> or{" "}
                    <strong> Website URL </strong> in the box below and hit{" "}
                    <strong> Analyze </strong>button !
                  </div>
                </div>
              }
              model_description="Predict the pre-defined classes of sentences on the specific domain. The model returns the confidence of each class"
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

export default TextClassifierUI;
