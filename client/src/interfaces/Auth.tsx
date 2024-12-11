import { UserData } from "./User";


/**
 * The authentication state
 */
export enum AuthState {
    /** The user is logged out */
    LOGGED_OUT = 0,
    /** The user is logged in */
    LOGGED_IN = 1
}

/**
 *  The values sent to the database server
 */
export interface AuthRequest {
    /** The requested email address */
    email: string;
    /** The requested password */
    password: string;
}

/**
 * Result of the database request
 */
export interface AuthResponse {
    /** The data returned from the server */
    data: any;
    /** The authentication state */
    state: AuthState;
    /** The result message */
    message: string;
    /** The error object */
    error?: AuthError | unknown;
    /** The user data */
    userData?: UserData;
}

/**
 * Error returned from the server
 */
interface AuthError {
    /** The error object */
    error: unknown;
    /** The error message */
    message: string;
    /** The error status */
    status: number;
}