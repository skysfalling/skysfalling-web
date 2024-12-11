import React, { useState } from "react";
import {
  GoogleLogin,
  GoogleOAuthProvider,
  CredentialResponse,
} from "@react-oauth/google";
import UserModel from "../../classes/User";
import { Login } from "../User/Login";
import "./AuthSignIn.css";

interface AuthSignInProps {
  onSignIn: (user: UserModel) => void;
}

const GOOGLE_CLIENT_ID: string = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;
// ====================== << AUTH SIGN IN COMPONENT >> ======================
function AuthSignIn({ onSignIn }: AuthSignInProps) {
  const [isEmailFormVisible, setEmailFormVisible] = useState(false);

  // ----- Show Email Form Method -----
  const showEmailForm = () => setEmailFormVisible(true);
  const hideEmailForm = () => setEmailFormVisible(false);

  // ----- Email Sign In Method -----
  const handleEmailSignIn = (user: UserModel) => {
    hideEmailForm();
    onSignIn(user);
    AlertSignIn(user);
  };

  // ----- Google Sign In Method -----
  const handleGoogleSignIn = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const googleUser = UserModel.FromGoogleCredential(
        credentialResponse.credential
      );
      onSignIn(googleUser);
      AlertSignIn(googleUser);
    }
  };

  // ----- Render -----
  return (
    <div className="auth-signin-container">
      <div className={`auth-content ${isEmailFormVisible ? "show-form" : ""}`}>
        {isEmailFormVisible ? (
          
          <></>
          /*
          // ----- Email Form -----
          <Login
            onSignIn={handleEmailSignIn}
            onBack={hideEmailForm}
          />
          */
        ) : (
          <div className="auth-signin-options">
            {/* ----- Email Sign In Button ----- */}
            <EmailSignInButton
              onClick={() => {
                showEmailForm();
              }}
            />

            {/* ----- Google Sign In Button ----- */}
            <GoogleSignInButton
              onSuccess={handleGoogleSignIn}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function EmailSignInButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="auth-signin-button">
      Sign in with Email
    </button>
  );
}

function GoogleSignInButton({
  onSuccess,
  onError,
}: {
  onSuccess: (credentialResponse: CredentialResponse) => void;
  onError: () => void;
}) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLogin onSuccess={onSuccess} onError={onError} />
    </GoogleOAuthProvider>
  );
}

function AlertSignIn(user: UserModel) {
  alert("Signing in with: " + user.Print());
}

export default AuthSignIn;
