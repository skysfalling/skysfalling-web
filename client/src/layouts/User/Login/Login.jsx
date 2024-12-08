import React from "react";
import { Login as LoginForm } from "../../../components/Form";
import "./Login.styles.css";

const Login = () => {
    return (
        <section className="login-page">
            <h1>Login</h1>
            <LoginForm />
        </section>
    );
};

export default Login; 