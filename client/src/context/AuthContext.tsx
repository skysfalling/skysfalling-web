import { createContext, useContext } from "react";
import axios, { AxiosError } from "axios";
import * as Yup from "yup";
import { NetworkSettings, UserSettings } from "../Settings";

const USER_DATABASE_URL = `${NetworkSettings.serverUrl}`;
const USER_LOGIN_URL = `${USER_DATABASE_URL}/auth/login`;
const USER_REGISTER_URL = `${USER_DATABASE_URL}/auth/register`;

const USER_ACCESS_TOKEN_KEY = `${UserSettings.accessTokenKey}`;

/**
 *  The values sent to the database server
 */
export interface AuthRequest {
  email: string;
  password: string;
}

/**
 * Result of the database request
 */
export interface AuthResult {
  data: any; // The data returned from the server
  message: string; // The result message
  status: AuthStatus; // The result status
  values?: AuthRequest; // 
  error?: AxiosError | unknown;
  accessToken?: string;
}

interface AuthError {
  error: string;
  details: string;
  status: number;
  data: any;
}

interface AuthServiceInterface {
  Login: (values: AuthRequest) => Promise<AuthResult>;
  Logout: () => Promise<AuthResult>;
}

//#region ================ AUTH STATUS ================

export enum AuthStatus {
  LOGGED_OUT = 0,
  LOGGED_IN = 1
}

/**
 * Get the authentication status
 * @returns {AuthStatus} The authentication status
 */
export function GetAuthStatus(): AuthStatus {
  return localStorage.getItem(USER_ACCESS_TOKEN_KEY) ? AuthStatus.LOGGED_IN : AuthStatus.LOGGED_OUT;
}

//#endregion

//#region ================ AUTH CONTEXT ================
interface AuthContextProps {
  authState: boolean;
  setAuthState: (setTo: boolean) => void;
}

/**
 * The context for the authentication state
 */
export const AuthContext = createContext<AuthContextProps>({
  authState: false,
  setAuthState: (setTo: boolean) => { },
});

//#endregion

//#region ================ AUTH VALIDATION SCHEMA ================

/**
 * Validation schema for the login form.
 * Used to make sure the user inputs valid data.
 */
export const AuthValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
});

//#endregion

export class AuthService implements AuthServiceInterface {
  private setAuthState: (setTo: boolean) => void;

  constructor(setAuthState: (setTo: boolean) => void) {
    this.setAuthState = setAuthState;
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

  async Login(request: AuthRequest): Promise<AuthResult> {
    let result: AuthResult;


    const handleSuccessResult = (result: any): AuthResult => {
      const data = result.data;

      this.setAccessToken(data.accessToken);
      this.setAuthState(true);

      return {
        data: data,
        message: data.message,
        status: AuthStatus.LOGGED_IN,
        values: data.values,
        error: data.error,
        accessToken: data.accessToken,
      };
    }

    const handleErrorResult = (request: AuthRequest, error: unknown): AuthResult => {
      let message = "Login failed. ";
      if (axios.isAxiosError(error)) {
        let axiosError = error as AxiosError<AuthError>;
        message += `Error: ${axiosError.response?.data?.error || axiosError.message}`;      
      }

      this.setAuthState(false);

      return {
        data: null,
        message: message,
        values: request,
        error: error,
        status: AuthStatus.LOGGED_OUT,
        accessToken: undefined,
      };
    }

    try {
      result = await axios.post(USER_LOGIN_URL, request);
      if (!result.error) {
        result = handleSuccessResult(result);
      }
    }
    catch (error) {
      result = handleErrorResult(request, error);
    }
    return result;
  }

  async Logout(): Promise<AuthResult> {
    this.removeAccessToken();
    this.setAuthState(false);
    const result: AuthResult = {
      data: null,
      message: "Logout successful",
      status: AuthStatus.LOGGED_OUT,
    };
    return result;
  }
}