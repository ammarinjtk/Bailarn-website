import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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

  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    password: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const mockTokenId = (length) => {
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const initialValues = {
    email: "admin@demo.com",
    password: "demo",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: () => {
      enableLoading();
      const fullname = "Admin Demo";
      const email = "admin@demo.com";
      const imageUrl = "https://i.pinimg.com/originals/08/61/b7/0861b76ad6e3b156c2b9d61feb6af864.jpg";
      const tokenExpiredAt = Date.now() + (60 * 60 * 1000);
      const idToken = mockTokenId(30);

      console.log("Logging in using admin@demo.com: ", fullname, email, imageUrl, tokenExpiredAt, idToken);
      setTimeout(() => {
        props.googleLogin(fullname, email, imageUrl, idToken, tokenExpiredAt);
        disableLoading();
      }, 1000);
    },
  });

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
      <div className="text-center mb-10 mb-lg-10">
        <h3 className="font-size-h1">
          <FormattedMessage id="AUTH.LOGIN.TITLE" />
        </h3>
        <p className="text-muted font-weight-semi-bold">
          * This website is only the showcase of my graduation project. Any of your information will not be collected or stored.
        </p>
      </div>
      {/* end::Head */}

      {/*begin::Form*/}
      <form
        onSubmit={formik.handleSubmit}
        className="form fv-plugins-bootstrap fv-plugins-framework"
      >
        {formik.status ? (
          <div className="mb-10 alert alert-secondary">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        ) : (
            <div className="mb-10 alert alert-secondary">
              <div className="alert-text ">
                Use account <strong>admin@demo.com</strong> and password{" "}
                <strong>demo</strong> to continue.
            </div>
            </div>
          )}

        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Email"
            type="email"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "email"
            )}`}
            name="email"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.email}</div>
            </div>
          ) : null}
        </div>
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Password"
            type="password"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "password"
            )}`}
            name="password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.password}</div>
            </div>
          ) : null}
        </div>
        <div className="form-group d-flex flex-wrap justify-content-center align-items-center">
          <button
            id="kt_login_signin_submit"
            type="submit"
            disabled={formik.isSubmitting}
            className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
          >
            <span>Sign In</span>
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </button>
        </div>
      </form>
      <div className="separator separator-dashed my-7" />
      <div className="form-group d-flex flex-wrap justify-content-center align-items-center">
        <span>Or Sign In with Google Account</span>
        <GoogleLoginButton
          className={`btn btn-primary px-9 py-4 my-3`}
          style={{ background: "#333333", marginTop: 20 }}
          activeStyle={{ background: '#555555' }}
          onClick={callGoogleSignIn}
        />
      </div>
      {/*end::Form*/}
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(Login));
