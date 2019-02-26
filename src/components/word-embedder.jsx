import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Loading from "react-loading-components";
// import Hyperlink from "react-native-hyperlink";
// import { Text } from "react-native";

import { vectorizeWord } from "../action/index";
import ResultUI from "./result";
import ExplainUI from "./word_embedder_explanation";
import InputUI, { typeOfInputValue } from "./input";
import ExampleUI from "./example";

import * as tf from "@tensorflow/tfjs";
import * as utils from "../utils/utils";
import * as word_embedder_constant from "../utils/word_embedder";

class WordEmbedderUI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: "",
      isShowOutput: false,
      isTextFormat: true,
      examples: [
        "แม่, พ่อ, พี่",
        "กิน, นอน, รับประทาน",
        "หมู, นก, หมา",
        "เร็ว, ช้า, สวย"
      ],
      inputType: "",
      explanationText: (
        <div>
          Put <strong>Thai words</strong> in the box below and hit{" "}
          <strong> Analyze </strong> button to see the similarity of the words!
        </div>
      ),
      old_output: null,
      outputStatus: 1,
      token_list: [],
      distance_list: [],
      isReady: false
    };

    this.setInput = this.setInput.bind(this);
    this.word_embedder_model = this.load_word_embedder();
    this.word_index = this.load_word_index();
  }

  load_word_index = async () => {
    fetch(
      "https://raw.githubusercontent.com/ammarinjtk/thai-nlp/master/src/models/word_embedder/word_embedder_word_index.json"
    )
      .then(res => res.json())
      .then(out => {
        this.word_index = out;
        console.log("Index for UNK word: ", this.word_index["UNK"]);
        console.log("Index for PAD word: ", this.word_index["<PAD>"]);
      })
      .catch(err => console.error(err));
  };

  load_word_embedder = async () => {
    console.log("Loading word embedder model!");
    this.word_embedder_model = await tf.loadModel(
      "https://raw.githubusercontent.com/ammarinjtk/thai-nlp/master/src/models/word_embedder/model.json"
    );
    console.log("Loading word embedder successful!");
    this.setState({ isReady: true });
  };

  getVectorDistance = async (word_embedder_model, word_index, tokens) => {
    const inv_word_index = utils.swap(word_index);
    // console.log(inv_tag_index);
    var dist_list = [];
    var dist = {};
    for (var i = 0; i < tokens.length; i++) {
      for (var j = i + 1; j < tokens.length; j++) {
        var in_arr1 = word_index[tokens[i]];
        var in_arr2 = word_index[tokens[j]];

        var in_arr1 = tf.tensor1d([in_arr1]);
        var in_arr2 = tf.tensor1d([in_arr2]);

        var d = word_embedder_model.predict([in_arr1, in_arr2]).dataSync();

        // console.log(d);

        var word_pair = [tokens[i], tokens[j]];
        dist[word_pair] = d;
      }
    }

    console.log(dist);

    // Create items array
    var sorted_dist = Object.keys(dist).map(function(key) {
      return [key, dist[key]];
    });

    // Sort the array based on the second element
    sorted_dist.sort(function(first, second) {
      return second[1] - first[1];
    });

    console.log(sorted_dist);

    for (var i = 0; i < sorted_dist.length; i++) {
      var word_list = sorted_dist[i][0].split(",");
      var d = sorted_dist[i][1];

      dist_list.push({
        w1: word_list[0],
        w2: word_list[1],
        distance: d
      });
    }

    console.log(dist_list);

    return dist_list;
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
      var tokens = val.split(",");
      for (var i = 0; i < tokens.length; i++) {
        tokens[i] = tokens[i].trim();
      }
      this.getVectorDistance(
        this.word_embedder_model,
        this.word_index,
        tokens
      ).then(distances => {
        this.setState({ distance_list: distances });
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
    // use row.distance[0] to convert Float32Array to Float32
    return (
      <div>
        {this.state.distance_list.length > 20 ? (
          <h3>show only top 20</h3>
        ) : (
          <div />
        )}
        <table class="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Word 1</th>
              <th scope="col">Word 2</th>
              <th scope="col">Similarity</th>
            </tr>
          </thead>
          <tbody>
            {this.state.distance_list.slice(0, 20).map(row => {
              return (
                <tr>
                  <td>{row.w1}</td>
                  <td>{row.w2}</td>
                  <td>{row.distance[0].toFixed(4)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
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

  genJSONData() {
    var json = {
      w1: [],
      w2: [],
      distance: []
    };
    for (var i = 0; i < this.state.distance_list; i++) {
      json["w1"].push(this.state.distance_list[i]["w1"]);
      json["w2"].push(this.state.distance_list[i]["w2"]);
      json["distance"].push(this.state.distance_list[i]["distance"]);
    }
    return json;
  }

  render() {
    var link = (
      <a href="http://projector.tensorflow.org/?config=https://gist.githubusercontent.com/ammarinjtk/7c393efd36b7549f98f2ac8e4898ad69/raw/9db47703cdd1137a9094f975bcc4008d7318848f/config.json">
        word embedding visualization
      </a>
    );
    return (
      <div class="container">
        <div class="row">
          <div class="col-12">
            <ExplainUI
              topic="Word Embedding"
              model_description="The process of mapping a word from the vocabulary to vectors of real numbers involving a mathematical embedding."
              explanation={
                <div class="alert alert-success" role="alert">
                  {/* <div class="text-dark">
                    Further material: how to visualize embeddings interactively
                    using {link} with TensorBoard.
                  </div> */}
                  <div class="text-dark">{this.state.explanationText}</div>
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
                  placeholder="Ex: สวัสดี, ลองดู, สิ"
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

// const mapStateToProps = state => {
//   return { similarMatrix: state.similarMatrix };
// };

// const mapDispatchToProps = dispatch => {
//   return bindActionCreators({ vectorizeWord }, dispatch);
// };

export default WordEmbedderUI;
