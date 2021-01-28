import React from "react";
import { NavLink } from "react-router-dom";
import { Notice } from "../../_metronic/_partials/controls";
// import axios from "axios";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../_metronic/_helpers";


export function HomePage() {
  return (
    <>
      <Notice icon="flaticon-warning font-primary">
        <span>
          <a
            target="_blank"
            className="font-weight-bold"
            rel="noopener noreferrer"
            href="https://gitlab.com/sertis/data-analyst/di-portal"
          >
            Bailarn Website
                </a>
          <span>{" "}</span>to support Thai Natural Language Processing communities.
              </span>
      </Notice>

      <div>
        <div className={`card card-custom card-stretch gutter-b`}>
          {/* Header */}
          <div className="card-header border-0">
            <h3 className="card-title font-weight-bolder text-dark">
              About
                </h3>
          </div>

          {/* Body */}
          <div className="card-body pt-2">
          </div>
        </div>
      </div>
    </>
  );
};