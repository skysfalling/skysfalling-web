import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Login } from "../../../components/Form/Login";
import { User } from "../../../objects/Settings";

const tokenKey = User.accessTokenKey;


function Profile() {
  const navigate = useNavigate();
  const loginStatus = useRef(null);

  useEffect(() => {
    const accessToken = localStorage.getItem(tokenKey);
    if (accessToken) {
      console.log("Login : Access token found, redirecting to profile");
      loginStatus.current = "success";
      navigate("/profile");
    }
  }, [navigate]);

  const handleLoginSuccess = () => {
    loginStatus.current = "success";
  }

  const handleLoginError = () => {
    loginStatus.current = "error";
  }

  return (
    <>
      <h1>Profile</h1>
      
      {(loginStatus.current === "error" || loginStatus.current === null) && <Login onSuccess={handleLoginSuccess} onError={handleLoginError} />}
      
      <p>
        {loginStatus.current === "success" ? "Login successful" 
         : loginStatus.current === "error" ? "Login error"
         : loginStatus.current === null ? "Login status null"
         : ""}
      </p>
    </>
  );
}

export default Profile;