// ============================== [[ USER TYPES ]] ==============================
/**
 * The base user data type
 * @property {number} id - The ID of the user
 * @property {string} email - The email of the user
 * @property {string} name - The name of the user
 */
export interface IUser {
  id: number;
  email: string;
  name: string;  
  role?: 'user' | 'admin' | 'moderator';
  status?: 'active' | 'banned';
  createdAt?: string;
  updatedAt?: string;
}

// ============================== [[ API TYPES ]] ==============================

/** 
 * The response from the API 
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
/**
 * Request to authenticate a user
 * @property {string} email - The email of the user
 * @property {string} password - The password of the user
 */
export interface IAuthRequest {
  email: string;
  password: string;
}

/**
 * Response from the API for an auth request
 * @property {boolean} success - Whether the request was successful
 * @property {string} message - A message to the user
 * @property {IUser} user - The user that was fetched
 * @property {string} accessToken - The access token for the user
 */
export interface IAuthResponse extends IApiResponse {
  user?: IUser;
  accessToken?: string;
}

// ============================== [[ REGISTER TYPES ]] ==============================
/**
 * Request to register a user
 * @property {string} email - The email of the user
 * @property {string} password - The password of the user
 * @property {string} name - The name of the user
 */
export interface IRegisterRequest extends IAuthRequest {
  name: string;
}

/**
 * Response from the API for a register request
 * @property {boolean} success - Whether the request was successful
 * @property {string} message - A message to the user
 * @property {IUser} user - The user that was created
 * @property {string} accessToken - The access token for the user
*/
export interface IRegisterResponse extends IApiResponse {
  user?: IUser;
}

// ============================== [[ USER TYPES ]] ==============================
/**
 * Request to get a user from the API
 * @property {number} id - The ID of the user
 * @property {string} email - The email of the user
 * @property {string} name - The name of the user
*/
export interface IUserRequest {
  id?: number;
  email?: string;
  name?: string;
}

/** The response from the API for a user 
 * @property {boolean} success - Whether the request was successful
 * @property {string} message - A message to the user
 * @property {IUser} user - The user that was fetched
*/
export interface IUserResponse extends IApiResponse {
  user?: IUser;
}


