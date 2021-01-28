import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { FilePond, registerPlugin } from "react-filepond";
import { Notice } from "../../_metronic/_partials/controls";
import { uploadFileToGitlab } from "../../_metronic/_helpers";
import axios from "axios";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { useHistory } from "react-router-dom";

import "../../_metronic/_assets/css/file-pond.css"

import "filepond/dist/filepond.min.css";

// Register the plugins
registerPlugin(FilePondPluginFileValidateType);

export function DacsCheckerPage() {
  // Define `loading` to be used to display loading spinner
  const [loading, setLoading] = useState(false);

  // Define `files` as the file to be inputted from users
  const [files, setFiles] = useState([]);

  // Define `checklists` as the results from DACS checker service
  // Further reference: https://gitlab.com/sertis/data-analyst/dacs
  const [checklists, setChecklists] = useState([]);

  // `History` to manage react router sessions and redirect to specific pages
  const history = useHistory();

  // Use `authToken` as the authenication token for other services by axios
  const { authToken } = useSelector(
    ({ auth }) => ({
      authToken: auth.authToken,
    }),
    shallowEqual
  );

  // Handle `submit` button to process DACS checker
  const handleSubmit = () => {
    // Initial the states
    setChecklists([]);
    setLoading(true);

    handleFileProcessing()
      .then(() => {
        console.log("Start checking DACS");
        dacsChecker()
          .then((response) => {
            console.log("DACS response: ", response.data.checklist_results);

            setLoading(false);
            setChecklists(response.data.checklist_results);
          })
          .catch((error) => {
            console.log(error);

            setLoading(false);
            history.push("/error");
          });
      })
      .catch((error) => {
        console.log(error);

        setLoading(false);
        history.push("/error");
      });
  };

  const dacsChecker = () => {
    /* To execute DACS checker service by axios request to /dacs_checker (nginx proxy pass) */

    return new Promise((resolve, reject) => {
      const file = files[0].file;
      const uploadedFileName = "uploads/" + file.name;
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `token ${authToken}`,
        },
        params: {
          private_token: process.env.REACT_APP_GITLAB_PRIVATE_TOKEN,
          branch: process.env.REACT_APP_DACS_GITLAB_BRANCH,
          gitlab_file: uploadedFileName,
          gitlab_base_url: process.env.REACT_APP_DACS_GITLAB_BASE_URL,
        },
      };
      axios
        .get(process.env.REACT_APP_DACS_URL, config)
        .then((response) => {
          console.log(
            `Status ${response.status}: Checking successfully by DACS`
          );
          resolve(response);
        })
        .catch((error) => {
          console.log(`Error status ${error.status}: Checking by DACS error`);
          reject(error);
        });
    });
  };

  const handleFileRemove = () => {
    /* To set file state to be empty */
    setFiles([]);
  };

  const handleFileProcessing = () => {
    /* To process received file by pushing the file to gitlab repository*/

    return new Promise((resolve, reject) => {
      const file = files[0].file;
      const uploadedFileName = "uploads/" + file.name;
      const gitUrl = `${
        process.env.REACT_APP_DACS_GITLAB_BASE_URL
      }/${encodeURIComponent(uploadedFileName)}`;
      uploadFileToGitlab(gitUrl, process.env.REACT_APP_DACS_GITLAB_BRANCH, file)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const renderTableHeader = () => {
    return (
      <tr className="text-left text-uppercase">
        <th style={{ minWidth: "100px" }}>Issue No.</th>
        <th style={{ minWidth: "200px" }}>
          <span className="text-dark-75">Issue</span>
        </th>
        <th style={{ minWidth: "100px" }}>
          <span className="text-dark-75">Result</span>
        </th>
        <th style={{ minWidth: "500px" }}>Message</th>
      </tr>
    );
  };

  const renderTableData = () => {
    return checklists.map((checklist, index) => {
      const { issue_id, issue_info, result, message } = checklist;
      return (
        <tr key={issue_id}>
          <td>{issue_id}</td>
          <td>
            <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
              {issue_info}
            </span>
          </td>
          <td>
            <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
              {result}
            </span>
          </td>
          <td>{message}</td>
        </tr>
      );
    });
  };

  return (
    <>
      <Notice icon="flaticon-warning font-primary">
        <span>
          <a
            target="_blank"
            className="font-weight-bold"
            rel="noopener noreferrer"
            href="https://gitlab.com/sertis/data-analyst/dacs"
          >
            DACS (Data Analyst Coding Standard)
          </a>
          <span> </span>provides a coding style checker for SQL scripts.
        </span>
      </Notice>

      <div>
        <FilePond
          files={files}
          acceptedFileTypes={["text/sql"]}
          fileValidateTypeDetectType={(source, type) =>
            new Promise((resolve, reject) => {
              if (source.name.includes(".sql")) {
                type = "text/sql";
              }
              resolve(type);
            })
          }
          allowMultiple={false}
          onupdatefiles={setFiles}
          onremovefile={() => handleFileRemove()}
          labelIdle='Drag & Drop your SQL files or <span class="filepond--label-action">Browse</span>'
        ></FilePond>
      </div>

      <div className="col text-center">
        <button
          id="dacs_submit"
          type="submit"
          disabled={loading || !files.length > 0}
          onClick={!loading ? handleSubmit : null}
          className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
        >
          <span>Submit</span>
          {loading && <span className="ml-3 spinner spinner-white"></span>}
        </button>
      </div>

      {checklists.length > 0 && (
        <div className="card-body">
          <table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
            <thead>{renderTableHeader()}</thead>
            <tbody>{renderTableData()}</tbody>
          </table>
        </div>
      )}
    </>
  );
}
