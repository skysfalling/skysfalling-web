import React from "react";
import { UserData } from "../../models/UserModel.tsx";

import "./UserProfile.css";

function UserProfileCard({ user }: { user: UserData }) {
  return (
    <div className="user-profile-card">
      <UserProfileAvatar image={user.image} />
      <UserProfileDetails name={user.name} email={user.email} />
    </div>
  );
}

function UserProfileAvatar({ image }: { image: any }) {
  return (
    <div className="user-profile-avatar">
      <img src={image} alt="user avatar" />
    </div>
  );
}

function UserProfileDetails({ name, email }: { name: string; email: string }) {
  return (
    <div className="user-profile-details">
      <h2>{name || ""}</h2>
      <p>{email || ""}</p>
    </div>
  );
}

function UserProfileSignInButton() {
  return <button>Sign In</button>;
}

export default UserProfileCard;
