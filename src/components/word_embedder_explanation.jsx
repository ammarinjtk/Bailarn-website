import React, { Component } from "react";

export default class ExplanationUI extends Component {
  render() {
    var link = (
      <a href="http://projector.tensorflow.org/?config=https://gist.githubusercontent.com/ammarinjtk/7c393efd36b7549f98f2ac8e4898ad69/raw/9db47703cdd1137a9094f975bcc4008d7318848f/config.json">
        word embedding visualization
      </a>
    );
    return (
      <div>
        <h1> {this.props.topic} </h1>
        <div style={{ width: "150px" }}>{this.props.dropdown}</div>
        <p>
          <b>
            {this.props.model_description} <br /> Further material: how to
            visualize embeddings interactively using {link} with TensorBoard.
          </b>
        </p>
        <div className="explanation">{this.props.explanation}</div>
      </div>
    );
  }
}
