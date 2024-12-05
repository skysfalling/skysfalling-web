import React, { useState, useEffect } from "react";
import axios from "axios";

const UserPage = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const res = await axios.get("http://localhost:8800/users");
                setUsers(res.data);
                console.log(res.data);
            } catch (err) {
                console.error(err);
            }
        }

        fetchAllUsers();
    }, []);

    return <div>
        {users.map((user) => (
            <div>
                <p>{user.id}</p>
                <p>{user.email}</p>
            </div>
        ))}
    </div>;
};

export default UserPage;