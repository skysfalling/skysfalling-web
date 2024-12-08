import React, { useContext } from "react";
import { Login } from "../../../components/Form/Login";
import { AuthContext } from "../../../context/AuthContext";



function Profile() {
  const { authState } = useContext(AuthContext);


  return (
    <>
      <h1>Profile</h1>
      
      {(authState === false) && <Login/>}
      
      <p>
        {authState === true ? "Login successful" 
         : authState === false ? "Login error"
         : ""}
      </p>
    </>
  );
}

export default Profile;