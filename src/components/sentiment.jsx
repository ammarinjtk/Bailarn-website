import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Loading from "react-loading-components";

import { sentiment } from "../action/index";

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
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
      outputStatus: 1
    };

    this.setInput = this.setInput.bind(this);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ outputStatus: 1 });
    this.setState({
      inputType: typeOfInputValue(this.state.inputValue)
    });
    console.log(this.props.sentimentValue)
    if (this.state.inputValue !== "") {
      this.props.sentiment(this.state.inputType, this.state.inputValue,'MOCK');
      this.setState({ isShowOutput: true });
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
    const status = this.props.sentimentValue.status;
    const data = this.props.sentimentValue.data;
    if (status === "OK") {
      if (this.state.old_output !== data) this.setState({
          old_output: data
        });

      let sentimentValue = this.props.sentimentValue.data.confidence_tag_list;
      console.log(sentimentValue[0]);
      let datao = [{ 
        key: "positive", 
        value: Number(sentimentValue[1].confidence.toFixed(4)) }, 
        // { key: "neutral", 
        // value: Number(sentimentValue[2].confidence.toFixed(4)) }, 
        { key: "negative", 
        value: Number(sentimentValue[0].confidence.toFixed(4)) }];
      return <ResponsiveContainer width="100%" height={300}>
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
        </ResponsiveContainer>;
    } else if (status === "ERROR") {
      if (this.state.old_output !== data) this.setState({
          old_output: data
        });
      console.log(this.state.outputStatus);
      return <h1> {data}</h1>;
    }
        
      
  }
  loading() {
    const status = this.props.sentimentValue.status;
    if (status) {
      console.log(status);
      console.log(this.state.old_output);
      if (this.state.old_output !== this.props.sentimentValue.data) {
        console.log(this.state.old_output);
        console.log(this.props.sentimentValue.data);
        this.setState({ outputStatus: 2 });
        console.log(this.state.outputStatus);
      }
    }
    return (
      <Loading type="ball_triangle" width={100} height={100} fill="#f44242" />
    );
  }

  render() {
    return (
      <div class="container">
        <div class="row">
          <div class="col-12">
            <ExplainUI
              topic={
                <div>
                  Sentiment Analysis
                </div>
              }
              dropdown={<DropdownUI style={{'width':'150px'}}options={['food','mobile']} />}
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
                textData={
                  this.state.outputStatus === 1
                    ? this.loading()
                    : this.genGraph()
                }
                jsonData={this.props.sentimentValue.data}
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
const mapStateToProps = state => {
  return { sentimentValue: state.sentimentValue };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators({ sentiment }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SentimentUI);
