import { AuthRequest, AuthResponse, AuthState } from "../interfaces/Auth";
import { AuthContextProps, UserContextProps } from "../context";
import axios, { AxiosError } from "axios";
import * as Yup from "yup";
import { NetworkSettings, UserSettings } from "../Settings";
import { UserData } from "../interfaces";

const USER_DATABASE_URL = `${NetworkSettings.serverUrl}`;
const USER_CHECK_AUTH_URL = `${USER_DATABASE_URL}/users/auth`;
const USER_GET_BY_EMAIL_URL = `${USER_DATABASE_URL}/users/getByEmail`;
const USER_LOGIN_URL = `${USER_DATABASE_URL}/users/login`;
const USER_REGISTER_URL = `${USER_DATABASE_URL}/users/register`;
const USER_ACCESS_TOKEN_KEY = `${UserSettings.accessTokenKey}`;

interface AuthServiceInterface {
  Login: (values: AuthRequest) => Promise<AuthResponse>;
  Logout: () => Promise<AuthResponse>;
  Register: (values: AuthRequest) => Promise<AuthResponse>;
}

export class AuthService implements AuthServiceInterface {
  private setAuthState: (setTo: boolean) => void;
  private setUserData: (setTo: UserData | undefined) => void;

  AuthLoginValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(UserSettings.password.minLength, `Password must be at least ${UserSettings.password.minLength} characters long`)
      .max(UserSettings.password.maxLength, `Password must be at most ${UserSettings.password.maxLength} characters long`)
      .required('Password is required'),
  });

  AuthRegistrationValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(UserSettings.password.minLength, `Password must be at least ${UserSettings.password.minLength} characters long`)
      .max(UserSettings.password.maxLength, `Password must be at most ${UserSettings.password.maxLength} characters long`)
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'),], 'Passwords must match')
      .required('Confirm password is required'),
  });

  constructor(setAuthState: (setTo: boolean) => void, setUserData: (setTo: UserData | undefined) => void) {
    this.setAuthState = setAuthState;
    this.setUserData = setUserData;
  }

  private async getUserByEmail(email: string): Promise<UserData | undefined> {
    try {
      const result = await axios.get(USER_GET_BY_EMAIL_URL, {
        params: {
          email: email
        }
      });

      const userData: UserData =
      {
        id: result.data.id,
        email: result.data.email,
        name: result.data.name,
        image: result.data.image,
      }
      return userData;
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching user by email:", error.message);
      }
      return undefined; // Return null in case of an error
    }
  }

  // #region ---- ( HANDLE ACCESS TOKEN ) ----
  private getAccessToken(): string | undefined {
    const accessToken = localStorage.getItem(USER_ACCESS_TOKEN_KEY);
    if (accessToken) {
      return accessToken;
    }
    return undefined;
  }

  private setAccessToken(accessToken: string | undefined): void {
    if (accessToken) {
      localStorage.setItem(USER_ACCESS_TOKEN_KEY, accessToken);
    }
    else {
      console.error("Cannot set undefined access token");
    }
  }

  private removeAccessToken(): void {
    localStorage.removeItem(USER_ACCESS_TOKEN_KEY);
  }
  // #endregion

  async CheckAuth() {
    try {
      const response = await axios.get(USER_CHECK_AUTH_URL, {
        headers: {
          accessToken: this.getAccessToken() // Send the token in a header
        },
      });

      if (response.data.email) {
        const user: UserData | undefined = await this.getUserByEmail(response.data.email);
        if (user) {
          this.setUserData(user);
          this.setAuthState(true);
          console.log(`AuthService - Found User : ${user?.email}`, user);
        }
        else {
          console.log(`AuthService - No User Found : ${response.data.email}`);
        }
      }
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`AuthService - ChechAuth Error : ${error.message}`);
      }
    }
  }

  async Login(request: AuthRequest): Promise<AuthResponse> {
    let response: AuthResponse;
    try {
      response = await axios.post(USER_LOGIN_URL, request);
      if (!response.data.error && response.data.email) {
        this.setAccessToken(response.data.accessToken);
        this.setAuthState(true);
        const userData: UserData | undefined = await this.getUserByEmail(response.data.email);
        if (userData) {
          this.setUserData(userData);
          return {
            data: response.data,
            message: response.data.message,
            state: AuthState.LOGGED_IN,
            userData: userData,
          };
        }
        else {
          throw new Error("No user data found");
        }
      }
      else {
        throw new Error("No user data found");
      }
    }
    catch (error) {
      let message = "Login failed. ";
      if (axios.isAxiosError(error)) {
        // Handle different types of errors
        if (error.response?.data.error) {
          message += error.response?.data.error;
        } else if (error.request) {
          // Request was made but no response received
          message += "\tNo response from server. Please try again.";
        } else {
          // Something else went wrong
          message += "\tAn error occurred. Please try again.";
        }
      }
      else {
        message += "\tAn error occurred. Please try again.";
      }

      this.setAuthState(false);
      this.setUserData(undefined);

      console.log("AuthService - Login Error : ", message);

      return {
        data: null,
        message: message,
        error: error,
        state: AuthState.LOGGED_OUT,
      };
    }
  }

  async Logout(): Promise<AuthResponse> {
    this.removeAccessToken();
    this.setAuthState(false);
    this.setUserData(undefined);
    const result: AuthResponse = {
      data: null,
      message: "Logout successful",
      state: AuthState.LOGGED_OUT,
    };
    return result;
  }

  async Register(request: AuthRequest): Promise<AuthResponse> {
    let response: AuthResponse;
    try {
      response = await axios.post(USER_REGISTER_URL, request);
      if (!response.data.error) {
        console.log("AuthService - Register Result : ", response);
        response = await this.Login(request);
      }
      else{
        console.error("AuthService - Register Error : ", response.data.error);
        return {
          data: null,
          message: response.data.error,
          error: response.data.error,
          state: AuthState.LOGGED_OUT,
        };
      }
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`AuthService - Register Error "`, error);
      }
      return {
        data: null,
        message: "Registration failed",
        error: error,
        state: AuthState.LOGGED_OUT,
      };
    }

    return response;
  }
}