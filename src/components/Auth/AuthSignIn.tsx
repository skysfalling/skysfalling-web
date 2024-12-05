import React, { useState } from "react";
import {
  GoogleLogin,
  GoogleOAuthProvider,
  CredentialResponse,
} from "@react-oauth/google";
import UserModel from "../User/UserModel.ts";
import "./AuthSignIn.css";

interface AuthSignInProps {
  onSignIn: (user: UserModel) => void;
}

const googleClientId =
  "537411566483-gcsvpnd96ok17rn6h5vlvukk0cgjactb.apps.googleusercontent.com";

function AuthSignIn({ onSignIn }: AuthSignInProps) {
  const [isEmailFormVisible, setIsEmailFormVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const googleUser = UserModel.fromGoogleCredential(
        credentialResponse.credential
      );
      onSignIn(googleUser);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Basic password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const user = UserModel.fromEmailSignup({
        email,
        password,
      });
      onSignIn(user);
    } catch (err) {
      setError("Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="auth-signin-container">
      {isEmailFormVisible ? (
        <div className="email-form">
          <h2>{isSignUp ? "Create Account" : "Sign In"}</h2>
          <form onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="form-input"
                autoFocus
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="form-input"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="submit-button">
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
            <button
              type="button"
              className="toggle-button"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
            <button
              type="button"
              className="back-button"
              onClick={() => setIsEmailFormVisible(false)}
            >
              ← Back to sign in options
            </button>
          </form>
        </div>
      ) : (
        <div className="auth-signin-options">
          {/* ======== EMAIL AUTH ======== */}
          <button
            onClick={() => setIsEmailFormVisible(true)}
            className="email-auth-button"
          >
            Sign in with Email
          </button>

          {/* ======== GOOGLE AUTH ======== */}
          <GoogleOAuthProvider clientId={googleClientId}>
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
  );
}

export default AuthSignIn;
