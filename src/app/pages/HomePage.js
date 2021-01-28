import React from "react";
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
              Features Overview
                </h3>
          </div>

          {/* Body */}
          <div className="card-body pt-2">
            <div className="d-flex align-items-center mb-10">
              <div className="symbol symbol-40 symbol-light-primary mr-5">
                <span className="symbol-label">
                  <span className="svg-icon svg-icon-lg svg-icon-primary">
                    <SVG
                      className="h-75 align-self-end"
                      src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")}
                    ></SVG>
                  </span>
                </span>
              </div>

              <div className="d-flex flex-column font-weight-bold">
                <a
                  href="/tokenizer"
                  className="text-dark text-hover-primary mb-1 font-size-lg"
                >
                  Tokenization
                    </a>
                <span>identify word boundaries and divide inputs into a meaningful unit as a word.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};