import axios from "axios";

export const uploadFileToGitlab = (url, branch, file) => {
    return new Promise((resolve, reject) => {
      const config = {
        headers: {
          "PRIVATE-TOKEN": `${process.env.REACT_APP_GITLAB_PRIVATE_TOKEN}`
        }
      }
      axios.get(`${url}?ref=${branch}`, config)
      .then(response => {
        console.log(
          `Status ${response.status}: The file ${file.name} already existed in Gitlab repo, updating it instead`
        );
        file.text().then(text => {
          // Update the existing file using PUT
          const data = {
            branch: branch,
            content: `${text}`,
            commit_message: `Update file ${file.name} from DI Portal service`
          };
          axios.put(`${url}`, data, config)
          .then(response => {
            console.log(
              `Status ${response.status}: Updating the existing file successfully`
            );
            resolve(response);
          })
          .catch(error => {
            console.log(
              `Error status ${error.status}: Updating the existing file error`
            );
            reject(error);
          });
        })
      })
      .catch(err => {
        console.log(
          `Error status ${err}: The file ${file.name} do not existed in Gitlab repo, creating a new file`
        );
        file.text().then(text => {
          // Create a new file using POST
          const data = {
            branch: branch,
            content: `${text}`,
            commit_message: `Create new file ${file.name} from DI Portal service`
          };
          axios.post(`${url}`, data, config)
          .then(response => {
            console.log(
              `Status ${response.status}: Creating new file successfully`
            );
            resolve(response);
          })
          .catch(error => {
            console.log(
              `Error status ${error.status}: Creating new file error`
            );
            reject(error);
          })
        })
      })
    });
  };