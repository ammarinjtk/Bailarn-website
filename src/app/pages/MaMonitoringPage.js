import React from "react";
import { Notice } from "../../_metronic/_partials/controls";


export function MaMonitoringPage() {
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
              MA Monitoring
            </a>
            <span>{" "}</span>provides a tool to monitor your MA jobs' performance in real-time.
          </span>
        </Notice>
    </>
  );
};