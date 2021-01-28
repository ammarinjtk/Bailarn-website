/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { Layout } from "../_metronic/layout";
import BasePage from "./BasePage";
import { Logout, AuthPage } from "./modules/Auth";
import ErrorPage from "./pages/ErrorPage";

export function Routes() {
  const { isAuthorized } = useSelector(
    ({ auth }) => ({
      isAuthorized:
        (auth.authToken != null) && (Date.now() < auth.tokenExpiredAt),
    }),
    shallowEqual
  );

  return (
    <Switch>
      {!isAuthorized ? (
        /*Render auth page when user at `/_auth` and not authorized.*/
        <Route>
          <AuthPage />
        </Route>
      ) : (
          /*Otherwise redirect to root page (`/`)*/
          <Redirect from="/_auth" to="/" />
        )}

      <Route path="/error" component={ErrorPage} />
      <Route path="/logout" component={Logout} />

      {!isAuthorized ? (
        /*Redirect to `/_auth` when user is not authorized*/
        <Redirect to="/_auth/login" />
      ) : (
          <Layout>
            <BasePage />
          </Layout>
        )}
    </Switch>
  );
}
