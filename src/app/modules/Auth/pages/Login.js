import React from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { GoogleLoginButton } from "react-social-login-buttons";

// Firebase App (the core Firebase SDK)
import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA4GhpanhBHr2p8F4ZENpqPOwQRcy8L_VU",
  authDomain: "di-portal-kickstart.firebaseapp.com",
  databaseURL: "https://di-portal-kickstart.firebaseio.com",
  projectId: "di-portal-kickstart",
  storageBucket: "di-portal-kickstart.appspot.com",
  messagingSenderId: "37223840422",
  appId: "1:37223840422:web:d952ac72238d1ea8d35267",
  measurementId: "G-RGFP8WLWRC"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

/*
  INTL (i18n) docs:
  https://github.com/formatjs/react-intl/blob/master/docs/Components.md#formattedmessage
*/

function Login(props) {

  const callGoogleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
      // The signed-in user info.
      const fullname = result.user.displayName;
      const email = result.user.email;
      const imageUrl = result.user.photoURL;
      const tokenExpiredAt = Date.now() + (60 * 60 * 1000)

      console.log(result);
      result.user.getIdToken().then(idToken => {
        console.log(idToken)
        props.googleLogin(fullname, email, imageUrl, idToken, tokenExpiredAt);
      })

    }).catch(function (error) {
      console.error(error);
    });
  };

  return (
    <div className="login-form login-signin" id="kt_login_signin_form">
      {/* begin::Head */}
      <div className="text-center mb-10 mb-lg-20">
        <h3 className="font-size-h1">
          <FormattedMessage id="AUTH.LOGIN.TITLE" />
        </h3>
        <p className="text-muted font-weight-semi-bold">
          Connect with your google email to sign in.
        </p>
      </div>
      {/* end::Head */}

      {/*begin::Form*/}
      <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
        <GoogleLoginButton
          style={{ background: "#333333" }}
          activeStyle={{ background: '#555555' }}
          onClick={callGoogleSignIn}
        />
      </div>
      {/*end::Form*/}
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(Login));
