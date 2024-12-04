import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import AccountInfo from './AccountInfo';

function AuthLoginButton() {
    const [credential, setCredential] = useState(null);

    return (
        <div className="auth-buttons-container">
            {!credential ? (
                <>
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            console.log(credentialResponse);
                            setCredential(credentialResponse.credential);
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />
                </>
            ) : (
                <AccountInfo credential={credential} />
            )}
        </div>
    );
}

export default AuthLoginButton;