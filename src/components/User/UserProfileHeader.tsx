import React from "react";
import { UserProfileAvatar } from "./UserProfileAvatar.tsx";
import UserModel from "./UserModel.ts";
import "./UserProfile.css";

export interface UserProfileHeaderProps {
  user: UserModel | null;
}

function UserProfileHeader({ user }: UserProfileHeaderProps) {
  const info = user ? user.toJSON() : UserModel.guestInfo;

  return (
    <div className="user-profile-header">
      {/* User Avatar */}
      <UserProfileAvatar imgPath={info.img} verified={info.verified} />

      {/* Separator */}
      <div className="separator"></div>

      {/* User Details */}
      <div className="user-profile-details">
        <h2>{info.name || ""}</h2>
        <p>{info.email || ""}</p>
      </div>
    </div>
  );
}

export default UserProfileHeader;
