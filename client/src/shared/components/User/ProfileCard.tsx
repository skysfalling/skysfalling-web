import React from "react";
import defaultAvatar from "../../assets/icons/user/default-user-0.svg";
import "./ProfileCard.css";

interface ProfileCardProps {
  email: string;
  name: string;
  image: string;
}

// ================ << MAIN COMPONENT >> ================
export function ProfileCard({ email, name, image }: ProfileCardProps) {
  // (( If No Image, Use Default )) -------- >>
  if (!image) {
    image = defaultAvatar;
  }

  // (( If No Name, Use Front of Email )) -------- >>
  if (!name) {
    name = email.split("@")[0];
  }
  name = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div className="user-profile-card">
      {/* -------- (( AVATAR )) -------- >> */}
      <div className="user-profile-avatar">
        <img src={image} alt="user avatar" />
      </div>
      {/* -------- (( DETAILS )) -------- >> */}
      <div className="user-profile-details">
        <h4>{name || ""}</h4>
        <p>{email || ""}</p>
      </div>
    </div>
  );
}
