import React, { useEffect, useContext } from "react";
import { Login } from "../../../components/Form/Login";
import { User } from "../../../objects/Settings";
import { AuthContext } from "../../../context/AuthContext";

const tokenKey = User.accessTokenKey;


function Profile() {
  const { authState, setAuthState } = useContext(AuthContext);

  useEffect(() => {
    const accessToken = localStorage.getItem(tokenKey);
    if (accessToken) {
      console.log("Login : Access token found, redirecting to profile");
      handleLoginSuccess();
    }
    else {
      handleLoginError();
    }
  });

  const handleLoginSuccess = () => {
    setAuthState(true);
  }

  const handleLoginError = () => {
    setAuthState(false);
  }

  return (
    <>
      <h1>Profile</h1>
      
      {(authState === false) && <Login onSuccess={handleLoginSuccess} onError={handleLoginError} />}
      
      <p>
        {authState === true ? "Login successful" 
         : authState === false ? "Login error"
         : ""}
      </p>
    </>
  );
}

export default Profile;