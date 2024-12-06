import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <div className="nav-bar">
            <Link className="nav-button" to="/">Home</Link>
            <Link className="nav-button" to="/user">Users</Link>
            <Link className="nav-button" to="/game">Games</Link>
            <Link className="nav-button" to="/login">Login</Link>
        </div>
    );
};

export default Navbar; 