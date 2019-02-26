import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import { posColor } from "./pos_color";

export default class PosResultUI extends Component {
  constructor(props) {
    super(props);
    const description = {
      NN: "Non-proper nouns",
      NR: "Proper nouns",
      PPER: "Personal pronoun",
      PINT: "Interrogative pronouns in non-determiner usage",
      PDEM: "Demonstrative pronoun as heads",
      DPER:
        "Same list as PPER words, but modifying head nouns typically as possessives",
      DINT: "Items in PINT which are used as determiners to Nouns",
      DDEM: "The most common determiners, usually demonstratives",
      PDT:
        "Quantifier determiners, and pre-modifiers of quantifier spreceding classifier words",
      REFX: "Reflexive words",
      VV: "Main verbs in clauses, verb–form",
      VA: "Main adjective element in verb-less clauses",
      AUX: "Auxiliary verbs indicating modality/aspect/tense/passive etc.",
      JJA: "Adjective form words in noun modifying positions",
      JJV: "Verb form words directly modifying nouns in same noun phrase",
      ADV: "Adverbs modifying Verb/Adj/other adverbs",
      NEG: "Negative word",
      PAR: "Polite/question/emphasis particles usually in clause–end",
      CL:
        "Common noun that functions as classifier units, plus true classifiers",
      CD: "Numbers as cardinals, quantifiers",
      OD: "Numbers as ordinals, and non-quantifiers",
      FXN: "Noun-type prefix",
      FXG: "Group type prefix",
      FXAV: "Adverb type prefix",
      FXAJ: "Adjective type prefix",
      COMP: "Complementizers",
      CNJ: "Coordinators and clause conjunctions",
      P: "Prepositions",
      IJ: "Interjections",
      PU: "Regular and Thai - character punctuations",
      FWN: "Non-proper Noun word written in non-thai script",
      FWV: "Verb written in non-thai script",
      FWA: "Adjective written in non-thai script"
    };
    const tagList = [
      "NN",
      "NR",
      "PPER",
      "PINT",
      "PDEM",
      "DPER",
      "DINT",
      "DDEM",
      "PDT",
      "REFX",
      "VV",
      "VA",
      "AUX",
      "JJA",
      "JJV",
      "ADV",
      "NEG",
      "PAR",
      "CL",
      "CD",
      "OD",
      "FXN",
      "FXG",
      "FXAV",
      "FXAJ",
      "COMP",
      "CNJ",
      "P",
      "IJ",
      "PU",
      "FWN",
      "FWV",
      "FWA",
      "FWX"
    ];

    const selectedCheckboxes = new Set([" "]);
    this.state = {
      NN: true,
      NR: true,
      PPER: true,
      PINT: true,
      PDEM: true,
      DPER: true,
      DINT: true,
      DDEM: true,
      PDT: true,
      REFX: true,
      VV: true,
      VA: true,
      AUX: true,
      JJA: true,
      JJV: true,
      ADV: true,
      NEG: true,
      PAR: true,
      CL: true,
      CD: true,
      OD: true,
      FXN: true,
      FXG: true,
      FXAV: true,
      FXAJ: true,
      COMP: true,
      CNJ: true,
      P: true,
      IJ: true,
      PU: true,
      FWN: true,
      FWV: true,
      FWA: true,
      FWX: true,
      selectedCheckboxes,
      tagList,
      description,
      toggleAll: true
    };
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
  }
  toggleAll(e) {
    let { value } = e.target;
    console.log(e.target);
    if (value !== "Toggle All") {
      return;
    }
    value = !this.state.toggleAll;
    console.log("all");
    let update = this.state;
    for (let i = 0; i < this.state.tagList.length; i++) {
      update[this.state.tagList[i]] = value;
    }
    console.log(update);
    this.setState(update);
    this.setState({ toggleAll: value });
  }

  toggleCheckbox(e) {
    const { value } = e.target;
    console.log(e);
    let update = this.state;
    update[value] = !this.state[value];
    console.log(this.state[value]);
    console.log(!this.state[value]);
    this.setState(update);
    console.log(this.state);
  }

  highlightWord(word, tag) {
    return (
      <span
        class="rounded"
        style={{
          backgroundColor: posColor[tag],
          // padding: "0 5px",
          margin: "0"
        }}
      >
        {word}
      </span>
    );
  }

  getWord(word, tag) {
    if (this.state[tag]) {
      return this.highlightWord(word, tag);
    } else return word;
  }

  genPOSShow() {
    return (
      <div style={{ lineHeight: "200%" }}>
        {this.props.pos.token_list.map((w, i) => (
          <span
            data-tip={
              this.state.description[this.props.pos.tag_list[i]] +
              " (" +
              this.props.pos.tag_list[i] +
              ")"
            }
          >
            {this.getWord(w, this.props.pos.tag_list[i])}{" "}
          </span>
        ))}{" "}
        <ReactTooltip effect="solid" />
      </div>
    );
  }

  render() {
    return (
      <div>
        <div class="card" style={{ width: "100%" }}>
          <div class="card-header">
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
                      Tag Filter
                    </button>
                  </h5>
                </div>

                <div
                  id="collapseOne"
                  class="collapse show"
                  aria-labelledby="headingOne"
                  data-parent="#accordion"
                >
                  <div class="card-body">
                    <div class="row container">
                      {this.state.tagList.map((e, index) => (
                        <div className="form-check form-check-inline col-4 col-lg-2">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id={"inlineCheckbox" + e}
                            checked={this.state[e]}
                            value={e}
                            onClick={this.toggleCheckbox}
                          />
                          <label
                            class="form-check-label rounded"
                            for={"inlineCheckbox" + e}
                            data-tip={this.state.description[e]}
                            style={{
                              backgroundColor: posColor[e]
                            }}
                          >
                            {e}
                          </label>
                        </div>
                      ))}
                      <div className="form-check form-check-inline col-2">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="inlineCheckbox1"
                          checked={this.state["toggleAll"]}
                          value="Toggle All"
                          onClick={this.toggleAll}
                        />
                        <label
                          class="form-check-label rounded"
                          for="inlineCheckbox1"
                        >
                          <b>SELECT ALL</b>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              <div>{this.genPOSShow()}</div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
