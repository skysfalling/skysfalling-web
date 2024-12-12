// ============================== [[ USER TYPES ]] ==============================
export interface IUser {
  id: number;
  email: string;
  name: string;
}

// ============================== [[ API TYPES ]] ==============================

/** The response from the API 
 * 
 * @param RequestData - The request that was made
 * @param ResponseData - The data returned from the request
 * @property {boolean} success - Whether the request was successful
 * @property {string} message - A message to the user
 * @property {string} error - An error message
*/
interface IApiResponse {
  success: boolean;
  message: string;
  error?: unknown;
} 

// ============================== [[ AUTH TYPES ]] ==============================
export interface IAuthRequest {
  email: string;
  password: string;
}

export interface IAuthResponse extends IApiResponse {
  user?: IUser;
  accessToken?: string;
}

// ============================== [[ REGISTER TYPES ]] ==============================
export interface IRegisterRequest extends IAuthRequest {
  name: string;
}

export interface IRegisterResponse extends IApiResponse {
  user?: IUser;
  accessToken?: string;
}

// ============================== [[ USER REQUEST TYPES ]] ==============================
export interface IUserRequest {
  id?: number;
  email?: string;
  name?: string;
}

export interface IUserResponse extends IApiResponse {
  user?: IUser;
}


