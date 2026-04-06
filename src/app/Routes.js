/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React from "react";
// import { Redirect, Switch, Route } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
// import { shallowEqual, useSelector } from "react-redux";
import { Layout } from "../_metronic/layout";
import BasePage from "./BasePage";
// import { Logout, AuthPage } from "./modules/Auth";
import ErrorPage from "./pages/ErrorPage";

export function Routes() {
  // const { isAuthorized } = useSelector(
  //   ({ auth }) => ({
  //     isAuthorized:
  //       (auth.authToken != null) && (Date.now() < auth.tokenExpiredAt),
  //   }),
  //   shallowEqual
  // );

  return (
    <Switch>
      {/* Auth gate removed — app is publicly accessible */}
      {/*
      {!isAuthorized ? (
        <Route>
          <AuthPage />
        </Route>
      ) : (
          <Redirect from="/_auth" to="/" />
        )}
      */}

      <Route path="/error" component={ErrorPage} />
      {/* <Route path="/logout" component={Logout} /> */}

      {/* Auth redirect removed — render Layout+BasePage unconditionally */}
      {/*
      {!isAuthorized ? (
        <Redirect to="/_auth/login" />
      ) : (
          <Layout>
            <BasePage />
          </Layout>
        )}
      */}
      <Layout>
        <BasePage />
      </Layout>
    </Switch>
  );
}
