import { jwtDecode } from "jwt-decode";

// ================ << USER DATA INTERFACE >> ================
export interface UserData {
  get id(): number;
  get email(): string;
  get name(): string;
  get image(): any;
}

// ================ << DEFAULT USER DATA >> ================
const DEFAULT_USER: UserData = {
  id: -1,
  email: "default_sligo@darklight.studio",
  name: "Default Sligo",
  image: require("../images/sligo_favicon.png")
};

// ================ << USER CLASS >> ================
export class UserModel implements UserData {
  private _id: number = -1;
  private _email: string = DEFAULT_USER.email;
  private _name: string = DEFAULT_USER.name;
  private _image: any = DEFAULT_USER.image;

  // ================ << CONSTRUCTORS >> ================
  constructor(data: Partial<UserData>) {
    this._id = data.id ?? DEFAULT_USER.id;
    this._email = data.email ?? DEFAULT_USER.email;
    this._name = data.name ?? UserModel.ExtractNameFromEmail(this._email);
    this._image = data.image ?? DEFAULT_USER.image;
  }

  // ================ << GETTERS >> ================
  get id(): number {
    return this._id ?? DEFAULT_USER.id;
  }

  get email(): string {
    return this._email ?? DEFAULT_USER.email;
  }

  get image(): any {
    return this._image ?? (DEFAULT_USER.image as any);
  }

  get name(): string {
    return this._name ?? UserModel.ExtractNameFromEmail(this._email);
  }

  // ================ << METHODS >> ================
  IsValid(): boolean {
    return this._id !== -1;
  }

  Print(): string {
    return `UserModel: 
    \n\tID: ${this.id}
    \n\tEmail: ${this.email}
    \n\tName: ${this.name}
    \n\tImage: ${this.image}`;
  }

  // ================ << STATIC METHODS >> ================
  static Create(data: Partial<UserData>): UserModel {
    return new UserModel(data);
  }

  static ExtractNameFromEmail(email: string): string {
    return email.split("@")[0];
  }

  static FromGoogleCredential(credential: string): UserModel {
    const decoded = jwtDecode<{
      email?: string;
      name?: string;
      picture?: string;
    }>(credential);

    return UserModel.Create({
      email: decoded.email,
      name: decoded.name,
      image: decoded.picture,
    });
  }

  static FromEmailSignup(email: string): UserModel {
    return UserModel.Create({
      email,
    });
  }

  static DefaultUser(): UserModel {
    return UserModel.Create(DEFAULT_USER);
  }
}

export default UserModel;
