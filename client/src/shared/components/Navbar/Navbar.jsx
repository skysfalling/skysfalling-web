import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import "./Navbar.styles.css";

const Navbar = () => {
  return (
    <nav className="nav-bar">
      <ThemeToggle />
      <Link className="nav-button" to="/">
        Home
      </Link>
      <Link className="nav-button" to="/user">
        Users
      </Link>
      <Link className="nav-button" to="/game">
        Games
      </Link>
      <Link className="nav-button" to="/login">
        Login
      </Link>
    </nav>
  );
};

export default Navbar;
