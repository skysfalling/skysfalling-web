import React, { useState } from "react";
import {
  GoogleLogin,
  GoogleOAuthProvider,
  CredentialResponse,
} from "@react-oauth/google";
import UserModel from "../../models/UserModel.tsx";
import EmailForm from "../EmailForm/EmailForm.tsx";
import "./AuthSignIn.css";

interface AuthSignInProps {
  onSignIn: (user: UserModel) => void;
}

const GOOGLE_CLIENT_ID =
  "537411566483-gcsvpnd96ok17rn6h5vlvukk0cgjactb.apps.googleusercontent.com";

function AuthSignIn({ onSignIn }: AuthSignInProps) {
  const [isEmailFormVisible, setIsEmailFormVisible] = useState(false);

  const handleGoogleSignIn = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const googleUser = UserModel.fromGoogleCredential(
        credentialResponse.credential
      );
      onSignIn(googleUser);
    }
  };

  return (
    <div className="auth-signin-container">
      <div className={`auth-content ${isEmailFormVisible ? "show-form" : ""}`}>
        {isEmailFormVisible ? (
          <EmailForm
            onSignIn={onSignIn}
            onBack={() => setIsEmailFormVisible(false)}
          />
        ) : (
          <div className="auth-signin-options">
            <button
              onClick={() => setIsEmailFormVisible(true)}
              className="email-auth-button"
            >
              Sign in with Email
            </button>

            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleGoogleSignIn}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </GoogleOAuthProvider>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthSignIn;
