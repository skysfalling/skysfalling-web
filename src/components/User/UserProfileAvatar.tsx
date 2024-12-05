import React from "react";
import "./UserProfile.css";

export interface UserProfileAvatarProps {
  imgPath: string | undefined;
  verified: boolean;
}

export function UserProfileAvatar({
  imgPath,
  verified,
}: UserProfileAvatarProps) {
  return (
    <div className="user-profile-avatar">
      <img src={imgPath} alt="user avatar" />
      {verified && <div className="verified-badge">Verified</div>}
    </div>
  );
}

export default UserProfileAvatar;
