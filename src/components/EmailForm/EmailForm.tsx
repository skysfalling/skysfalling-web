import React, { useState } from "react";
import "./EmailForm.css";
import { UserModel } from "../../models/UserModel.tsx";

interface EmailFormProps {
  onSignIn: (user: UserModel) => void;
  onBack: () => void;
}

function EmailForm({ onSignIn, onBack }: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
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
      const user = UserModel.fromEmailSignup(email);
      onSignIn(user);
    } catch (err) {
      setError("Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="email-form">
      <h2>{isSignUp ? "Create Account" : "Sign In"}</h2>
      <form onSubmit={handleSubmit}>
        {/* ---- Email ---- */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="form-input"
          autoFocus
        />

        {/* ---- Password ---- */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="form-input"
        />

        {/* ---- Error Message ---- */}
        {error && <div className="error-message">{error}</div>}

        {/* ---- Submit Button ---- */}
        <button type="submit" className="submit-button">
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>

        {/* ---- Toggle Button ---- */}
        <button
          type="button"
          className="toggle-button"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </button>

        {/* ---- Back Button ---- */}
        <button type="button" className="back-button" onClick={onBack}>
          ← Back to sign in options
        </button>
      </form>
    </div>
  );
}

export default EmailForm;
