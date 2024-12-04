import { jwtDecode } from 'jwt-decode';

function AccountInfo({ credential }) {
    if (!credential) return null;

    const userInfo = jwtDecode(credential);
    
    return (
        <div className="account-info">
            <div className="account-header">
                <img 
                    src={userInfo.picture} 
                    alt={userInfo.name} 
                    className="profile-picture"
                />
                <h2>{userInfo.name}</h2>
            </div>
            <div className="account-details">
                <p><strong>Email:</strong> {userInfo.email}</p>
                {userInfo.email_verified && (
                    <span className="verified-badge">✓ Verified</span>
                )}
            </div>
        </div>
    );
}

export default AccountInfo;