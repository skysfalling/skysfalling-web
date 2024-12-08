import axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';

import { Connection, User } from '../../../objects/Settings';

import './Register.styles.css';

const USER_DATABASE_URL = `${Connection.serverUrl}/auth/register`;

function Register() {
  const [registerSuccess, setRegisterSuccess] = React.useState(null);
  const [registerError, setRegisterError] = React.useState(null);

  const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  let password_minLength = User.password.minLength;
  let password_maxLength = User.password.maxLength;

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(password_minLength, `Password must be at least ${password_minLength} characters long`)
      .max(password_maxLength, `Password must be at most ${password_maxLength} characters long`)
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    setRegisterSuccess(null);
    setRegisterError(null);

    let msg = "REGISTER : ";

    try {
      const response = await axios.post(USER_DATABASE_URL, values);

      if (response.data.error) {
        setRegisterError(response.data.error);
      } else {
        msg += "SUCCESS\n\t" + response.data.message + "\n";
        console.log(msg, response.data);

        setRegisterSuccess(true);
      }
    } catch (error) {
      msg += "ERROR\n\t" + error + "\n";

      // Handle different types of errors
      if (error.response) {
        // Server responded with an error status
        if (error.response.data.error) {
          msg += "\tData error : " + error.response.data.error;
          setRegisterError(error.response.data.error);
        } else {
          msg += "\tRegistration failed.";
          setRegisterError("Registration failed. Please try again.");
        }
      } else if (error.request) {
        // Request was made but no response received
        msg += "\tNo response from server. Please try again.";
        setRegisterError("No response from server. Please try again.");
      } else {
        // Something else went wrong
        msg += "\tAn error occurred. Please try again.";
        setRegisterError("An error occurred. Please try again.");
      }

      setRegisterSuccess(false);
      console.error(msg, values);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form">
        <h2> Register</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>

            {/* (( NAME FIELD )) -------- >> */}
            <div className="form-group">
              <Field
                type="text"
                name="name" 
                placeholder="Name"
                className="form-input"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="error-message"
              />
            </div>

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

            {/* (( CONFIRM PASSWORD FIELD )) -------- >> */}
            <div className="form-group">
              <Field
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="form-input"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="error-message"
              />
            </div>

            {registerError && (
              <div className="form-group">
                <div className="error-message">{registerError}</div>
              </div>
            )}

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>

            {/* (( STATUS MESSAGE )) -------- >> */}
            <div className="submit-result">
              {registerError && (
                <div className="submit-result-error">
                  {registerError}
                </div>
              )}
              {registerSuccess && (
                <div className="submit-result-success">
                  Registration successful! You can now login.
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register; 