import axios, { AxiosError } from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { Connection } from "../../../objects/Settings";

import "./Login.styles.css";

const USER_DATABASE_URL = `${Connection.serverUrl}/auth/login`;
const ACCESS_TOKEN_KEY = "accessToken";

type LoginProps = {
  onSuccess: () => void;
  onFail: () => void;
  onError: () => void;
};

interface LoginResponse {
  error?: string;
  message?: string;
  accessToken: string;
}

interface LoginValues {
  email: string;
  password: string;
}

interface ErrorResponse {
  error?: string;
  message?: string;
}

function Login({ onSuccess = () => {}, onError = () => {} }: LoginProps) {
  const [loginSuccess, setLoginSuccess] = useState<boolean | null>(null);
  const [loginError, setLoginError] = useState<boolean | null>(null);

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

  const onSubmit = async (values: any, { setSubmitting }: any) => {
    setLoginSuccess(null);
    setLoginError(null);

    let msg = "LOGIN : ";

    try {
      const response = await axios.post(USER_DATABASE_URL, values);
      if (!response.data.error) {
        msg += "SUCCESS\n\t" + response.data.message + "\n";
        console.log(msg, response.data);

        handleLoginSuccess(response.data);
      }
    } catch (error: unknown) {
      handleLoginError(error, values);
    }
  };

  const handleLoginSuccess = (data: LoginResponse) => {
    const msg = "LOGIN : SUCCESS\n\t" + data.message + "\n";
    console.log(msg, data);

    // Save access token to local storage
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    
    setLoginSuccess(true);
    onSuccess();

    // Redirect to profile page
    navigate("/profile");
  };

  const handleLoginError = (error: unknown, values: LoginValues) => {
    let msg = "ERROR\n\t";

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Handle different types of errors
      if (axiosError.response) {
        // Server responded with an error status
        if (axiosError.response.data.error) {
          msg += "\tData error: " + axiosError.response.data.error;
        } else {
          msg += "\tLogin failed.";
        }
      } else if (axiosError.request) {
        // Request was made but no response received
        msg += "\tNo response from server. Please try again.";
      } else {
        // Something else went wrong
        msg += "\tAn error occurred. Please try again.";
      }
    } else {
      msg += (error as Error).message || "An unexpected error occurred";
    }

    console.error(msg, values);
    setLoginError(true);
    onError();
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
