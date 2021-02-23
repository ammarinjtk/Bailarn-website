import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";

import { HomePage } from "./pages/HomePage";
import { TokenizerPage } from "./pages/TokenizerPage";
import { WordEmbedderPage } from "./pages/WordEmbedderPage";
import { NERPage } from "./pages/NerPage";

export default function BasePage() {
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /home. */
          <Redirect exact from="/" to="/home" />
        }
        <ContentRoute path="/home" component={HomePage} />
        <ContentRoute path="/tokenizer" component={TokenizerPage} />
        <ContentRoute path="/word-embedder" component={WordEmbedderPage} />
        <ContentRoute path="/ner" component={NERPage} />
        <Redirect to="/error" />
      </Switch>
    </Suspense>
  );
}
