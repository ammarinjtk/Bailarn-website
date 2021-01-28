/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive("/home", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/home">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
            <span className="menu-text">Home</span>
          </NavLink>
        </li>
        {/*end::1 Level*/}

        {/* Data Preparation Tools */}
        {/* begin::section */}
        <li className="menu-section ">
          <h4 className="menu-text">NLP Foundation Tasks</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li>

        {/* Tokenizer */}
        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive("/tokenizer", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/tokenizer">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")} />
            </span>
            <span className="menu-text">Tokenization</span>
          </NavLink>
        </li>
        {/*end::1 Level*/}
        {/* end:: section */}

        {/* begin::section */}
        <li className="menu-section ">
          <h4 className="menu-text">NLP Application Tasks</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li>
        {/* end:: section */}
      </ul>

      {/* end::Menu Nav */}
    </>
  );
}
