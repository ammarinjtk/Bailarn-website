import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { FilePond, registerPlugin } from "react-filepond";
import { Notice } from "../../_metronic/_partials/controls";
import {Card, CardBody, CardHeader} from "../../_metronic/_partials/controls/Card";
import { uploadFileToGitlab } from "../../_metronic/_helpers";
import axios from "axios";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { useHistory } from "react-router-dom";

import "filepond/dist/filepond.min.css";
import "../../_metronic/_assets/css/file-pond.css"

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// Define new date formatting method of `Date` prototype 
// For todays date;
Date.prototype.today = function () { 
  return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
   return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

// Register the plugins
registerPlugin(FilePondPluginFileValidateType);

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

export function TableCreatorPage() {

  // Define `loading` to be used to display loading spinner
  const [loading, setLoading] = useState(false);

  // Define `files` as the file to be inputted from users
  const [files, setFiles] = useState([]);

  // Define `scheme` and `table` names as the inputs for Table creator service
  const textClasses = useStyles();
  const [inputs, setInputs] = React.useState({
    schema: '',
    table: ''
  });

  // Define `dialog` as the flag to show dialog message when user submitted a task
  const [dialog, setDialog] = React.useState({
    show: false,
    type: ''
  });

  // Define `lastSubmit` as the submission time
  const [lastSubmit, setLastSubmit] = useState(new Date());

  // Define `execTime` as the total execution time in string
  const [execTime, setExecTime] = useState("");

  // `History` to manage react router sessions and redirect to specific pages
  const history = useHistory();

  // Use `authToken` as the authenication token for other services by axios
  const { authToken } = useSelector(
    ({ auth }) => ({
      authToken: auth.authToken,
    }),
    shallowEqual
  );

  const clearStates = () => {
    setLoading(false);
  }

  // Handle `submit` button to process Table creator service
  const handleSubmit = () => {
    console.log("Inputs: " + inputs.schema + "." + inputs.table)

    setLoading(true);

    checkTableExists()
      .then((response) => {
        console.log("Checking table exists response: ", response.data);

        if (response.data.table_exists) {
          setDialog({ show: true, type: "table_exists" });
        } else {
          submitFile();
        }
        
      })
      .catch((error) => {
        console.log(error);

        clearStates();
        
        if (error.response.status == "401") {
          console.log("The access token is expired, you need to re-login again")
          history.push("/_auth/login");
        } else {
          history.push("/error");
        }
      });
  };

  const submitFile = () => {
    console.log("Start executing Table creator");
    tableCreator()
    .then((response) => {
      console.log("Table creator response: ", response.data);
      if (!response.data.header_valid) {
        setDialog({ show: true, type: "header_invalid" });
      } else {
        // Calculate total execution time
        const finishedDate = new Date();
        let delta = Math.abs(finishedDate - lastSubmit) / 1000;

        console.log("finishedDate: ", finishedDate, "lastSubmit: ", lastSubmit, "delta: ", delta)

        const hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        const minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        const seconds = delta % 60;
        
        let executionTime = "Total execution time: ";
        if (hours > 0) {
          executionTime += `${hours.toFixed(0)} hours `
        }
        if (minutes > 0) {
          executionTime += `${minutes.toFixed(0)} minutes `
        }
        if (seconds >= 0) {
          executionTime += `${seconds.toFixed(0)} seconds`
        }
        
        console.log("executionTime: ", executionTime)

        setExecTime(executionTime);

        console.log("execTime", execTime)
        setDialog({ show: true, type: "success" });
      }
      clearStates();
    })
    .catch((error) => {
      console.log("Error: ", error);
      clearStates();

      if (error.response.status == "401") {
        console.log("The access token is expired, you need to re-login again")
        history.push("/_auth/login");
      } else {
        history.push("/error");
      }
    });
  }

  const handleChange = name => event => {
    setInputs({ ...inputs, [name]: event.target.value });
  };

  const checkTableExists = () => {
    /* To execute checking table already exists by axios request to /check_table_exists (nginx proxy pass) */
    return new Promise((resolve, reject) => {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `token ${authToken}`,
        },
        params: {
          schema_name: inputs.schema,
          table_name: inputs.table
        },
      };
      
      axios
      .get(process.env.REACT_APP_TABLE_CREATOR_CHECK_TABLE_EXISTS_URL, config)
      .then((response) => {
        console.log(
          `Status ${response.status}: Checking table exists successfully`
        );
        resolve(response);
      })
      .catch((error) => {
        console.log(`Error status ${error.status}: Checking table exists error`);
        reject(error);
      });

    });
  }

  const tableCreator = () => {
    /* To execute Table creator service by axios request to /table_creator (nginx proxy pass) */
    return new Promise((resolve, reject) => {

      console.log("Sending post request to " + process.env.REACT_APP_TABLE_CREATOR_URL);
      
      let formData = new FormData();

      const data = {
        schema_name: inputs.schema,
        table_name: inputs.table
      };
      formData.append("file", files[0].file);
      formData.append("data", JSON.stringify(data));
      axios.post(process.env.REACT_APP_TABLE_CREATOR_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `token ${authToken}`
          }
      }).then((response) => {
        console.log(
          `Status ${response.status}: Checking successfully by Table creator service`
        );
        resolve(response);
      }).catch((error) => {
        console.log(`Error status ${error.status}: Checking by Table creator service error`);
        reject(error);
      });

    });
  }


  const handleFileRemove = () => {
    /* To set file state to be empty */
    setFiles([]);
  };

  // const handleFileProcessing = () => {
  //   /* To process received file by pushing the file to gitlab repository*/

  //   return new Promise((resolve, reject) => {

  //     // FIXME
  //     console.log("Fake uploading file to gitlab, file: ", files[0]);
  //     resolve("success");

  //     // const file = files[0].file;
  //     // const uploadedFileName = "uploads/" + file.name;
  //     // const gitUrl = `${
  //     //   process.env.REACT_APP_TABLE_CREATOR_GITLAB_BASE_URL
  //     // }/${encodeURIComponent(uploadedFileName)}`;
  //     // uploadFileToGitlab(gitUrl, process.env.REACT_APP_TABLE_CREATOR_GITLAB_BRANCH, file)
  //     //   .then((response) => {
  //     //     resolve(response);
  //     //   })
  //     //   .catch((error) => {
  //     //     reject(error);
  //     //   });
  //   });
  // };

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
              Table Creator
            </a>
            <span>{" "}</span>provides a tool to create new table in the datawarehouse from the external CSV/Excel files.
          </span>
        </Notice>

        <Card className="example example-compact">
          <CardHeader title={"Table Creator Submission Form"} />
          <CardBody>
            <form className={textClasses.container} noValidate autoComplete="off">
              <TextField
                required
                id="schema-name"
                label="Schema Name"
                className={textClasses.textField}
                value={inputs.schema}
                onChange={handleChange('schema')}
                margin="normal"
                variant="outlined"
              />
              <TextField
                required
                id="table-name"
                label="Table Name"
                className={textClasses.textField}
                value={inputs.table}
                onChange={handleChange('table')}
                margin="normal"
                variant="outlined"
              />
            </form>
            <div className="separator separator-dashed my-7" />
            <span>
                As of now, only <code>CSV</code>, <code>XLS</code>, and <code>XLSX</code> files with <code>column headers</code> is preferred and acceptable, otherwise it will raise an error. 
                <br /><br />
                Other file format handlers would be considered in the future version.
            </span>
            <div className="separator separator-dashed my-7" />
            <div >
              <FilePond
                files={files}
                acceptedFileTypes={["text/csv", "application/excel"]}
                fileValidateTypeDetectType={(source, type) =>
                  new Promise((resolve, reject) => {
                    if (source.name.includes(".csv")) {
                      type = "text/csv";
                    } else if (source.name.includes(".xls") || source.name.includes(".xlsx")) {
                      type = "application/excel";
                    }
                    resolve(type);
                  })
                }
                allowMultiple={false}
                onupdatefiles={setFiles}
                onremovefile={() => handleFileRemove()}
                labelIdle='Drag & Drop your CSV/EXCEL files or <span class="filepond--label-action">Browse</span>'
              ></FilePond>
            </div>
          </CardBody>
        </Card>

        <div className="col text-center">
          <button
            id="dacs_submit"
            type="submit"
            onClick={() => {setLastSubmit(new Date()); handleSubmit()}}
            className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
          >
            <span>Submit</span>
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </button>
          {/* {lastSubmit && <span>{"  "}Submission time: <code>{lastSubmit.timeNow()}</code></span>} */}
        </div>

        <div className="col text-center">
          {lastSubmit && <span>Submission time: <code>{lastSubmit.timeNow()}</code></span>}
        </div>
        
        {/* Show success dialog */}
        {files && files.length > 0 && dialog.type == "success" && (
          <Dialog
            open={dialog.show}
            onClose={() => {setDialog({ show: false, type: "" }); setFiles([]); setInputs({ schema: "", table: "" })}}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">You have successfully created the table:{" "}<code>{inputs.schema + "." + inputs.table}</code>.</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {execTime}
                <br /><br />
                I would love to know if you have any inconvenience or suggestions, please contact me at slack <code>Aum DI</code>.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {setDialog({ show: false, type: "" }); setFiles([]); setInputs({ schema: "", table: "" }); setExecTime("");}} color="primary" autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {/* When the submitted file has invalid header, show warning dialog */}
        {files && files.length > 0 && dialog.type == "header_invalid" && (
          <Dialog
            open={dialog.show}
            onClose={() => {setDialog({ show: false, type: "" })}}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Failed to created the table:{" "}<code>{inputs.schema + "." + inputs.table}</code>!</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Your submitted file <code>{files[0].file.name}</code> has invalid header, please retry again with the valid file with column headers.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {setDialog({ show: false, type: "" });}} color="primary" autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {/* When the table already exists, show alert dialog requiring acknowledgement from users*/}
        {files && files.length > 0 && dialog.type == "table_exists" && (
          <Dialog
            open={dialog.show}
            onClose={() => {setDialog({ show: false, type: "" })}}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Warning, the table:{" "}<code>{inputs.schema + "." + inputs.table}</code> already exists</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to overwrite the existing table?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {setDialog({ show: false, type: "" }); submitFile()}} color="primary" autoFocus>
                Overwrite
              </Button>
              <Button onClick={() => {setDialog({ show: false, type: "" }); setLoading(false)}} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        )}
        
    </>
  );
};