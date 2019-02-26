import React, { Component } from "react";
import ReactJson from "react-json-view";

import { CopyToClipboard } from "react-copy-to-clipboard";

class ResultUI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isTextFormat: this.props.isTextFormat
    };
  }

  jsonResult() {
    return <div class="card mt-4 md-6 pd-4">
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item">
              <a class="nav-link " onClick={() => this.setState({
                    isTextFormat: true
                  })}>
                RESULT
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link active">JSON</a>
            </li>
          </ul>
        </div>
        <div class="card-body">
          <p class="card-text">
            <ReactJson src={this.props.jsonData} displayDataTypes={false} collapsed={1} displayObjectSize={false}/>
          </p>
        </div>
      </div>;
    }

    textResult(){
        return <div class="card text-center mt-4">
            <div class="card-header">
              <ul class="nav nav-tabs card-header-tabs">
                <li class="nav-item">
                  <a class="nav-link active">RESULT</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" onClick={() => this.setState({
                        isTextFormat: false
                      })}>
                    JSON
                  </a>
                </li>
              </ul>
            </div>
            <div class="card-body">
              <div class="clearfix mt-0 pt-0">
                {this.props.dataForCopy ? <CopyToClipboard text={this.props.dataForCopy}>
                    <button type="button" class="btn  float-right">
                      Copy
                    </button>
                  </CopyToClipboard> : <div />}
              </div>
              <p class="card-text">
                <div id="foo">{this.props.textData}</div>
              </p>
            </div>
            {this.props.footer ? <div clsss="card-footer text-muted">
                {" "}
                {this.props.footer}
              </div> : <div clsss="" />}
            <div />
          </div>;
    }

    render() {
        return this.state.isTextFormat?(this.textResult()):(this.jsonResult())
        
    }
  
}

export default ResultUI;