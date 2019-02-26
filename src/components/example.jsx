import React, { Component } from "react";

class ExampleUI extends Component {
  //   render() {
  //     return <div class="card c1" style={{ width: "100%" }}>
  //         <h5 class="card-header c1 text-white">Example Input</h5>

  //         <ul class="list-group list-group-flush">
  //             {this.props.examples.map(example => (
  //               <li
  //                 class="list-group-item list-group-item-action border-bottom-0 border-top-0 c1 text-white"
  //                 style={{cursor: "pointer"}}
  //                 key={example}
  //                 onClick={this.props.setInput}
  //               >
  //                 <{example}
  //               </li>
  //             ))}
  //           </ul>
  //       </div>;
  //   }

  generateSubMenu() {
    let subMenu = [];
    subMenu.push(
      <div class="w3-bar w3-block w3-padding-large">
        <span style={{ "font-weight": "500" }}>
          <i
            class="fa fa-info-circle w3-large"
            style={{ "padding-right": "10px" }}
          />
          Example Input (Click the button below)
        </span>
      </div>
    );
    for (let i in this.props.examples) {
      subMenu.push(
        <a
          class="w3-btn w3-block w3-hover-teal w3-padding-large c1"
          key={this.props.examples[i]}
          onClick={this.props.setInput}
        >
          {this.props.examples[i]}
        </a>
      );
    }
    return subMenu;
  }

  render() {
    return (
      //<a href="#" data-activates="slide-out" class="btn btn-primary p-3 button-collapse"><i class="fa fa-bars"></i></a>

      <div class="card c1" style={{ width: "100%" }}>
        {this.generateSubMenu()}
      </div>
    );
  }
}
export default ExampleUI;
