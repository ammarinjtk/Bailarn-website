import React, { Component } from "react";
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
class DropdownUI extends Component {

  setSelected(e){
    const {value} = e.target
    console.log(value)
    // this.setState({selected: word});
    // ReactDOM.render()
  }

  render() {
    const defaultOption = this.props.options[0]
    return <span class="dropdown show">
        
        <Dropdown options={this.props.options} onChange={this._onSelect} value={defaultOption} placeholder="Select an option" />
      </span>;
  }
}

export default DropdownUI;
