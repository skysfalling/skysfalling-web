import axios from "axios";
import * as Yup from "yup";
import { NetworkSettings, UserSettings } from "../Settings";
import { IAuthRequest, IAuthResponse, IRegisterRequest, IRegisterResponse, IUser } from "@shared/types";
import { AuthContextValues } from "../context/AuthContext";
import { UserService } from "./UserService";

const USER_DATABASE_URL = `${NetworkSettings.serverUrl}`;
const USER_CHECK_AUTH_URL = `${USER_DATABASE_URL}/users/auth`;
const USER_LOGIN_URL = `${USER_DATABASE_URL}/users/login`;
const USER_REGISTER_URL = `${USER_DATABASE_URL}/users/register`;
const USER_ACCESS_TOKEN_KEY = `${UserSettings.accessTokenKey}`;

const CHECK_AUTH_PREFIX = "CheckAuth - ";
const LOGIN_PREFIX = "Login - ";
const LOGOUT_PREFIX = "Logout - ";
const REGISTER_PREFIX = "Register - ";

interface AuthServiceInterface {
  AuthLoginValidationSchema: Yup.ObjectSchema<any>;
  AuthRegistrationValidationSchema: Yup.ObjectSchema<any>;
  CheckAuth: () => Promise<void>;
  Login: (values: IAuthRequest) => Promise<IAuthResponse>;
  Logout: () => Promise<IAuthResponse>;
  Register: (values: IRegisterRequest) => Promise<IRegisterResponse>;
}

export class AuthService implements AuthServiceInterface {
  private userService: UserService;
  private setAuthContext: (values: AuthContextValues) => void;

  constructor(setAuthContext: (values: AuthContextValues) => void) {
    this.setAuthContext = setAuthContext;
    this.userService = new UserService();
  }

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

  // #region ( HANDLE ACCESS TOKEN ) ------------------------------
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

  async CheckAuth(): Promise<void> {
    const token = this.getAccessToken();
    if (token) {
      const serverResponse = await axios.get(USER_CHECK_AUTH_URL, {
        headers: {
          accessToken: token
        },
      });

      const serverResponseData = serverResponse.data;
      if (!serverResponseData.error) {

        // Find email property in serverResponseData
        const userEmail = serverResponseData.data.email;
        if (userEmail) {
          const user : IUser | undefined = await this.userService.GetUserByEmail(userEmail);
          if (user)
          {
            console.log(`${CHECK_AUTH_PREFIX} User : `, user);
            this.setAuthContext({ status: true, user: user });
          }
        }

        return;
      }
    }

    this.setAuthContext({ status: false, user: undefined });
  }

  async Login(request: IAuthRequest): Promise<IAuthResponse> {
    let response: IAuthResponse = {
      success: false,
      message: "",
      error: "",
      user: undefined,
      accessToken: "",
    };

    try {
      const serverResponse = await axios.post(USER_LOGIN_URL, request);

      console.log(`${LOGIN_PREFIX} ServerResponse : `, serverResponse);

      if (!serverResponse.data.error && serverResponse.data.email) {
        const userData: IUser | undefined = await this.userService.GetUserByEmail(serverResponse.data.email);
        if (userData) {

          response = {
            success: true,
            user: userData,
            accessToken: serverResponse.data.accessToken,
            message: serverResponse.data.message
          };

          this.setAccessToken(response.accessToken);
          this.setAuthContext({ status: true, user: userData });

          console.log(`${LOGIN_PREFIX} Success : `, response);
          return response;
        }
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

      this.setAuthContext({ status: false, user: undefined });

      response = {
        ...response,
        message: message,
        error: error instanceof Error ? error.message : "Unknown Error",
      };

      console.log(`${LOGIN_PREFIX} Error : `, response);
      return response;
    }

    // Return default response
    return response;
  }

  async Logout(): Promise<IAuthResponse> {
    this.removeAccessToken();
    this.setAuthContext({ status: false, user: undefined });

    const result: IAuthResponse = {
      success: true,
      user: undefined,
      accessToken: "",
      message: "Logout Successful",
      error: "",
    };

    console.log(`${LOGOUT_PREFIX} Result : `, result);
    return result;
  }

  async Register(request: IRegisterRequest): Promise<IRegisterResponse> {
    let response: IRegisterResponse = {
      success: false,
      user: undefined,
      accessToken: "",
      message: "",
      error: "",
    };

    try {

      // << CHECK IF USER EXISTS >> ------------------------------
      const existingUser = await this.userService.GetUserByEmail(request.email);
      if (existingUser) {
        return {
          ...response,
          message: 'User with this email already exists',
          error: "Duplicate User",
        };
      }

      // << REGISTER USER >> ----------------------------------------
      const serverResponse = await axios.post(USER_REGISTER_URL, request);
      if (!serverResponse.data.error) {
        const loginResponse: IAuthResponse = await this.Login(request);
        response = {
          ...response,
          success: loginResponse.success,
          user: loginResponse.user,
          accessToken: loginResponse.accessToken,
          message: loginResponse.message,
          error: loginResponse.error,
        };
      }
    }
    catch (error) {
      let errorResponse: IRegisterResponse = {
        ...response,
        error: error instanceof Error ? error.message : "Unknown Error",
      }

      if (axios.isAxiosError(error)) {
        console.log(`${REGISTER_PREFIX} Error : `, error);

        // More detailed error handling
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          return {
            ...errorResponse,
            message: error.response.data.message || 'Registration failed',
          };
        } else if (error.request) {
          // The request was made but no response was received
          return {
            ...errorResponse,
            message: 'No response received from server',
          };
        } else {
          // Something happened in setting up the request that triggered an Error
          return {
            ...errorResponse,
            message: 'Error setting up registration request',
          };
        }
      }

      // Fallback for non-axios errors
      return {
        ...errorResponse,
        message: 'An unexpected error occurred during registration',
        error: error instanceof Error ? error.message : "Unknown Error",
      };
    }

    // Return default response
    return response;
  }
}