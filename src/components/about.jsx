import React, { Component } from "react";

import lab_logo from "../images/datamind.png";
import cpcu_logo from "../images/cpcu.png";
import peerapon from "../images/peerapon.png";
import can from "../images/can.jpg";
import kawin from "../images/kawin.jpg";
import ammarin from "../images/ammarin.jpg";
import chavisa from "../images/chavisa.jpg";
import prachya from "../images/prachya.jpg";

import AvatarEditor from "react-avatar-editor";

import nectec_logo from "../images/nectec_logo.jpg";
class SentimentUI extends Component {
  render() {
    return (
      <div class="container" style={{ "margin-left": "0px" }}>
        <h1> About Bailarn Library </h1>
        <div style={{ "padding-bottom": "50px" }} />
        <h2> Project developers </h2>
        <div
          class="row"
          style={{ "padding-top": "50px", "padding-bottom": "50px" }}
        >
          <div class="col-md-4 text-center">
            <AvatarEditor
              image={ammarin}
              width={200}
              height={200}
              border={0}
              borderRadius={30}
              scale={3.0}
            />
            <div style={{ "padding-top": "10px" }}>
              <p class="text-center">
                <b>Ammarin Jetthakun</b>
                <br />
                <i>
                  Department of Computer Engineering,
                  <br />
                  Chulalongkorn University
                </i>
              </p>
            </div>
          </div>
          <div class="col-md-4 text-center">
            <AvatarEditor
              image={chavisa}
              width={200}
              height={200}
              border={0}
              borderRadius={30}
              scale={1.3}
              position={{ x: 0.65, y: 0 }}
            />
            <div style={{ "padding-top": "10px" }}>
              <p class="text-center">
                <b>Chavisa Thamjarat</b>
                <br />
                <i>
                  Department of Computer Engineering,
                  <br />
                  Chulalongkorn University
                </i>
              </p>
            </div>
          </div>
          <div class="col-md-4 text-center">
            <AvatarEditor
              image={kawin}
              width={200}
              height={200}
              border={0}
              borderRadius={30}
              scale={1.0}
            />
            <div style={{ "padding-top": "10px" }}>
              <p class="text-center">
                <b>Kawin Liaowongphuthorn</b>
                <br />
                <i>
                  Department of Computer Engineering,
                  <br />
                  Chulalongkorn University
                </i>
              </p>
            </div>
          </div>
        </div>
        <h2> Advisors </h2>
        <div
          class="row"
          style={{ "padding-top": "50px", "padding-bottom": "50px" }}
        >
          <div class="col-md-4 text-center">
            <AvatarEditor
              image={peerapon}
              width={200}
              height={200}
              border={0}
              borderRadius={30}
              scale={1.0}
            />
            <div style={{ "padding-top": "10px" }}>
              <p class="text-center">
                <b>Asst. Prof. Peerapon Vateekul, Ph.D.</b>
                <br />
                <i>
                  Department of Computer Engineering,
                  <br />
                  Chulalongkorn University
                </i>
              </p>
            </div>
          </div>
          <div class="col-md-4 text-center">
            <AvatarEditor
              image={can}
              width={200}
              height={200}
              border={0}
              borderRadius={30}
              scale={1.0}
            />
            <div style={{ "padding-top": "10px" }}>
              <p class="text-center">
                <b>Can Udomcharoenchaikit</b>
                <br />
                <i>
                  Department of Computer Engineering,
                  <br />
                  Chulalongkorn University
                </i>
              </p>
            </div>
          </div>
          <div class="col-md-4 text-center">
            <AvatarEditor
              image={prachya}
              width={200}
              height={200}
              border={0}
              borderRadius={30}
              scale={1.0}
            />
            <div style={{ "padding-top": "10px" }}>
              <p class="text-center">
                <b>Prachya Boonkwan, Ph.D.</b>
                <br />
                <i>
                  Language and Semantic Technology Lab (LST),
                  <br />
                  NECTEC{" "}
                </i>
              </p>
            </div>
          </div>
        </div>
        <h2> Organizations </h2>
        <div
          class="row"
          style={{ "padding-top": "50px", "padding-bottom": "50px" }}
        >
          <div class="col-md-4">
            <img src={lab_logo} height="140" width="320" alt="" />
          </div>
          <div class="col-md-4">
            <img src={nectec_logo} height="140" width="489" alt="" />
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <img src={cpcu_logo} height="140" width="960" alt="" />
          </div>
        </div>
      </div>
    );
  }
}

export default SentimentUI;
