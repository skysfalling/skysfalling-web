import React from "react";
import UserModel from "./UserModel.ts";
import UserProfileHeader from "./UserProfileHeader.tsx";
import AuthSignIn from "../Auth/AuthSignIn.tsx";

import "./UserProfile.css";

interface UserProfileCardProps {
  user: UserModel | null;
}

function UserProfileCard({ user }: UserProfileCardProps) {
  const handleSignIn = (user: UserModel) => {
    console.log(user);
  };

  return (
    <div className="user-profile-card-container">
      <div className="user-profile-card">
        <UserProfileHeader user={user} />
        <AuthSignIn onSignIn={handleSignIn} />
      </div>
    </div>
  );
}

export default UserProfileCard;
