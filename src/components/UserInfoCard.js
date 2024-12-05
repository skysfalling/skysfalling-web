import React, { useState } from 'react';
import User from '../models/User';
import AuthSignIn from './AuthSignIn';
import './UserInfoCard.css';

function UserInfoCard({ user, onUserUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');

    // Use actual user info or default values
    const displayInfo = user ? user.toJSON() : User.defaultInfo;

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedName(displayInfo.name);
    };

    const handleSave = () => {
        if (user) {
            user.updateName(editedName);
            onUserUpdate({ ...user }); // Trigger re-render with updated user
        }
        setIsEditing(false);
    };

    return (
        <div className="user-card-container">
            <div className="user-card-wrapper">
                <div className="user-info-card">
                    <div className="user-info-header">

                        {/* ======== USER AVATAR ======== */}
                        <div className="user-avatar">
                            <img
                                src={displayInfo.picture}
                                alt={displayInfo.name}
                                className="profile-picture"
                            />
                            {displayInfo.email_verified && (
                                <span className="verified-badge" title="Verified Account">✓</span>
                            )}
                        </div>

                        {/* ======== USER DETAILS ======== */}
                        <div className="user-details">
                            {isEditing ? (
                                <div className="edit-name-container">
                                    <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        className="name-input"
                                        autoFocus
                                    />
                                    <div className="edit-buttons">
                                        <button onClick={handleSave} className="save-button">Save</button>
                                        <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="name-container">
                                    <h2>{displayInfo.name}</h2>
                                    {user && !user.picture && (
                                        <button onClick={handleEditClick} className="edit-button">Edit</button>
                                    )}
                                </div>
                            )}
                            <p className="user-email">{displayInfo.email}</p>
                        </div>
                    </div>

                    {/* ======== SIGN IN PROMPT ======== */}
                    {!user && (
                        <div className="sign-in-prompt">
                            <p>Sign in to access all features</p>
                            <AuthSignIn />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserInfoCard;