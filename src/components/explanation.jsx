import React, { Component } from "react";

export default class ExplanationUI extends Component{
    render(){
        return (
            <div>
                <h1> {this.props.topic} </h1>
                <div style={{'width':'150px'}}>
                {this.props.dropdown}
                </div>
                <p><b> {this.props.model_description} </b></p>
                <div className="explanation" >
                    {this.props.explanation}
                </div> 
            </div>
        )
    }
}