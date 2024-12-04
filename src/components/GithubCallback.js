import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const GithubCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleCallback = async () => {
            const searchParams = new URLSearchParams(location.search);
            const code = searchParams.get('code');

            if (code) {
                try {
                    // First, try to exchange the code for a token directly with GitHub
                    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
                        client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
                        client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
                        code: code
                    }, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });

                    if (tokenResponse.data.access_token) {
                        // Get user data from GitHub
                        const userResponse = await axios.get('https://api.github.com/user', {
                            headers: {
                                'Authorization': `Bearer ${tokenResponse.data.access_token}`,
                                'Accept': 'application/json'
                            }
                        });
                        
                        localStorage.setItem('github_token', tokenResponse.data.access_token);
                        localStorage.setItem('github_user', JSON.stringify(userResponse.data));
                        navigate('/');
                    } else {
                        console.error('Invalid token response:', tokenResponse.data);
                        navigate('/?error=invalid_token');
                    }
                } catch (error) {
                    console.error('GitHub auth error details:', {
                        message: error.message,
                        response: error.response,
                        config: error.config
                    });
                    navigate('/?error=github_auth_failed');
                }
            } else {
                console.error('No code parameter found in URL');
                navigate('/?error=no_code');
            }
        };

        handleCallback();
    }, [navigate, location]);

    return (
        <div className="auth-container">
            <div>Authenticating with GitHub...</div>
        </div>
    );
};

export default GithubCallback;