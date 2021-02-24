import React, { useState, useEffect } from "react";
// import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";

import * as tf from '@tensorflow/tfjs';
import { makeStyles } from '@material-ui/core/styles';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';

import { LayoutSplashScreen } from "../../_metronic/layout";
import { Notice } from "../../_metronic/_partials/controls";
import { Card, CardBody, CardHeader } from "../../_metronic/_partials/controls/Card";
import {
    SEQUENCE_LENGTH,
    SPACEBAR,
    CHARACTER_LIST,
    READABLE_PAD_CHAR,
    PAD_CHAR_INDEX,
    UNKNOW_CHAR_INDEX,
    CHAR_START_INDEX,
    PAD_TAG_INDEX,
    NON_SEGMENT_TAG_INDEX
} from "../modules/NLP/utils/tokenizer";
import { pad, build_tag_index } from "../modules/NLP/utils/utils";


const useStyles = makeStyles(theme => ({
    result: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        position: 'relative',
        overflow: 'auto',
        maxHeight: 600,
    },
    textValidator: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
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
    chip: {
        margin: theme.spacing(0.5),
    },
    button: {
        margin: theme.spacing(1),
    },
    paper: {
        margin: theme.spacing(1),
    },
}));

export function TokenizerPage() {

    // Init page load
    useEffect(() => {
        initTokenizerPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const classes = useStyles();

    // Define `tokenizer` as the Tokenizer model
    const [tokenizer, setTokenizer] = useState(undefined);

    // Define `charIndex` as the char2idx of the Tokenizer
    const [charIndex, setCharIndex] = useState(undefined);

    // Define `loading` to be used to display loading spinner
    const [loading, setLoading] = useState(true);

    // Define `pageLoading` to be used to display loading spinner waiting for HTTPS response
    const [pageLoading, setPageLoading] = useState(true);

    // Define `inputs` for the Tokenizer model
    const [inputs, setInputs] = React.useState({
        text: '',
    });

    // Define `dialog` as the flag to show dialog message when user submitted a task
    const [dialog, setDialog] = React.useState({
        show: false,
        type: ''
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

    const initTokenizerPage = () => {
        setPageLoading(true);
        loadCharIndex();
        loadTokenizerModel();
        setPageLoading(false);
    };

    const handleChange = name => event => {
        setInputs({ ...inputs, [name]: event.target.value });
    };

    const loadCharIndex = () => {
        const char2idx = build_tag_index(CHARACTER_LIST, CHAR_START_INDEX);
        setCharIndex(char2idx);
    };

    const loadTokenizerModel = async () => {
        setLoading(true);
        tf.loadModel("https://raw.githubusercontent.com/ammarinjtk/Bailarn-website/master/src/app/modules/NLP/models/tokenizer/model.json")
            .then((model) => {
                setTokenizer(model);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                history.push("/error");
            });
    };

    const handleSubmit = () => {
        setLoading(true);

        if (inputs.text.length > 60) {
            setDialog({ show: true, type: "invalid_char" });
            setLoading(false);
        } else {
            getPrediction().then((results) => {
                setOutputs(results);
                setLoading(false);
            });
        };
    };

    const getPrediction = async () => {
        return new Promise((resolve, _) => {
            let x = [];
            let readable_x = [];

            for (let i = 0; i < inputs.text.length; i++) {
                let char = inputs.text[i];
                if (char in charIndex) {
                    x.push(charIndex[char]);
                } else {
                    x.push(UNKNOW_CHAR_INDEX);
                }
                readable_x.push(char);
            }

            // padding
            x = pad([x], SEQUENCE_LENGTH, PAD_CHAR_INDEX);
            readable_x = pad([readable_x], SEQUENCE_LENGTH, READABLE_PAD_CHAR);

            // casting
            x = tf.tensor2d(x);

            if (!tokenizer) {
                loadTokenizerModel(() => {
                    let tokenizer_outputs = tokenizer.predict(x);

                    let y_pred = tokenizer_outputs.argMax(2);
                    y_pred = y_pred.flatten();

                    let all_result = [];
                    for (let sample_idx = 0; sample_idx < readable_x[0].length; sample_idx++) {
                        let label = y_pred.get([sample_idx]);
                        let char = readable_x[0][sample_idx];
                        // Pad label
                        if (label === PAD_TAG_INDEX) continue;
                        // Pad char
                        if (char === READABLE_PAD_CHAR) continue;
                        all_result.push(char);
                        // Skip tag for spacebar character
                        if (char === SPACEBAR) continue;
                        // Tag at segmented point
                        if (label !== NON_SEGMENT_TAG_INDEX) {
                            all_result.push("|");
                        }
                    }
                    const results = all_result.join("").split("|").filter(function (el) { return el !== "" });
                    console.log("Tokenizer outputs: ", results);
                    resolve(results);
                });
            } else {
                let tokenizer_outputs = tokenizer.predict(x);

                let y_pred = tokenizer_outputs.argMax(2);
                y_pred = y_pred.flatten();

                let all_result = [];
                for (let sample_idx = 0; sample_idx < readable_x[0].length; sample_idx++) {
                    let label = y_pred.get([sample_idx]);
                    let char = readable_x[0][sample_idx];
                    // Pad label
                    if (label === PAD_TAG_INDEX) continue;
                    // Pad char
                    if (char === READABLE_PAD_CHAR) continue;
                    all_result.push(char);
                    // Skip tag for spacebar character
                    if (char === SPACEBAR) continue;
                    // Tag at segmented point
                    if (label !== NON_SEGMENT_TAG_INDEX) {
                        all_result.push("|");
                    }
                }
                const results = all_result.join("").split("|").filter(function (el) { return el !== "" });
                console.log("Tokenizer outputs: ", results);
                resolve(results);
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
                        Tokenization
                    </a>
                    <span>{" "}</span>, also known as word segmentation, is the process of identifying the word boundaries to divide the inputs into a meaningful unit as a word.
                </span>
            </Notice>

            <Card className="example example-compact">
                <CardHeader title={"What is Tokenization?"} />
                <CardBody>
                    <span>Tokenization is a fundamental pre-processing step for NLP models. Given a character sequence (sentence), tokenization is the task of chopping it up into pieces, called tokens.</span>
                    <br /><br />
                    <span>Here is an example of the tokenization:</span>
                    <br /><br />
                    <div>
                        <span style={{ marginLeft: 30 }}>Input: สวัสดีตอนเช้า เป็นยังไงบ้างครับ</span>
                    </div>
                    <div>
                        <span style={{ marginLeft: 30 }}>Output: </span>
                        <Chip label="สวัสดี" color="secondary" className={classes.chip} variant="outlined" />
                        <Chip label="ตอน" color="secondary" className={classes.chip} variant="outlined" />
                        <Chip label="เช้า" color="secondary" className={classes.chip} variant="outlined" />
                        <Chip label="เป็น" color="secondary" className={classes.chip} variant="outlined" />
                        <Chip label="ยัง" color="secondary" className={classes.chip} variant="outlined" />
                        <Chip label="ไง" color="secondary" className={classes.chip} variant="outlined" />
                        <Chip label="บ้าง" color="secondary" className={classes.chip} variant="outlined" />
                        <Chip label="ครับ" color="secondary" className={classes.chip} variant="outlined" />
                    </div>
                    <br />
                    <span>While the tokenization is considered relatively simple in English language, it is still an open problem in languages without explicitly defined word delimiters, including Thai language.</span>
                    <span>In short, researches in tokenization for Thai started around 1990. Since then, there have been several algorithms being proposed to address the problem, which can be clustered into two categoires: Dictionary-based and Machine-learning-based.</span>
                    <br /><br />
                    <span>Generally, each algorithm has its own advantage and disadvantage. Dictationary-based algorithms are fast but less capable of encoutering unknown words. While the machine-learning-based methods are qualitatively better and more adaptable to different data sets from different domains; however, thier require much more computation on training.</span>
                    <br /><br />
                    <span>If you interested more in why the tokenization in Thai are more difficult than others, you can find more details in this</span>
                    <span>{" "}</span>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://pt-br.facebook.com/notes/prachya-boonkwan/nlp-%E0%B9%84%E0%B8%97%E0%B8%A2-%E0%B9%84%E0%B8%A1%E0%B9%88%E0%B9%84%E0%B8%9B%E0%B9%84%E0%B8%AB%E0%B8%99%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%87%E0%B8%AB%E0%B8%A3%E0%B8%B7%E0%B8%AD-tldr/10154811091686242/"
                    >
                        Facebook post by Prachya Boonkwan
                    </a>
                </CardBody>
                <CardBody>
                    <span>You can try it yourself!</span>
                    <br /><span>*Due to the model size limitation, we can only support the inputs length of <code>60 characters</code>.</span>
                    <ValidatorForm className={classes.validatorForm} onSubmit={() => { }}>
                        <TextValidator
                            required
                            label={"Inputs"}
                            onChange={handleChange("text")}
                            value={inputs.text}
                            helperText={"The inputs can be any sentences containing no more than 60 characters"}
                            className={classes.textValidator}
                            margin="normal"
                            variant="outlined"
                            validators={["minStringLength:0", "maxStringLength:60"]}
                            errorMessages={["Expected the inputs to not be empty", "Expected the inputs length to be less than 60 characters"]}
                        />
                    </ValidatorForm>
                    <div className="separator separator-dashed my-7" />
                    <Typography variant="button" display="block" gutterBottom>
                        Available Examples:
                    </Typography>
                    <Paper className={classes.paper}>
                        <MenuList>
                            <MenuItem onClick={() => { setInputs({ ...inputs, text: "สวัสดีตอนเช้า เป็นยังไงบ้างครับ" }) }}>
                                <SendIcon fontSize="small" />
                                <Typography style={{ marginLeft: 10 }} variant="inherit">สวัสดีตอนเช้า เป็นยังไงบ้างครับ</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => { setInputs({ ...inputs, text: "ฉันอยากรู้จักเธอ" }) }}>
                                <SendIcon fontSize="small" />
                                <Typography style={{ marginLeft: 10 }} variant="inherit">ฉันอยากรู้จักเธอ</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => { setInputs({ ...inputs, text: "นายกฯ เดินหน้าแก้ปัญหาน้ำยั่งยืน" }) }}>
                                <SendIcon fontSize="small" />
                                <Typography style={{ marginLeft: 10 }} variant="inherit">นายกฯ เดินหน้าแก้ปัญหาน้ำยั่งยืน</Typography>
                            </MenuItem>
                        </MenuList>
                    </Paper>
                </CardBody>
            </Card>

            <div className="col text-center">
                <Typography variant="body1" gutterBottom>
                    You might be able to see the loading spinner when you are submitting, please wait
                    <span>{" "}</span><span role="img" aria-label="sad">😢</span>
                </Typography>
                <button
                    id="submit"
                    type="submit"
                    disabled={loading}
                    onClick={handleSubmit}
                    className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
                >
                    <span>{loading ? "Loading" : "Analyse"}</span>
                    {loading && <span className="ml-3 spinner spinner-white"></span>}
                </button>
            </div>


            {/* Show outputs */}
            {outputs && outputs.length > 0 && (
                <Card className={classes.result} style={{ marginTop: 30 }}>
                    <CardHeader title={"Results"} />
                    <CardBody>
                        <div className={classes.resultList}>
                            <List >
                                {outputs.map((text, idx) => {
                                    return (
                                        <ListItem key={`text-${idx}`} button>
                                            <ListItemText primary={text} />
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </div>
                    </CardBody>
                </Card>
            )
            }

            {/* Show invalid character lengths dialog */}
            {dialog.type === "invalid_char" && (
                <Dialog
                    open={dialog.show}
                    onClose={() => { setDialog({ show: false, type: "" }) }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Failed to analyse your inputs!</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Sorry, your inputs contain more than <code>60 characters</code>. Please try again.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { setDialog({ show: false, type: "" }) }} color="primary" autoFocus>
                            OK
              </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};