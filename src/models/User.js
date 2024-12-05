import { jwtDecode } from 'jwt-decode';
import defaultAvatar from '../images/sligo_favicon.png';

class User {
    constructor({ name, email, picture = null, email_verified = false, password = null }) {
        this.name = name;
        this.email = email;
        this.picture = picture;
        this.email_verified = email_verified;
        this._password = password; // private field
    }

    // Getters
    get displayName() {
        return this.name || this.email.split('@')[0];
    }

    get profilePicture() {
        return this.picture;
    }

    // Methods
    updateName(newName) {
        this.name = newName;
    }

    verifyPassword(password) {
        return this._password === password;
    }

    // Convert to plain object (for display/storage)
    toJSON() {
        return {
            name: this.name,
            email: this.email,
            picture: this.picture,
            email_verified: this.email_verified
        };
    }

    // Static methods for creating users
    static fromGoogleCredential(credential) {
        const decoded = jwtDecode(credential);
        return new User({
            name: decoded.name,
            email: decoded.email,
            picture: decoded.picture,
            email_verified: decoded.email_verified
        });
    }

    static fromEmailSignup({ email, password, name = null }) {
        return new User({
            name: name || email.split('@')[0],
            email,
            password,
            email_verified: false
        });
    }

    static get defaultInfo() {
        return {
            name: 'Guest User',
            email: 'Not signed in',
            picture: defaultAvatar,
            email_verified: false
        };
    }

    static get isGuest() {
        return this.email === 'Not signed in';
    }

}

export default User;