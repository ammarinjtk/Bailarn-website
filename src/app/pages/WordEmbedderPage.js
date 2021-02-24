import React, { useState, useEffect } from "react";
// import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";

import * as tf from '@tensorflow/tfjs';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';

import { LayoutSplashScreen } from "../../_metronic/layout";
import { Notice } from "../../_metronic/_partials/controls";
import { Card, CardBody, CardHeader } from "../../_metronic/_partials/controls/Card";


const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    result: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        position: 'relative',
        overflow: 'auto',
        maxHeight: 600,
    },
    textValidator: {
        margin: theme.spacing(1),
        width: 150
    },
    validatorForm: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    resultList: {
        width: '100%',
        marginBottom: theme.spacing(1),
        height: 500,
        backgroundColor: theme.palette.background.paper,
    },
    tableRoot: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
    button: {
        margin: theme.spacing(1),
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    paper: {
        margin: theme.spacing(1),
    },
}));

export function WordEmbedderPage() {

    // Init page load
    useEffect(() => {
        initWordEmbedderPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const classes = useStyles();

    // Define `wordEmbedder` as the wordEmbedder model
    const [wordEmbedder, setWordEmbedder] = useState(undefined);

    // Define `wordIndex` as the word2idx of the Word embedder
    const [wordIndex, setWordIndex] = useState(undefined);

    // Define `loading` to be used to display loading spinner
    const [loading, setLoading] = useState(true);

    // Define `pageLoading` to be used to display loading spinner waiting for HTTPS response
    const [pageLoading, setPageLoading] = useState(true);

    // Define `inputs` for the Tokenizer model
    const [inputs, setInputs] = React.useState({
        firstWord: '',
        secondWord: '',
        thirdWord: ''
    });

    // Define `outputs` for the Tokenizer model
    const [outputs, setOutputs] = React.useState([]);

    // `History` to manage react router sessions and redirect to specific pages
    const history = useHistory();

    // Use `authToken` as the authenication token for other services by axios
    // const { authToken } = useSelector(
    //     ({ auth }) => ({
    //         authToken: auth.authToken,
    //     }),
    //     shallowEqual
    // );

    const StyledTableCell = withStyles(theme => ({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell);

    const StyledTableRow = withStyles(theme => ({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.background.default,
            },
        },
    }))(TableRow);

    const initWordEmbedderPage = () => {
        setPageLoading(true);
        loadWordIndex();
        loadWordEmbedderModel();
        setPageLoading(false);
    };

    const handleChange = name => event => {
        setInputs({ ...inputs, [name]: event.target.value });
    };

    const loadWordIndex = () => {
        fetch(
            "https://raw.githubusercontent.com/ammarinjtk/Bailarn-website/master/src/app/modules/NLP/models/word_embedder/word_embedder_word_index.json"
        )
            .then(res => res.json())
            .then(out => {
                console.log("loadWordIndex: ", out)
                setWordIndex(out);
            })
            .catch(err => console.error(err));
    };

    const loadWordEmbedderModel = async () => {
        setLoading(true);
        tf.loadModel("https://raw.githubusercontent.com/ammarinjtk/Bailarn-website/master/src/app/modules/NLP/models/word_embedder/model.json")
            .then((model) => {
                setWordEmbedder(model);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                history.push("/error");
            });
    };

    const handleSubmit = () => {
        setLoading(true);
        getPrediction().then((results) => {
            setOutputs(results);
            setLoading(false);
        });
    };

    const getPrediction = async () => {
        return new Promise((resolve, _) => {
            const tokens = [inputs.firstWord, inputs.secondWord, inputs.thirdWord];
            let dist_list = [];
            let dist = {};

            if (!wordEmbedder) {
                loadWordEmbedderModel(() => {
                    for (let i = 0; i < tokens.length; i++) {
                        for (let j = i + 1; j < tokens.length; j++) {
                            let in_arr1 = wordIndex[tokens[i]];
                            let in_arr2 = wordIndex[tokens[j]];

                            in_arr1 = tf.tensor1d([in_arr1]);
                            in_arr2 = tf.tensor1d([in_arr2]);

                            let d = wordEmbedder.predict([in_arr1, in_arr2]).dataSync();

                            let word_pair = [tokens[i], tokens[j]];
                            dist[word_pair] = d;
                        }
                    };

                    // Create items array
                    let sorted_dist = Object.keys(dist).map(function (key) {
                        return [key, dist[key]];
                    });

                    // Sort the array based on the second element
                    sorted_dist.sort(function (first, second) {
                        return second[1] - first[1];
                    });

                    for (let i = 0; i < sorted_dist.length; i++) {
                        let word_list = sorted_dist[i][0].split(",");
                        let d = sorted_dist[i][1];

                        dist_list.push({
                            w1: word_list[0],
                            w2: word_list[1],
                            distance: parseFloat(d).toFixed(4)
                        });
                    };

                    resolve(dist_list);
                });
            } else {
                for (let i = 0; i < tokens.length; i++) {
                    for (let j = i + 1; j < tokens.length; j++) {
                        let in_arr1 = wordIndex[tokens[i]];
                        let in_arr2 = wordIndex[tokens[j]];

                        in_arr1 = tf.tensor1d([in_arr1]);
                        in_arr2 = tf.tensor1d([in_arr2]);

                        let d = wordEmbedder.predict([in_arr1, in_arr2]).dataSync();

                        let word_pair = [tokens[i], tokens[j]];
                        dist[word_pair] = d;
                    }
                };

                // Create items array
                let sorted_dist = Object.keys(dist).map(function (key) {
                    return [key, dist[key]];
                });

                // Sort the array based on the second element
                sorted_dist.sort(function (first, second) {
                    return second[1] - first[1];
                });

                for (let i = 0; i < sorted_dist.length; i++) {
                    let word_list = sorted_dist[i][0].split(",");
                    let d = sorted_dist[i][1];

                    dist_list.push({
                        w1: word_list[0],
                        w2: word_list[1],
                        distance: parseFloat(d).toFixed(4)
                    });
                };

                resolve(dist_list);
            };
        });
    };

    return pageLoading ? <LayoutSplashScreen /> : (
        <>
            <Notice icon="flaticon-warning font-primary">
                <span>
                    <a
                        target="_blank"
                        className="font-weight-bold"
                        rel="noopener noreferrer"
                        href="https://gitlab.com/sertis/data-analyst"
                    >
                        Word Embedding
                    </a>
                    <span>{" "}</span>, is the process of creating a word representation that allows words with similar meaning to have a similar representation.
                </span>
            </Notice>

            <Card className="example example-compact">
                <CardHeader title={"What is Word Embedding?"} />
                <CardBody>
                    <span>A word embedding is a learned representation, as a vector, for a text where words that have the same meaning have a similar representation.</span>
                    <br /><br />
                    <span>Word embeddings are in fact a class of techniques where individual words are represented as real-valued vectors in a predefined vector space. Each word is mapped to one vector and the vector values are learned in a way the resembels a neural network.</span>
                    <br /><br />
                    <span>Each word is represented by a real-valued vector, often tens or hundreds of dimensions. This is contrasted to the thousands or millions of dimensions required for sparse word representations, such as a one-hot encoding.</span>
                    <br /><br />
                    <span>One of the benefits of using dense and low-dimensional vectors is computational. The majority of deep learning models do not play well with very high-dimensional and sparse vectors. If we believe that some features may provide similar clues, it is worthwhile to provide a representation that is able to capture these similarities.</span>
                </CardBody>
                <CardBody>
                    <span>You can try it yourself! By identifying 3 different words, the model will return the similarity score of each word pair. More similarity score means that the word pair is more similar.</span>
                    <br /><br />
                    <ValidatorForm className={classes.validatorForm} onSubmit={() => { }}>
                        <ListItem style={{ display: "flex", flexWrap: "wrap" }}>
                            <TextValidator
                                required
                                label={"#1"}
                                onChange={handleChange("firstWord")}
                                value={inputs.firstWord}
                                className={classes.textValidator}
                                variant="outlined"
                            />
                            <TextValidator
                                required
                                label={"#2"}
                                onChange={handleChange("secondWord")}
                                value={inputs.secondWord}
                                className={classes.textValidator}
                                variant="outlined"
                            />
                            <TextValidator
                                required
                                label={"#3"}
                                onChange={handleChange("thirdWord")}
                                value={inputs.thirdWord}
                                className={classes.textValidator}
                                variant="outlined"
                            />
                        </ListItem>
                    </ValidatorForm>
                    <div className="separator separator-dashed my-7" />
                    <Typography variant="button" display="block" gutterBottom>
                        Available Examples:
                    </Typography>
                    <Paper className={classes.paper}>
                        <MenuList>
                            <MenuItem onClick={() => {
                                setInputs({ firstWord: "แม่", secondWord: "พ่อ", thirdWord: "เพื่อนบ้าน" })
                            }}>
                                <SendIcon fontSize="small" />
                                <Typography style={{ marginLeft: 10 }} variant="inherit">แม่ | พ่อ | เพื่อนบ้าน</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => {
                                setInputs({ firstWord: "วันเสาร์", secondWord: "วันอังคาร", thirdWord: "ดวงจันทร์" })
                            }}>
                                <SendIcon fontSize="small" />
                                <Typography style={{ marginLeft: 10 }} variant="inherit">วันเสาร์ | วันอังคาร | ดวงจันทร์</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => {
                                setInputs({ firstWord: "กิน", secondWord: "เก้าอี้", thirdWord: "รับประทาน" })
                            }}>
                                <SendIcon fontSize="small" />
                                <Typography style={{ marginLeft: 10 }} variant="inherit">กิน | เก้าอี้ | รับประทาน</Typography>
                            </MenuItem>
                        </MenuList>
                    </Paper>
                </CardBody>
            </Card>

            <div className="col text-center">
                <Typography variant="body1" gutterBottom>
                    You might be able to see the loading spinner when you are submitting
                    <span>{" "}</span><span role="img" aria-label="sad">😢</span>
                </Typography>
                <button
                    id="submit"
                    type="submit"
                    disabled={loading}
                    onClick={handleSubmit}
                    className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
                >
                    <span>Analyse</span>
                    {loading && <span className="ml-3 spinner spinner-white"></span>}
                </button>
            </div>


            {/* Show outputs */}
            {outputs && outputs.length > 0 && (
                <Card className={classes.result} style={{ marginTop: 30 }}>
                    <CardHeader title={"Results"} />
                    <CardBody>
                        <Paper className={classes.tableRoot}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Word #1</StyledTableCell>
                                        <StyledTableCell>Word #2</StyledTableCell>
                                        <StyledTableCell align="right">Similarity Score</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {outputs.map((row, idx) => (
                                        <StyledTableRow key={idx}>
                                            <StyledTableCell component="th" scope="row">
                                                {row.w1}
                                            </StyledTableCell>
                                            <StyledTableCell component="th" scope="row">
                                                {row.w2}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">{row.distance}</StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </CardBody>
                    <CardBody>
                        <span>If you are interested more for word embedding, you can find a practical example to comprehend the concept using</span>
                        <span>{"  "}</span>
                        <Button
                            color="secondary"
                            size="large"
                            className={classes.button}
                            target="_blank"
                            rel="noopener noreferrer"
                            href="http://projector.tensorflow.org/?config=https://gist.githubusercontent.com/ammarinjtk/7c393efd36b7549f98f2ac8e4898ad69/raw/9db47703cdd1137a9094f975bcc4008d7318848f/config.json"
                        >
                            Embedding Projector
                        </Button>
                    </CardBody>
                </Card>
            )
            }
        </>
    );
};