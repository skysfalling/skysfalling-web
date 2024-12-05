import { jwtDecode } from "jwt-decode";

import guestPicture from "../../images/sligo_favicon.png";
import { UserData, EmailSignupData } from "./UserData.ts";

const guestName = "Guest User";
const guestEmail = "guest@sligo.com";

class UserModel {
  private email: string;
  private verified: boolean;

  private name: string | undefined;
  private img: string | undefined;
  private password: string | undefined;

  constructor(data: UserData | null = null) {
    if (data) {
      this.email = data.email;
      this.verified = data.verified;
      this.name = data.name;
      this.img = data.img;
      this.password = data.password;
    } else {
      this.email = guestEmail;
      this.verified = false;
      this.name = guestName;
      this.img = guestPicture;
    }
  }

  get profilePicture(): string | undefined {
    return this.img;
  }

  get displayName(): string {
    return this.name || this.email.split("@")[0];
  }

  updateName(newName: string): void {
    this.name = newName;
  }

  verifyPassword(password: string): boolean {
    return this.password === password;
  }

  toJSON(): UserData {
    return {
      name: this.name,
      email: this.email,
      img: this.img,
      verified: this.verified,
    };
  }

  isGuest(): boolean {
    return this.email === guestEmail;
  }

  static fromGoogleCredential(credential: string): UserModel {
    const decoded = jwtDecode<UserData>(credential);
    return new UserModel({
      name: decoded.name,
      email: decoded.email,
      img: decoded.img || undefined,
      verified: decoded.verified || false,
    });
  }

  static fromEmailSignup({ email, password }: EmailSignupData): UserModel {
    return new UserModel({
      email,
      password,
      verified: false,
    });
  }

  static get guestInfo(): UserData {
    return {
      name: guestName,
      email: guestEmail,
      img: guestPicture,
      verified: false,
    };
  }

  get isVerified(): boolean {
    return this.verified;
  }
}

export default UserModel;
