import React from "react";
import "./ProfileCard.css";
import { UserModel } from "../../classes/User";

// Separate component interfaces
interface ProfileCardProps {
  user: UserModel;
}

interface AvatarProps {
  image: any;
}

interface DetailsProps {
  name: string;
  email: string;
}

// Main component
export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="user-profile-card">
      <ProfileAvatar image={user.image} />
      <ProfileDetails name={user.name} email={user.email} />
    </div>
  );
}

// Sub-components
function ProfileAvatar({ image }: AvatarProps) {
  return (
    <div className="user-profile-avatar">
      <img src={image} alt="user avatar" />
    </div>
  );
}

function ProfileDetails({ name, email }: DetailsProps) {
  return (
    <div className="user-profile-details">
      <h2>{name || ""}</h2>
      <p>{email || ""}</p>
    </div>
  );
}

export default ProfileCard;
