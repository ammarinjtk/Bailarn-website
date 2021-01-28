import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";

import * as tf from '@tensorflow/tfjs';
import { makeStyles } from '@material-ui/core/styles';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';

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
    NUM_CHARS,
    PAD_TAG_INDEX,
    NON_SEGMENT_TAG_INDEX,
    TAG_START_INDEX
} from "../modules/NLP/utils/tokenizer";
import { pad, build_tag_index } from "../modules/NLP/utils/utils";


const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    result: {
        marginLeft: theme.spacing(40),
        marginRight: theme.spacing(40),
        position: 'relative',
        overflow: 'auto',
        maxHeight: 600,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    textValidator: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    validatorForm: {
        marginLeft: 50,
        marginRight: 50
    },
    resultList: {
        width: '100%',
        marginBottom: theme.spacing(0.1),
        height: 500,
        backgroundColor: theme.palette.background.paper,
    }

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

    // Define `outputs` for the Tokenizer model
    const [outputs, setOutputs] = React.useState([]);

    // `History` to manage react router sessions and redirect to specific pages
    const history = useHistory();

    // Use `authToken` as the authenication token for other services by axios
    const { authToken } = useSelector(
        ({ auth }) => ({
            authToken: auth.authToken,
        }),
        shallowEqual
    );

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
        getPrediction().then((results) => {
            setOutputs(results);
            setLoading(false);
        });
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
                    <span>{" "}</span>The process of identifying the word boundaries in Thai language to divide the inputs into a meaningful unit as a word.
          </span>
            </Notice>

            <Card className="example example-compact">
                <CardHeader title={"Tokenizer Inputs"} />
                <CardBody>
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
        </>
    );
};