import React, { useContext } from "react";
import { AuthContext, UserContext } from "../../context";
import { Login, Register, Logout } from "../../components/User";

function Profile() {
  const authContext = useContext(AuthContext);
  const userContext = useContext(UserContext);

  return (
    <div>
      <h1>Profile</h1>

      <p>AuthState : {authContext.authState ? "Logged In" : "Logged Out"}</p>
      <div>User Data : {userContext.userData ? (
        <div style={{marginLeft: "20px"}}>
          <p>Email : {userContext.userData.email}</p>
          <p>Name : {userContext.userData.name}</p>
          <p>Id : {userContext.userData.id}</p>
          <p>Image : {userContext.userData.image}</p>
        </div>
      ) : "No User Data"}</div>

      <div className="card-container">
        <Login />
      </div>
      <div className="card-container">
        <Register />
      </div>
      <div className="card-container">
        <Logout />
      </div>
    </div>
  );
}

export default Profile;
