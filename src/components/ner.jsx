import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import ResultUI from "./result";
import ExplainUI from "./explanation";
import InputUI, { typeOfInputValue } from "./input";
import ExampleUI from "./example";
import "./style.css";
import { ner_des } from "./ner_tag_list";

import * as tf from "@tensorflow/tfjs";
import * as utils from "../utils/utils";
import * as ner_constant from "../utils/ner";
import * as tokenizer_constant from "../utils/tokenizer";

class NerUI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: "",
      isShowOutput: false,
      isTextFormat: true,
      examples: [
        "สถานที่ที่คุณสมชายชอบไปคือเกาหลีใต้",
        "อาหารกล่องเซเว่นราคาเพียง 20 บาท",
        "กทม.จัดรถรางฟรี พาทัวร์เข้าพรรษาทำบุญ 9 วัด",
        "พบผู้ต้องสงสัยชิงเงิน 12 ล้าน ตำรวจเตรียมปิดค้น"
      ],
      inputType: "",
      tagList: [
        "DTM_B",
        "DTM_I",
        "DES_B",
        "DES_I",
        "TTL_B",
        "TTL_I",
        "BRN_B",
        "BRN_I",
        "PER_B",
        "PER_I",
        "MEA_B",
        "MEA_I",
        "NUM_B",
        "NUM_I",
        "LOC_B",
        "LOC_I",
        "TRM_B",
        "TRM_I",
        "ORG_B",
        "ORG_I",
        "ABB_ORG_B",
        "ABB_ORG_I",
        "ABB_LOC_B",
        "ABB_LOC_I",
        "ABB_DES_B",
        "ABB_DES_I",
        "ABB_PER_B",
        "ABB_PER_I",
        "ABB_TTL_B",
        "ABB_TTL_I",
        "ABB_B",
        "ABB_I"
      ],
      old_output: null,
      outputStatus: 1,
      token_list: [],
      tag_list: [],
      isReady: false
    };

    this.setInput = this.setInput.bind(this);
    this.char_index = utils.build_tag_index(
      tokenizer_constant.CHARACTER_LIST,
      tokenizer_constant.CHAR_START_INDEX
    );
    this.tag_index = utils.build_tag_index(ner_constant.TAG_LIST, 0);
    this.tokenizer_model = this.load_tokenizer();
    this.ner_model = this.load_ner();
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
      "https://raw.githubusercontent.com/ammarinjtk/thai-nlp/master/src/models/ner/ner_word_index.json"
    )
      .then(res => res.json())
      .then(out => {
        this.word_index = out;
        this.word_index["<PAD>"] = 0;
        console.log("Index for UNK word: ", this.word_index["UNK"]);
        console.log("Index for PAD word: ", this.word_index["<PAD>"]);
      })
      .catch(err => console.error(err));
  };

  load_ner = async () => {
    console.log("Loading NER model!");
    this.ner_model = await tf.loadModel(
      "https://raw.githubusercontent.com/ammarinjtk/thai-nlp/master/src/models/ner/model.json"
    );
    console.log("Loading NER model Successful!");
    // console.log(this.ner_model.summary());
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

  getNER = async (ner_model, word_index, tokens) => {
    const inv_tag_index = utils.swap(this.tag_index);
    // console.log(inv_tag_index);
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
    x = utils.pad([x], ner_constant.SEQUENCE_LENGTH, 0);
    // readable_x = utils.pad([readable_x], ner_utils.SEQUENCE_LENGTH, "PAD");
    console.log(x);

    x = tf.tensor2d(x);

    var output = ner_model.predict(x);
    // console.log(output);
    var y_pred = output
      .argMax(2)
      .flatten()
      .dataSync();
    console.log(y_pred);

    var decoeded_y_pred = [];
    for (i = 0; i < readable_x.length; i++) {
      decoeded_y_pred.push(inv_tag_index[y_pred[i]]);
    }
    return decoeded_y_pred;
  };

  rawText() {
    if (this.state.isShowOutput) return this.state.tag_list.join("|");
    return "";
  }

  showTextResult() {
    return (
      <div style={{ lineHeight: "200%" }}>
        {this.state.token_list.map((w, i) => {
          return (
            <span
              data-tip={
                this.state.tag_list[i] !== "O"
                  ? this.state.tag_list[i] +
                    "(" +
                    ner_des[this.state.tag_list[i]] +
                    ")"
                  : "O"
              }
              class={this.state.tag_list[i] + " rounded"}
            >
              {w}{" "}
            </span>
          );
        })}
        <ReactTooltip effect="solid" />
      </div>
    );
  }

  textResultComponent() {
    return (
      <div id="accordion">
        <div class="card">
          <div class="card-header" id="headingOne">
            <h5 class="mb-0">
              <button
                class="btn btn-link"
                data-toggle="collapse"
                data-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Colors mapping
              </button>
            </h5>
          </div>
          <div
            id="collapseOne"
            class="collapse"
            aria-labelledby="headingOne"
            data-parent="#accordion"
          >
            <div class="card-body">
              <div class="row">
                {this.state.tagList.map(e => {
                  return (
                    <div className="col-lg-3 col-md-3 col-sm-4 pt-1 pb-1 pr-1 pl-1">
                      <div
                        class={e + " col-12 rounded mt-1 mb-1 mr-1 ml-1"}
                        data-tip={ner_des[e]}
                      >
                        {e}
                      </div>
                    </div>
                  );
                })}
                <div class="col-12">
                  <p>* B = Beginning word</p>
                  <p>* I = Following word</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  genJSONData() {
    var json = {
      token_list: this.state.token_list,
      tag_list: this.state.tag_list
    };
    return json;
  }

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
        this.getNER(
          this.ner_model,
          this.word_index,
          this.state.token_list
        ).then(tags => {
          this.setState({ tag_list: tags, isShowOutput: true });
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
              topic="Named Entity Recognition"
              model_description="Predict Named entity of each words in a sentence"
              explanation={
                <div class="alert alert-success" role="alert">
                  <div class="text-dark font-light">
                    Put <strong>Thai Text</strong> or{" "}
                    <strong> Website URL </strong> in the box below and hit{" "}
                    <strong> Analyze </strong>buttom !
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
                dataForCopy={this.rawText()}
                textData={this.showTextResult()}
                footer={this.textResultComponent()}
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

export default NerUI;
