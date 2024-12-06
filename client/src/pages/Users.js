import React, { useState, useEffect } from "react";
import axios from "axios";

const Users = () => {

    const [users, setUsers] = useState([]);
    useEffect(() => {
        axios.get(process.env.REACT_APP_SERVER_URL + "/users")
            .then(res => {
                setUsers(res.data);
            });
    }, []);

    return (
        <div>
            <h1>Users</h1>

            <div className="users-list">
                {users.map((value, key) => (
                    <div key={key}>{value.username}</div>
                ))}
            </div>
        </div>

    );
};

export default Users;