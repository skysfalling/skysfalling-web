import React, { useContext } from "react";
import { Login, Register, Profile as ProfileCard, Logout } from "../../components/User";
import { AuthContext } from "../../context/AuthContext";

function Profile() {
  const { authState } = useContext(AuthContext);
  
  const email = "astro@mail.com"
  
  return (
    <>
      <h1>Profile</h1>


      <p>AuthState : {authState ? "Logged In" : "Logged Out"}</p>
      <ProfileCard email={email} />

      <Login/>
      <Register/>
      <Logout/>
    </>
  );
}

export default Profile;