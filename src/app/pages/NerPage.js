import React, { useState, useEffect } from "react";
// import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";

import * as tf from '@tensorflow/tfjs';
import { makeStyles } from '@material-ui/core/styles';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import List from '@material-ui/core/List';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import { LayoutSplashScreen } from "../../_metronic/layout";
import { Notice } from "../../_metronic/_partials/controls";
import { Card, CardBody, CardHeader } from "../../_metronic/_partials/controls/Card";
import {
    SEQUENCE_LENGTH as TOKEN_SEQUENCE_LENGTH,
    SPACEBAR,
    CHARACTER_LIST,
    READABLE_PAD_CHAR,
    PAD_CHAR_INDEX,
    UNKNOW_CHAR_INDEX,
    CHAR_START_INDEX,
    PAD_TAG_INDEX,
    NON_SEGMENT_TAG_INDEX
} from "../modules/NLP/utils/tokenizer";
import {
    TAG_LIST,
    SEQUENCE_LENGTH as NER_SEQUENCE_LENGTH,
    TAG_DESCRIPTIONS
} from "../modules/NLP/utils/ner";
import { pad, build_tag_index, swap } from "../modules/NLP/utils/utils";

const useStyles = makeStyles(theme => ({
    result: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        position: 'relative',
        overflow: 'auto',
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
        backgroundColor: theme.palette.background.paper,
    },
    chip: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    }
}));

export function NERPage() {

    // Init page load
    useEffect(() => {
        initNERPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const classes = useStyles();

    // Define `tokenizer` as the Tokenizer model
    const [tokenizer, setTokenizer] = useState(undefined);

    // Define `charIndex` as the char2idx of the Tokenizer
    const [charIndex, setCharIndex] = useState(undefined);

    // Define `nerModel` as the NER model
    const [nerModel, setNerModel] = useState(undefined);

    // Define `tagIndex` as the tag2idx of the NER model
    const [tagIndex, setTagIndex] = useState(undefined);

    // Define `wordIndex` as the word2idx of the Word embedder
    const [wordIndex, setWordIndex] = useState(undefined);

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

    // Define `tokens` used as outputs of the Tokenizer model
    const [tokens, setTokens] = React.useState([]);

    // Define `outputs` used as outputs of the NER model
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

    const initNERPage = () => {
        setPageLoading(true);

        // Initialize Tokenizer
        loadCharIndex();
        loadTokenizerModel();

        // Initialize Word embedder
        loadWordIndex();

        // Initialize NER model
        loadTagIndex();
        loadNERModel();

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

    const loadTagIndex = () => {
        const tag2idx = build_tag_index(TAG_LIST, 0);
        setTagIndex(tag2idx);
    };

    const loadNERModel = async () => {
        setLoading(true);
        tf.loadModel("https://raw.githubusercontent.com/ammarinjtk/Bailarn-website/master/src/app/modules/NLP/models/ner/model.json")
            .then((model) => {
                setNerModel(model);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                history.push("/error");
            });
    };

    const loadWordIndex = () => {
        fetch(
            "https://raw.githubusercontent.com/ammarinjtk/Bailarn-website/master/src/app/modules/NLP/models/ner/ner_word_index.json"
        )
            .then(res => res.json())
            .then(out => {
                let word2idx = out;
                word2idx["<PAD>"] = 0;
                console.log("Index for UNK word: ", word2idx["UNK"]);
                console.log("Index for PAD word: ", word2idx["<PAD>"]);
                setWordIndex(word2idx);
            })
            .catch(err => console.error(err));
    };

    const getTokenizerPrediction = async (words) => {
        return new Promise((resolve, _) => {
            let x = [];
            let readable_x = [];

            for (let i = 0; i < words.length; i++) {
                let char = words[i];
                if (char in charIndex) {
                    x.push(charIndex[char]);
                } else {
                    x.push(UNKNOW_CHAR_INDEX);
                }
                readable_x.push(char);
            }

            // padding
            x = pad([x], TOKEN_SEQUENCE_LENGTH, PAD_CHAR_INDEX);
            readable_x = pad([readable_x], TOKEN_SEQUENCE_LENGTH, READABLE_PAD_CHAR);

            // casting
            x = tf.tensor2d(x);

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
    };

    const getNERPrediction = async (words) => {
        return new Promise((resolve, _) => {
            const index2tag = swap(tagIndex);

            let x = [];
            let readable_x = [];

            for (let i = 0; i < words.length; i++) {
                let word = words[i];
                if (word in wordIndex) {
                    x.push(wordIndex[word]);
                } else {
                    x.push("UNK");
                }
                readable_x.push(word);
            }

            x = pad([x], NER_SEQUENCE_LENGTH, 0);
            console.log(`NER Inputs (x): ${x}`);

            x = tf.tensor2d(x);
            let output = nerModel.predict(x);
            console.log(`NER Outputs (output): ${output}`);

            let y_pred = output.argMax(2).flatten().dataSync();
            console.log(`NER Outputs after argmax (y_pred): ${y_pred}`);

            let decoeded_y_pred = [];
            for (let i = 0; i < readable_x.length; i++) {
                decoeded_y_pred.push(index2tag[y_pred[i]]);
            }

            resolve(decoeded_y_pred);
        });
    };

    const handleSubmit = () => {
        setLoading(true);
        if (inputs.text.length > 60) {
            setDialog({ show: true, type: "invalid_char" });
            setLoading(false);
        } else {
            getTokenizerPrediction(inputs.text).then((words) => {
                console.log(`[getTokenizerPrediction] Get words: ${words}`);
                setTokens(words);
                getNERPrediction(words).then((nerTags) => {
                    setOutputs(nerTags);
                    setLoading(false);
                });
            });
        };
    };

    const renderOutput = (tag, index) => {
        const word = tokens[index];
        const tag_desc = TAG_DESCRIPTIONS[tag];
        if (tag_desc) {
            return (
                <Tooltip key={`tooltip_${index}`} title={<Typography variant="subtitle2">{tag_desc}</Typography>} interactive>
                    <Chip key={`chip_${index}`} size="medium" color="secondary" label={word} className={classes.chip} variant="outlined" />
                </Tooltip>
            );
        } else {
            console.log("word");
            return (<span className={classes.chip}>{word}</span>)
        }
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
                        Named Entity Recognition (NER)
                    </a>
                    <span>{" "}</span>, also known as entity identification, entity chunking, and entity extraction, is a subtask of information extraction that seeks to locate and classify elements in text into pre-defined categories such as the names of persons, organizations, locations.
                </span>
            </Notice>

            <Card className="example example-compact">
                <CardHeader title={"What is Named Entity Recognition?"} />
                <CardBody>
                    <span>NER plays a major role in the semantic part of NLP, which, extracts the meaning of words, sentences and their relationships. Basic NER processes structured and unstructured texts by identifying and locating entities, such as persons, organizarions, and so on.</span>
                    <br /><br />
                    <span>For example, in the sentence:</span>
                    <br /><br />
                    <div>
                        <span style={{ marginLeft: 30 }}>Input: Mark Zuckerberg is one of the founders of Facebook, a company from the United States</span>
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <span style={{ marginLeft: 30 }}>Output: </span>
                        <span style={{ marginLeft: 10 }}>{"Person: "}</span><Chip label="Mark Zuckerberg" color="secondary" className={classes.chip} variant="outlined" />
                        <span style={{ marginLeft: 30 }}>{"Company: "}</span><Chip label="Facebook" color="secondary" className={classes.chip} variant="outlined" />
                        <span style={{ marginLeft: 30 }}>{"Location: "}</span><Chip label="United States" color="secondary" className={classes.chip} variant="outlined" />
                    </div>
                    <br />
                    <span>NER plays a key role by identifying and classifying entities in a text. It is the first step in enabling machines to understand what seems to be an unstructured sequence of words. Nevertheless, it is still a long journey to understand a text like a human. One becomes particularly aware of this when going into detail: As we found out NER understands “Mark Zuckerberg” as a person. However, NER can’t differentiate between all the people called “Mark Zuckerberg”.</span>
                </CardBody>
                <CardBody>
                    <span>You can try it yourself!</span>
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
                    <span>
                        *Due to the model size limitation, we can only support the inputs length of <code>60 characters</code>.
                    </span>
                </CardBody>
            </Card>

            <div className="col text-center">
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
                        <div className={classes.resultList}>
                            <List >
                                {outputs.map((tag, index) => {
                                    return renderOutput(tag, index)
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