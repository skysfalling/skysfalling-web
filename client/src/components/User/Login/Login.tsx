import { ErrorMessage, Field, Form, Formik } from "formik";
import { useContext } from "react";
import { AuthContext, AuthRequest, AuthResult, AuthService, AuthStatus, AuthValidationSchema } from "../../../context/AuthContext";
import "../User.styles.css";

/**
 * Login component
 * @param {LoginProps} onSuccess - Callback function for successful login
 * @param {LoginProps} onError - Callback function for login error
 * @returns {JSX.Element} Login component
 */
export default function Login(){
  return (
    <div className="card-container">
      <h2>Login</h2>
      <LoginForm />

    </div>
  );
}

function LoginForm()
{
  const authContext = useContext(AuthContext);
  const initialValues : AuthRequest = {
    email: "astro@dummy.com",
    password: ""
  };

  const handleSubmit = async (request: AuthRequest) => {
    const service : AuthService = new AuthService(authContext.setAuthState);
    const result : AuthResult = await service.Login(request);
    if (result.status === AuthStatus.LOGGED_IN) {
      authContext.setAuthState(true);
      console.log("Login successful", result);
    }
    else
    {
      authContext.setAuthState(false);
      console.log("Login failed", result);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={AuthValidationSchema}
      onSubmit={handleSubmit}
    >
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
      >
        Login
      </button>

      <ErrorMessage
        name="submit-error"
        className="error-message"
      />
      </Form>
    </Formik>
  );
}