import React, { useState, useEffect } from 'react';
import githubLogo from '../images/github-mark-white.png';

const GithubLoginButton = () => {
    const [githubUser, setGithubUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('github_user');
        if (storedUser) {
            setGithubUser(JSON.parse(storedUser));
        }
    }, []);

    const GithubApp = {
        clientId: "d93290aebc3085d27fdf",
        loginUrl: "https://github.com/login/oauth/authorize",
        redirectUri: "http://localhost:3000/callback"
    }

    function handleLogin() {
        window.location.href = `${GithubApp.loginUrl}?client_id=${GithubApp.clientId}&redirect_uri=${encodeURIComponent(GithubApp.redirectUri)}&scopes=repo`;
    }

    const handleLogout = () => {
        localStorage.removeItem('github_token');
        localStorage.removeItem('github_user');
        setGithubUser(null);
    };

    return (
        <div className="auth-container">
            {!githubUser ? (
                <button
                    onClick={handleLogin}
                    className="github-auth-button"
                >
                    <img
                        src={githubLogo}
                        alt="GitHub Logo"
                        className="github-logo"
                    />
                    Sign in with GitHub
                </button>
            ) : (
                <div className="account-info">
                    <div className="account-header">
                        <img
                            src={githubUser.avatar_url}
                            alt={githubUser.name}
                            className="profile-picture"
                        />
                        <h2>{githubUser.name || githubUser.login}</h2>
                    </div>
                    <div className="account-details">
                        <p><strong>Login:</strong> {githubUser.login}</p>
                        {githubUser.email && (
                            <p><strong>Email:</strong> {githubUser.email}</p>
                        )}
                        <button onClick={handleLogout} className="github-auth-button">
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GithubLoginButton; 