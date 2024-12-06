import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Users.styles.css";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Debug logging function
    const debug = (...args) => {
        if (process.env.REACT_APP_DEBUG === 'true') {
            console.log('[Users Debug]:', ...args);
        }
    };

    // Log all environment variables on component mount
    useEffect(() => {
        debug('Environment Variables:', {
            SERVER_URL: process.env.REACT_APP_SERVER_URL,
            ENV: process.env.REACT_APP_ENV,
            DEBUG: process.env.REACT_APP_DEBUG,
            NODE_ENV: process.env.NODE_ENV
        });
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(`${SERVER_URL}/users`);
                
                setUsers(response.data);
            } catch (err) {
                const errorMessage = err.message || 'Failed to fetch users';
                debug('Error:', errorMessage);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return (
            <section className="users-page">
                <h1>Users</h1>
                <div className="loading">Loading users...</div>
            </section>
        );
    }

    if (error && users.length === 0) {
        return (
            <section className="users-page">
                <h1>Users</h1>
                <div className="error">
                    <p>Error: {error}</p>
                    <div className="debug-info">
                        <p>Environment Information:</p>
                        <pre>
                            {JSON.stringify({
                                SERVER_URL: process.env.REACT_APP_SERVER_URL || 'Not set',
                                ENV: process.env.NODE_ENV,
                                DEBUG: process.env.REACT_APP_DEBUG || 'Not set'
                            }, null, 2)}
                        </pre>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="users-page">
            <h1>Users</h1>
            <div className="users-list">
                {users.map((user, index) => (
                    <div key={user.id || index} className="user-item">
                        {user.username}
                    </div>
                ))}
            </div>
            <div className="debug-panel">
                <small>Server URL: {process.env.REACT_APP_SERVER_URL}</small>
                <br />
                <small>Environment: {process.env.NODE_ENV}</small>
            </div>
        </section>
    );
};

export default Users;