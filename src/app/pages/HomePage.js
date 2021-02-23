import React from "react";
import { NavLink } from "react-router-dom";
import { Notice } from "../../_metronic/_partials/controls";
// import axios from "axios";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../_metronic/_helpers";

import { makeStyles, useTheme } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  card: {
    maxWidth: 345,
    marginLeft: theme.spacing(10),
    marginBottom: theme.spacing(3)
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export function HomePage() {

  const classes = useStyles();

  return (
    <>
      <Notice icon="flaticon-warning font-primary">
        <span>
          <a
            target="_blank"
            className="font-weight-bold"
            rel="noopener noreferrer"
            href="https://github.com/ammarinjtk/Bailarn-website"
          >
            Bailarn Website
                </a>
          <span>{" "}</span>to support Thai Natural Language Processing communities.
              </span>
      </Notice>

      <div>
        {/* About */}
        <div className={`card card-custom card-stretch gutter-b`}>
          {/* Header */}
          <div className="card-header border-0">
            <h3 className="card-title font-weight-bolder text-dark">
              About
                </h3>
          </div>

          {/* Body */}
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <CardHeader
                avatar={
                  <Avatar aria-label="Recipe" className={classes.avatar}>
                    A
          </Avatar>
                }
                action={
                  <IconButton aria-label="Settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                title="Amarin Jettakul"
                subheader="Data Analyst @ Sertis, Thailand"
              />
              <CardMedia
                style={{ marginLeft: 20, marginRight: 20 }}
                className={classes.media}
                image="https://scontent.fbkk12-2.fna.fbcdn.net/v/t1.0-9/154302810_3953385558060166_4003084579645366395_o.jpg?_nc_cat=105&ccb=3&_nc_sid=09cbfe&_nc_eui2=AeHspYbJEz2d1vE_VRjQxuQy8Bl76lGJ3ZHwGXvqUYndkbSaloQ2L7J_FX4pLhgjlzc2cPNOrDFXIUyuUQT5cU4_&_nc_ohc=ABllVZEGFiAAX9nr8n9&_nc_ht=scontent.fbkk12-2.fna&oh=8d868a26212a41065248dd470e663edc&oe=605AF16F"
              />
              <CardContent>
                <Typography style={{ marginLeft: 10 }} variant="body2" color="textSecondary" component="p">
                  My name is "Amarin Jettakul" and I was studied both Bachelor and Master degrees in Computer Engineering, Chulalongkorn University, Thailand.
        </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="Linkedin" onClick={() => window.open("https://www.linkedin.com/in/amarin-jettakul-796256185/")}>
                  <LinkedInIcon />
                </IconButton>
                <IconButton aria-label="Github" onClick={() => window.open("https://github.com/ammarinjtk/Bailarn-website")}>
                  <GitHubIcon />
                </IconButton>
              </CardActions>
            </Grid>
            <Grid item xs={8} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {/* https://github.com/ammarinjtk/Bailarn-python-library */}
              <Paper className={classes.paper}>
                <span>The project aims to develop Thai NLP library and web interface based on state-of-the-art deep learning techniques. With this project, users or developers will be able to train their NLP models on thier own dataset using the provided model structure and utilities.</span>
                <br /><br />
                <span>Thai NLP libraries also provide the pre-trained NLP models to process the sentences instancely. All pre-trained models were evaluated and compared across other deep learning methods proposed in the previous researches.</span>
                <br /><br />
                <span>You can find more details here:</span>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/ammarinjtk/Bailarn-python-library"
                >
                  Github (Bailarn Python Library)
                    </a>
                <br /><br />
                <span>* This project is supported by the Department of Computer Engineering, Chulalongkorn University and Thailand's National Electronics and Computer Technology Center (NECTEC).</span>
              </Paper>
            </Grid>
          </Grid>
        </div>

        {/* Features */}
        <div className={`card card-custom card-stretch gutter-b`}>
          {/* Header */}
          <div className="card-header border-0">
            <h3 className="card-title font-weight-bolder text-dark">
              Features Overview
                </h3>
          </div>

          {/* Body */}
          <div className="card-body pt-2">

            <div className="d-flex align-items-center mb-10">
              <div className="symbol symbol-40 symbol-light-primary mr-5">
                <span className="symbol-label">
                  <span className="svg-icon svg-icon-lg svg-icon-primary">
                    <SVG
                      className="h-75 align-self-end"
                      src={toAbsoluteUrl("/media/svg/icons/Text/Paragraph.svg")}
                    ></SVG>
                  </span>
                </span>
              </div>
              <div className="d-flex flex-column font-weight-bold">
                <NavLink className="menu-link" to="/tokenizer">
                  <span className="text-dark text-hover-primary mb-1 font-size-lg">Tokenization</span>
                </NavLink>
                <span>identify word boundaries and divide inputs into a meaningful unit as a word.</span>
              </div>
            </div>

            <div className="d-flex align-items-center mb-10">
              <div className="symbol symbol-40 symbol-light-primary mr-5">
                <span className="symbol-label">
                  <span className="svg-icon svg-icon-lg svg-icon-primary">
                    <SVG
                      className="h-75 align-self-end"
                      src={toAbsoluteUrl("/media/svg/icons/Files/Selected-file.svg")}
                    ></SVG>
                  </span>
                </span>
              </div>
              <div className="d-flex flex-column font-weight-bold">
                <NavLink className="menu-link" to="/word-embedder">
                  <span className="text-dark text-hover-primary mb-1 font-size-lg">Word Embedding</span>
                </NavLink>
                <span>create a word representation that allows words with similar meaning to have a similar representation.</span>
              </div>
            </div>

            <div className="d-flex align-items-center mb-10">
              <div className="symbol symbol-40 symbol-light-primary mr-5">
                <span className="symbol-label">
                  <span className="svg-icon svg-icon-lg svg-icon-primary">
                    <SVG
                      className="h-75 align-self-end"
                      src={toAbsoluteUrl("/media/svg/icons/Design/Select.svg")}
                    ></SVG>
                  </span>
                </span>
              </div>
              <div className="d-flex flex-column font-weight-bold">
                <NavLink className="menu-link" to="/ner">
                  <span className="text-dark text-hover-primary mb-1 font-size-lg">Named Entity Recognition</span>
                </NavLink>
                <span>extract information that seeks to locate and classify elements in text into pre-defined categories.</span>
              </div>
            </div>

            <div className="d-flex align-items-center mb-10">
              <div className="symbol symbol-40 symbol-light-primary mr-5">
                <span className="symbol-label">
                  <span className="svg-icon svg-icon-lg svg-icon-primary">
                    <SVG
                      className="h-75 align-self-end"
                      src={toAbsoluteUrl("/media/svg/icons/Design/Difference.svg")}
                    ></SVG>
                  </span>
                </span>
              </div>
              <div className="d-flex flex-column font-weight-bold">
                <NavLink className="menu-link" to="#">
                  <span className="text-muted text-hover-primary mb-1 font-size-lg">Part of Speech Tagging (Pending)</span>
                </NavLink>
                <span className="text-muted">mark up a word as corresponding to a particular part of speech, based on its definition and context.</span>
              </div>
            </div>

            <div className="separator separator-dashed my-7" />

            <div className="d-flex align-items-center mb-10">
              <div className="symbol symbol-40 symbol-light-primary mr-5">
                <span className="symbol-label">
                  <span className="svg-icon svg-icon-lg svg-icon-primary">
                    <SVG
                      className="h-75 align-self-end"
                      src={toAbsoluteUrl("/media/svg/icons/Files/User-folder.svg")}
                    ></SVG>
                  </span>
                </span>
              </div>
              <div className="d-flex flex-column font-weight-bold">
                <NavLink className="menu-link" to="#">
                  <span className="text-muted text-hover-primary mb-1 font-size-lg">Sentiment Analysis (Pending)</span>
                </NavLink>
                <span className="text-muted">interpret and classify emotions (positive, negative, and neutral) of the given sentences, such as comments, email, or online reviews.</span>
              </div>
            </div>

            <div className="d-flex align-items-center mb-10">
              <div className="symbol symbol-40 symbol-light-primary mr-5">
                <span className="symbol-label">
                  <span className="svg-icon svg-icon-lg svg-icon-primary">
                    <SVG
                      className="h-75 align-self-end"
                      src={toAbsoluteUrl("/media/svg/icons/Design/Pen-tool-vector.svg")}
                    ></SVG>
                  </span>
                </span>
              </div>
              <div className="d-flex flex-column font-weight-bold">
                <NavLink className="menu-link" to="#">
                  <span className="text-muted text-hover-primary mb-1 font-size-lg">Multi-label Text Classification (Pending)</span>
                </NavLink>
                <span className="text-muted">assign pre-defined tags or categories to the sentences according to the contents, helping to automatically structure and analyse texts.</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};