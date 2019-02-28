import React, { Component } from "react";

import ResultUI from "./result";
import ExplainUI from "./explanation";
import InputUI, { typeOfInputValue } from "./input";
import ExampleUI from "./example";
import DropdownUI from "./dropdown";

import * as tf from "@tensorflow/tfjs";
import * as utils from "../utils/utils";

class KeywordExpansionUI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: "",
      isShowOutput: false,
      isTextFormat: true,
      examples: ["โทรศัพท์", "มือถือ", "ไอโฟน", "samsung"],
      inputType: "",
      old_output: null,
      outputStatus: 1,
      similar_word_list: [],
      isModelReady: false,
      isWordIndexReady: false
    };

    this.setInput = this.setInput.bind(this);
    this.keyword_expansion_model = this.load_keyword_expansion();
    this.word_index = this.load_word_index();
  }

  load_word_index = async () => {
    fetch(
      "https://raw.githubusercontent.com/ammarinjtk/thai-nlp/master/src/models/keyword_expansion/keyword_expansion_word_index.json"
    )
      .then(res => res.json())
      .then(out => {
        this.word_index = out;
        this.setState({ isWordIndexReady: true });
        console.log("Loading word_index successful!");
      })
      .catch(err => console.error(err));
  };

  load_keyword_expansion = async () => {
    console.log("Loading keyword_expansion model!");
    this.keyword_expansion_model = await tf.loadModel(
      "https://raw.githubusercontent.com/ammarinjtk/thai-nlp/master/src/models/keyword_expansion/model.json"
    );
    console.log("Loading keyword_expansion successful!");
    this.setState({ isModelReady: true });
  };

  getSimilarity = async (keyword_expansion_model, word, vocab_size) => {
    // console.log(vocab_size);
    var sim = {};
    var in_arr1 = tf.tensor1d([word]);
    var in_arr2;
    for (var i = 0; i < vocab_size; i++) {
      in_arr2 = tf.tensor1d([i]);
      var out = keyword_expansion_model
        .predict([in_arr1, in_arr2])
        .dataSync()[0];
      // console.log(out);
      sim[i] = out;
    }
    return sim;
  };

  getKSimilarWords = async (
    keyword_expansion_model,
    top_k,
    word_index,
    token
  ) => {
    const inv_word_index = utils.swap(word_index);

    console.log(word_index);

    var word;
    // var vocab_size = Object.keys(word_index).length;
    if (token in word_index) {
      word = word_index[token];
    } else {
      // key doesn't exist, use default word which is มือถือ
      word = 0;
    }

    var output = await this.getSimilarity(keyword_expansion_model, word, 10);

    // Sort similarity
    var sorted_output = Object.keys(output).map(function(key) {
      return [key, output[key]];
    });
    sorted_output.sort(function(first, second) {
      return second[1] - first[1];
    });

    console.log(inv_word_index[sorted_output[0][0]]);

    var topKoutputs = [];
    for (var i = 1; i <= top_k; i++) {
      topKoutputs.push({
        word: inv_word_index[sorted_output[i][0]],
        similarity: sorted_output[i][1]
      });
    }
    console.log(topKoutputs);

    return topKoutputs;
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
      val = val.trim();
      this.getKSimilarWords(
        this.keyword_expansion_model,
        5,
        this.word_index,
        val
      ).then(outputs => {
        this.setState({ similar_word_list: outputs });
        this.setState({ isShowOutput: true });
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

  genTable() {
    return (
      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Expanded Keyword</th>
            <th scope="col">Similarity</th>
          </tr>
        </thead>
        <tbody>
          {this.state.similar_word_list.map(row => {
            return (
              <tr>
                <td>{row.word}</td>
                <td>{Number(row.similarity.toFixed(4))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  isDisable() {
    if (this.state.isModelReady && this.state.isWordIndexReady) {
      // console.log("Ready!");
      return false;
    } else {
      // console.log("Not Ready!");
      return true;
    }
  }

  genJSONData() {
    var json = {
      similar_word: [],
      similarity: []
    };
    for (var i = 0; i < this.state.similar_word_list.length; i++) {
      json["similar_word"].push(this.state.similar_word_list[i].word);
      json["similarity"].push(this.state.similar_word_list[i].similarity);
    }
    return json;
  }

  render() {
    return (
      <div class="container">
        <div class="row">
          <div class="col-12">
            <ExplainUI
              model_description="The process of finding the related words from the vocabulary to the query word."
              topic={<div>Keyword Expansion</div>}
              dropdown={
                <DropdownUI style={{ width: "150px" }} options={["mobile"]} />
              }
              explanation={
                <div class="alert alert-success" role="alert">
                  <div class="text-dark">
                    Put <strong>Thai word </strong>in the box below and hit{" "}
                    <strong> Analyze </strong> button! <br /> <br /> Noted:
                    because we ought to compute every possible word-pair
                    similarities so that this should take about 2-3 minutes.
                  </div>
                </div>
              }
            />
          </div>
          <div class="col-lg-8 col-sm-12">
            <div class="row">
              <div class="col-12">
                <InputUI
                  enableTypeCheck={false}
                  inputType={this.state.inputType}
                  inputValue={this.state.inputValue}
                  onInputChange={this.onInputChange}
                  placeholder="Ex: สวัสดี"
                />
              </div>

              <from
                onSubmit={this.handleSubmit}
                class="col-12 mt-4 text-center mb-4"
              >
                <button
                  type="button"
                  class="btn c2"
                  disabled={this.isDisable()}
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
                textData={this.genTable()}
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

export default KeywordExpansionUI;
