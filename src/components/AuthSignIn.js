import { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import User from '../models/User';
import './AuthSignIn.css';

const googleClientId = process.env.GOOGLE_CLIENT_ID;

function AuthSignIn({ onSignIn }) {
    const [isEmailFormVisible, setIsEmailFormVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleSignIn = (credentialResponse) => {
        const googleUser = User.fromGoogleCredential(credentialResponse.credential);
        onSignIn(googleUser);
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Basic password validation
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            const user = User.fromEmailSignup({
                email,
                password
            });

            onSignIn(user);
        } catch (err) {
            setError('Failed to sign in. Please try again.');
        }
    };

    return (
        <div className="auth-signin-container">
            {isEmailFormVisible ? (
                <div className="email-form">
                    <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>
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
                            {isSignUp ? 'Sign Up' : 'Sign In'}
                        </button>
                        <button
                            type="button"
                            className="toggle-button"
                            onClick={() => setIsSignUp(!isSignUp)}
                        >
                            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
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
                <div className="auth-options">

                    {/* ======== EMAIL AUTH ======== */}
                    <button
                        className="email-auth-button"
                        onClick={() => setIsEmailFormVisible(true)}
                    >
                        Sign in with Email
                    </button>

                    {/* ======== DIVIDER ======== */}
                    <div className="divider">
                        <span>or</span>
                    </div>

                    {/* ======== GOOGLE AUTH ======== */}
                    <GoogleOAuthProvider clientId={googleClientId}>
                        <GoogleLogin
                            onSuccess={handleGoogleSignIn}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        />
                    </GoogleOAuthProvider>
                </div>
            )}
        </div>
    );
}

export default AuthSignIn; 