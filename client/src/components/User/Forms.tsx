import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./LoginForm.css";

interface LoginFormValues {
  email: string;
  password: string;
}



function LoginForm() {
  // (( Initial Form Values ))
  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  // (( Validation Schema ))
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
  });

  // (( On Form Submission ))
  const onSubmit = async (values: LoginFormValues) => {
    try {
      axios.get(process.env.REACT_APP_SERVER_URL + "/users").then((res) => {
        console.log(`Login Form Submitted ${res}`);
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="email-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* -------- (( Email Field )) -------- */}
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

            {/* -------- (( Password Field )) -------- */}
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

            {/* Login Button */}
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              Login
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

function SignUpForm() {

}

export { LoginForm, SignUpForm };
