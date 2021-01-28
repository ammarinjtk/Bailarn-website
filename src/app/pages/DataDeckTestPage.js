import React, { useState } from "react";
import { FilePond, registerPlugin  } from 'react-filepond';
import { Notice } from "../../_metronic/_partials/controls";
import { uploadFileToGitlab } from "../../_metronic/_helpers"
import axios from "axios";
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { useHistory } from "react-router-dom";

import "../../_metronic/_assets/css/file-pond.css"

import 'filepond/dist/filepond.min.css'

// Register the plugins
registerPlugin(FilePondPluginFileValidateType)


export function DataDeckTestPage() {

  // Define `loading` to be used to display loading spinner
  const [loading, setLoading] = useState(false);

  // Define `files` as the file to be inputted from users
  const [files, setFiles] = useState([]);

  // Define `results` as the results from Data Deck Test service
  // Further reference: https://gitlab.com/sertis/data-analyst/data_desk_test
  const [results, setResults] = useState([])

  // `History` to manage react router sessions and redirect to specific pages
  const history = useHistory();

  // Handle `submit` button to process Data Deck Test
  const handleSubmit = () => {

    // Initial the states
    setResults([]);
    setLoading(true);

    handleFileProcessing()
    .then(() => {
      console.log("Executing Data Deck Test")
      dataDeckTest()
      .then(response => {
        console.log("Data Deck Test response: ", response.data.data_deck_test_results)

        setLoading(false);
        setResults(response.data.data_deck_test_results);
      })
      .catch(error => {
        console.log(error)

        setLoading(false);
        history.push('/error');
      });
    })
    .catch(error => {
      console.log(error)

      setLoading(false);
      history.push('/error');
    });
  };

  const dataDeckTest = () => {
    /* To execute Data Deck Test service by axios requrest to /data_deck_test (nginx proxy pass)*/

    return new Promise((resolve, reject) => {
      const file = files[0].file
      const uploadedFileName = "uploads/" + file.name;
      const config = {
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        },
        params: {
          private_token: process.env.REACT_APP_GITLAB_PRIVATE_TOKEN,
          branch: process.env.REACT_APP_DATA_DECK_GITLAB_BRANCH,
          gitlab_file: uploadedFileName,
          gitlab_base_url: process.env.REACT_APP_DATA_DECK_GITLAB_BASE_URL
        },
        timeout: 1800000
      }

      
      axios.get(process.env.REACT_APP_DATA_DECK_URL, config).then(response => {
        console.log(
          `Status ${response.status}: Checking successfully by Data Deck Test`
        );
        resolve(response);
      }).catch(error => {
        console.log(
          `Error status ${error.status}: Checking by Data Deck Test error`
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
      const file = files[0].file
      const uploadedFileName = "uploads/" + file.name;
      const gitUrl = `${process.env.REACT_APP_DATA_DECK_GITLAB_BASE_URL}/${encodeURIComponent(uploadedFileName)}`;
      uploadFileToGitlab(gitUrl, process.env.REACT_APP_DATA_DECK_GITLAB_BRANCH, file)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      });
    });
  };

  const renderTableHeader = () => {
    return <tr className="text-left text-uppercase">
      <th style={{minWidth: "200px"}}><span className="text-dark-75">Issue</span></th>
      <th style={{minWidth: "100px"}}><span className="text-dark-75">Result</span></th>
    </tr>
  };

  const renderTableData = () => {
    return results.map((test_result, index) => {
       const { issue, result } = test_result
       return (
          <tr key={index}>
             <td><span className="text-dark-75 font-weight-bolder d-block font-size-lg">{issue}</span></td>
             <td><span className="text-dark-75 font-weight-bolder d-block font-size-lg">{result}</span></td>
          </tr>
       )
    })
  };

  return (
    <>
      <Notice icon="flaticon-warning font-primary">
          <span>
            <a
              target="_blank"
              className="font-weight-bold"
              rel="noopener noreferrer"
              href="https://gitlab.com/sertis/data-analyst/data-desk-test"
            >
              Data Desk Test
            </a>
            <span>{" "}</span>provides test cases for data type mismatch error for SQL scripts.
          </span>
        </Notice>

        {/* <div>
          <FilePond 
            files={files}
            acceptedFileTypes={["text/sql"]}
            fileValidateTypeDetectType={(source, type) => new Promise((resolve, reject) => {
              if (source.name.includes(".sql")) {
                type = "text/sql"
              }
              resolve(type);
            })}
            allowMultiple={false}
            onupdatefiles={setFiles}
            onremovefile={() => handleFileRemove()}
            labelIdle='Drag & Drop your SQL files or <span class="filepond--label-action">Browse</span>'>    
          </FilePond>
        </div>

        <div className="col text-center">
          <button
            id="data_deck_test_submit"
            type="submit"
            disabled={true}
            onClick={!loading ? handleSubmit : null}
            className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
          >
            <span>Submit</span>
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </button>
        </div>

        { results.length > 0 && 
        <div className="card-body">
          <table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
            <thead>
                {renderTableHeader()}
            </thead>
            <tbody>
                {renderTableData()}
            </tbody>
          </table>
        </div>
        } */}
    </>
  );
};
