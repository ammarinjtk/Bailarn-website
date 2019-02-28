/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import "./nav_bar.css";
import classNames from "classnames";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = { active_api: false, active_about: false };
    this.setState = this.setState.bind(this);
  }

  setAPIActive() {
    this.setState({ active_api: true, active_about: false });
  }
  setAboutActive() {
    this.setState({ active_api: false, active_about: true });
  }
  render() {
    // const classes = classNames({
    //   "nav-item": true,
    //   active: this.state.active_api // only add this class if the state says so
    // });
    const classes2 = classNames({
      "nav-item": true,
      active: this.state.active_about // only add this class if the state says so
    });
    return (
      <nav
        class="navbar navbar-default navbar-expand-lg navbar-dark text-white"
        style={{ background: "#545454" }}
      >
        <div class="row" style={{ "padding-left": "5px" }}>
          <img src={logo} height="32" width="32" alt="" />
          <div class="col-xs-6">
            <a class="navbar-brand" href={"#/"}>
              Bailarn Library
            </a>
            <a
              href="#menu-toggle"
              class="btn"
              style={{ background: "#545454", color: "#fff" }}
              id="menu-toggle"
            >
              <i class="fa fa-bars w3-large" />
            </a>
          </div>
          <div class="col-xs-3" style={{ padding: "0" }}>
            <a
              class="nav-link dropdown-toggle text-white"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              More
            </a>
            <div class="dropdown-menu right" aria-labelledby="navbarDropdown">
              <div class="dropdown-divider" />
              <Link
                to={"/about"}
                activeClassName={"active"}
                className={"dropdown-item"}
              >
                <span class="pad-left">About Us</span>
              </Link>
            </div>
          </div>
        </div>
        <div class="text-white right" id="nav-item-list" id="navbarButton">
          <ul class="navbar-nav mr-auto">
            <li
              className={classes2}
              onClick={() => this.setAboutActive()}
              id="navbarButton"
            >
              <Link
                to={"/about"}
                activeClassName={"active"}
                className={"nav-link"}
              >
                <i class="fa fa-comments w3-large" />

                <span class="pad-left">About Us</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default NavBar;
