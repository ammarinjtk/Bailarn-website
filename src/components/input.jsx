import React, { Component } from "react";

export default class InputUI extends Component{
    constructor(props){
        super(props);

        this.state={typeOfInput: ""}

        this.handleOnInputChange = this.handleOnInputChange.bind(this)
    }
    
    handleOnInputChange(e){
        this.props.onInputChange(e);

        this.setState({typeOfInput:typeOfInputValue(this.props.inputValue)})
    }

    disable_span(text){
        return(<span class="badge badge-secondary font-weight-light font-italic" style={{opacity:0.5}}>
                {text}
    </span>);
    }

    enable_span(text){
        return(<span class="badge c2" style={{fontWeight: 600}}>
                {text}
            </span>);   
    }

    genTypeCheckEnable(){
        if (this.props.enableTypeCheck === false) {
          return <div />;
        } else return(<span>{this.props.inputType === "TEXT" ? this.enable_span("text") : this.disable_span("text")}<span> </span>{this.props.inputType === "URL" ? this.enable_span("url") : this.disable_span("url")}</span>)
    }

    render(){
        return (<div>
            <h5>
              Input {this.genTypeCheckEnable()}
            </h5>
            <div class="input-group input-group-lg">
              <div class="input-group-prepend" />
              <textarea class="form-control rounded" id="exampleTextarea" rows="3" value={this.props.inputValue} onChange={this.handleOnInputChange} placeholder={this.props.placeholder} />
               
            </div>
        </div>);
    }
}

export const typeOfInputValue=(input)=>{
        const web_check_expression = /[-a-zA-Z0-9@:%_.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_.~#?&//=]*)?/gi;
        const regex = new RegExp(web_check_expression);

        if (input === "") return "";
        else if (input.match(regex)) return "URL";
             else return "TEXT";
    }