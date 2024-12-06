import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Users.styles.css";

const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get(process.env.REACT_APP_SERVER_URL + "/users")
            .then(res => {
                setUsers(res.data);
            });
    }, []);

    return (
        <section className="users-page">
            <h1>Users</h1>
            <div className="users-list">
                {users.map((value, key) => (
                    <div key={key} className="user-item">{value.username}</div>
                ))}
            </div>
        </section>
    );
};

export default Users; 