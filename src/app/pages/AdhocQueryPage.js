import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { FilePond, registerPlugin } from "react-filepond";
import { Notice } from "../../_metronic/_partials/controls";
import { uploadFileToGitlab } from "../../_metronic/_helpers";
import axios from "axios";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { useHistory } from "react-router-dom";

import "../../_metronic/_assets/css/file-pond.css"

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import "filepond/dist/filepond.min.css";

// Register the plugins
registerPlugin(FilePondPluginFileValidateType);

export function AdhocQueryPage() {

  // Init page load, to check if the user have running SQL jobs in hive and if so shows the current queries 
  useEffect(() => {
    initAdhocQueryPage();
  }, []);

  // Define `loading` to be used to display loading spinner
  const [loading, setLoading] = useState(false);

  // Define `files` as the file to be inputted from users
  const [files, setFiles] = useState([]);

  // Define `queries` as the results from Adhoc Query service
  // Further reference: https://gitlab.com/sertis/data-analyst/adhoc_query
  const [queries, setQueries] = useState([]);

  // Define `isAvailable` as the user can only submit a query at the same time
  const [isAvailable, setIsAvailable] = useState(false);

  // Define `openDialog` as the flag to show dialog message when user submitted a task
  const [showDialog, setShowDialog] = React.useState(false);

  // `History` to manage react router sessions and redirect to specific pages
  const history = useHistory();

  // Use `authToken` as the authenication token for other services by axios
  const { authToken } = useSelector(
    ({ auth }) => ({
      authToken: auth.authToken,
    }),
    shallowEqual
  );

  // Handle `submit` button to process Adhoc Query
  const handleSubmit = () => {
    // Initial the states
    setQueries([]);
    setLoading(true);

    handleFileProcessing()
      .then(() => {
        console.log("Start executing Adhoc Query");
        adhocQueryExecute()
          .then((response) => {
            console.log("Adhoc Query response: ", response);
            initAdhocQueryPage();
            setLoading(false);
            setIsAvailable(false);
            setShowDialog(true);
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

  const initAdhocQueryPage = () => {
    setLoading(true);
    setQueries([]);
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `token ${authToken}`,
      },
    };
    axios
      .get(process.env.REACT_APP_ADHOC_QUERY_GET_RESORUCE_AVAILABLE_URL, config)
      .then((response) => {
        console.log(
          `Status ${response.status}: Checking available resource for adhoc query service successfully`
        );
        setIsAvailable(response.data.is_available);
        if (!response.data.is_available) {
          axios
            .get(
              process.env.REACT_APP_ADHOC_QUERY_GET_CURRENT_QUERIES_URL,
              config
            )
            .then((response) => {
              console.log(
                `Status ${response.status}: Getting current queries for adhoc query service successfully`
              );
              setQueries(response.data.current_queries);
              setLoading(false);
            })
            .catch((error) => {
              console.log(
                `Error status ${error.status}: Getting current queries for adhoc query service error`
              );
              history.push("/error");
            });
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(
          `Error status ${error.status}: Checking available resource for adhoc query service error`
        );
        history.push("/error");
      });
  };

  const adhocQueryExecute = () => {
    /* To execute Adhoc Query service by axios request to /adhoc_query/execute (nginx proxy pass) */

    return new Promise((resolve, reject) => {
      const file = files[0].file;
      const uploadedFileName = "uploads/" + file.name;
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `token ${authToken}`,
        }
      };
      const data = {
        private_token: process.env.REACT_APP_GITLAB_PRIVATE_TOKEN,
        branch: process.env.REACT_APP_ADHOC_QUERY_GITLAB_BRANCH,
        gitlab_file: uploadedFileName,
        gitlab_base_url: process.env.REACT_APP_ADHOC_QUERY_GITLAB_BASE_URL
      }
      axios
        .post(process.env.REACT_APP_ADHOC_QUERY_EXECUTE_URL, data, config)
        .then((response) => {
          console.log(
            `Status ${response.status}: Executing successfully by Adhoc Query service`
          );
          resolve(response);
        })
        .catch((error) => {
          console.log(
            `Error status ${error.status}: Executing by Adhoc Query service error`
          );
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
        process.env.REACT_APP_ADHOC_QUERY_GITLAB_BASE_URL
      }/${encodeURIComponent(uploadedFileName)}`;
      uploadFileToGitlab(
        gitUrl,
        process.env.REACT_APP_ADHOC_QUERY_GITLAB_BRANCH,
        file
      )
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
        <th style={{ minWidth: "100px" }}>No.</th>
        <th style={{ minWidth: "200px" }}>
          <span className="text-dark-75">Query</span>
        </th>
        <th style={{ minWidth: "100px" }}>
          <span className="text-dark-75">Status</span>
        </th>
      </tr>
    );
  };

  const renderTableData = () => {
    return queries.map((query_item, _) => {
      const { idx, query, status } = query_item;
      return (
        <tr key={idx}>
          <td>{idx}</td>
          <td>
            <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
              {query}
            </span>
          </td>
          <td>
            <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
              {status}
            </span>
          </td>
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
            href="https://gitlab.com/sertis/data-analyst/adhoc_query"
          >
            Adhoc Query
          </a>
          <span> </span>provides a cloud service to execute your long-running SQL scripts in background.
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
          id="adhoc-query-button"
          type="submit"
          disabled={loading || !files.length > 0 || !isAvailable}
          onClick={!loading ? handleSubmit : null}
          className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
        >
          <span>Submit</span>
          {loading && <span className="ml-3 spinner spinner-white"></span>}
        </button>
      </div>

      {queries && queries.length > 0 && (
        <div className="card-body">
          <table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
            <thead>{renderTableHeader()}</thead>
            <tbody>{renderTableData()}</tbody>
          </table>
        </div>
      )}

      {files && files.length > 0 && (
        <Dialog
          open={showDialog}
          onClose={() => {setShowDialog(false)}}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">You have successfully submitted the file:{" "}<code>{files[0].file.name}</code>.</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You will receive an email notification when the job execution completes. Note that you cannot submit any other scripts until this script finishes.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {setShowDialog(false)}} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
      
    </>
  );
}
