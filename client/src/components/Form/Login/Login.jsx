import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

import { Connection } from "../../../Settings";

import "./Login.styles.css";

const USER_DATABASE_URL = `${Connection.serverUrl}/auth/login`;

function Login({ onSuccess }) {
  const [loginSuccess, setLoginSuccess] = React.useState(null);
  const [loginError, setLoginError] = React.useState(null);

  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    setLoginSuccess(null);
    setLoginError(null);

    let msg = "LOGIN : ";

    try {
      const response = await axios.post(USER_DATABASE_URL, values);

      if (response.data.error) {
        setLoginError(response.data.error);
      } else {
        msg += "SUCCESS\n\t" + response.data.message + "\n";
        console.log(msg, response.data);

        setLoginSuccess(true);

        // Save access token to local storage
        sessionStorage.setItem("accessToken", response.data.accessToken);

        // Redirect to profile page
        navigate("/profile");

        // Call the onSuccess callback function
        onSuccess();
      }
    } catch (error) {
      msg += "ERROR\n\t" + error + "\n";

      // Handle different types of errors
      if (error.response) {
        // Server responded with an error status
        if (error.response.data.error) {
          msg += "\tData error : " + error.response.data.error;
        } else {
          msg += "\tLogin failed.";
        }
      } else if (error.request) {
        // Request was made but no response received
        msg += "\tNo response from server. Please try again.";
      } else {
        // Something else went wrong
        msg += "\tAn error occurred. Please try again.";
      }

      setLoginSuccess(false);
      setLoginError(true);
      console.error(msg, values);
    }
  };

  return (
    <div className="form">
      <h2>Login</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* (( EMAIL FIELD )) -------- >> */}
            <div className="form-group">
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="form-input"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="error-message"
              />
            </div>

            {/* (( PASSWORD FIELD )) -------- >> */}
            <div className="form-group">
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="form-input"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="error-message"
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>

      {/* (( STATUS MESSAGE )) -------- >> */}
      <div className="submit-result">
        {loginError && (
          <div className="submit-result-error">
            Login failed. Please try again.
          </div>
        )}
        {loginSuccess && (
          <div className="submit-result-success">
            Login successful. Welcome back!
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
