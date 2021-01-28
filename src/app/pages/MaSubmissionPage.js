import React from "react";
import { Notice } from "../../_metronic/_partials/controls";


export function MaSubmissionPage() {
  return (
    <>
      <Notice icon="flaticon-warning font-primary">
          <span>
            <a
              target="_blank"
              className="font-weight-bold"
              rel="noopener noreferrer"
              href="https://gitlab.com/sertis/data-analyst"
            >
              MA Submission
            </a>
            <span>{" "}</span>provides a template for dag definition to submit into MA service.
          </span>
        </Notice>
    </>
  );
};