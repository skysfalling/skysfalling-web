import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useContext, useState } from 'react';
import { AuthService } from '../../../classes/AuthService';
import { AuthContext, UserContext } from '../../../context';
import { AuthResponse, AuthState } from '../../../interfaces/Auth';
import '../User.styles.css';

function Register() {
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const authContext = useContext(AuthContext);
  const userContext = useContext(UserContext);
  const service = new AuthService(authContext.setAuthState, userContext.setUserData);
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  };

  return (
    <div>
        <h2> Register</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={service.AuthRegistrationValidationSchema}
        onSubmit={async (request)=>{
          const response : AuthResponse = await service.Register(request);
          if (response.state === AuthState.LOGGED_IN) {
            setRegisterSuccess(true);
            setRegisterError(null);
          }
          else
          {
            setRegisterSuccess(false);
            setRegisterError(response.message);
          }
        }}
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