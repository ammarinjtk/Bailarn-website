import React from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { GoogleLoginButton } from "react-social-login-buttons";

// Firebase App (the core Firebase SDK)
import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDtdlt6la21Lbdw2MQ2IgClynkygop-j9o",
  authDomain: "bailarn-202308.firebaseapp.com",
  databaseURL: "https://bailarn-202308.firebaseio.com",
  projectId: "bailarn-202308",
  storageBucket: "bailarn-202308.appspot.com",
  messagingSenderId: "694840718487",
  appId: "1:694840718487:web:652fbc5a7921ff08c8a5d2"
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
        <br />
        <p className="text-muted font-weight-semi-bold">
          * This website is only the showcase of my graduation project. Any of your information will not be collected or stored.
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
