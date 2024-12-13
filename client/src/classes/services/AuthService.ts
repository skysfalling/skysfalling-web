import axios from "axios";
import * as Yup from "yup";
import { NetworkSettings, UserSettings } from "../../Settings";
import { IAuthRequest, IAuthResponse, IRegisterRequest, IRegisterResponse, IUser } from "@shared/types";
import UserService from "./UserService";
import StorageService from "./StorageService";
import { AuthContextValues } from "src/context";

const USER_DATABASE_URL = `${NetworkSettings.serverUrl}/users`;
const USER_CHECK_AUTH_URL = `${USER_DATABASE_URL}/auth`;
const USER_LOGIN_URL = `${USER_DATABASE_URL}/login`;
const USER_REGISTER_URL = `${USER_DATABASE_URL}/register`;

const CHECK_AUTH_PREFIX = "CheckAuth - ";
const LOGIN_PREFIX = "Login - ";
const LOGOUT_PREFIX = "Logout - ";
const REGISTER_PREFIX = "Register - ";


class AuthService {
  public static AuthLoginValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(UserSettings.password.minLength, `Password must be at least ${UserSettings.password.minLength} characters long`)
      .max(UserSettings.password.maxLength, `Password must be at most ${UserSettings.password.maxLength} characters long`)
      .required('Password is required'),
  });

  public static AuthRegistrationValidationSchema = Yup.object().shape({
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

  // #endregion

  /**
   * Check if User is Authenticated
   * @returns {Promise<IAuthResponse>} - Check Auth Response
   */
  static async CheckAuth(): Promise<IAuthResponse> {
    let response: IAuthResponse = {
      success: false,
      message: "",
      error: "",
      user: undefined,
      accessToken: "",
    };


    const token = StorageService.GetAccessToken();
    if (token) {
      const serverResponse : IAuthResponse = await axios.get(USER_CHECK_AUTH_URL, {
        headers: {
          accessToken: token
        },
      });

      if (!serverResponse.error && serverResponse.user) {
        response = {
          ...response,
          success: true,
          user: serverResponse.user,
          message: serverResponse.message,
        };
        return response;
      }
    }
    else
    {
      response = {
        ...response,
        message: "No access token found",
        error: "No access token found",
      };
    }

    return response;
  }

  /**
   * Send Login Request to Server
   * @param request {IAuthRequest} - Login Request
   * @param setAuthContext {Function(values: AuthContextValues)} - Function to set Auth Context
   * @returns {Promise<IAuthResponse>} - Login Response
   */
  static async Login(request: IAuthRequest, setAuthContext: (values: AuthContextValues) => void): Promise<IAuthResponse> {
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

      response = serverResponse.data;

      if (!response.error && response.user) {
        const userData: IUser | undefined = await UserService.GetUserByEmail(response.user.email);
        if (userData) {

          response = {
            success: true,
            user: userData,
            accessToken: serverResponse.data.accessToken,
            message: serverResponse.data.message
          };

          StorageService.SetAccessToken(response.accessToken);
          setAuthContext({ status: true, user: userData });

          console.log(`${LOGIN_PREFIX} Success : `, response);
          return response;
        }
      }
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`${LOGIN_PREFIX} Axios Error : `, error.response);
        response = {
          ...response,
          message: error.response?.data.message || "Login failed",
          error: error instanceof Error ? error.message : "Unknown Error",
        };
      }
      else if (error instanceof Error) {
        console.log(`${LOGIN_PREFIX} Error : `, error);
        response = {
          ...response,
          message: error.message,
          error: error.message,
        };
      }
      else {
        console.log(`${LOGIN_PREFIX} Unknown Error : `, error);
        response = {
          ...response,
          message: "Login failed",
          error: "Unknown Error",
        };
      }

      console.log(`${LOGIN_PREFIX} Response : `, response);
      return response;
    }

    // Return default response
    return response;
  }

  /**
   * Logout User
   * @returns {Promise<IAuthResponse>} - Logout Response
   */
  static async Logout(setAuthContext: (values: AuthContextValues) => void): Promise<IAuthResponse> {
    StorageService.RemoveAccessToken();
    setAuthContext({ status: false, user: undefined });

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

  /**
   * Send Register Request to Server
   * @param request {IRegisterRequest} - Register Request
   * @param setAuthContext {Function(values: AuthContextValues)} - Function to set Auth Context
   * @returns {Promise<IRegisterResponse>} - Register Response
   */
  static async Register(request: IRegisterRequest, setAuthContext: (values: AuthContextValues) => void): Promise<IRegisterResponse> {
    let response: IRegisterResponse = {
      success: false,
      user: undefined,
      message: "",
      error: "",
    };

    try {

      // << CHECK IF USER EXISTS >> ------------------------------
      const existingUser = await UserService.GetUserByEmail(request.email);
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
        const loginResponse: IAuthResponse = await AuthService.Login(request, setAuthContext);
        response = {
          ...response,
          success: loginResponse.success,
          user: loginResponse.user,
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

export default AuthService;