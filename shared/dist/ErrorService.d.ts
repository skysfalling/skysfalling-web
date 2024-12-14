export declare class NetworkError extends Error {
    constructor(message: string);
}
export declare class AuthenticationError extends Error {
    constructor(message: string);
}
export declare class ValidationError extends Error {
    constructor(message: string);
}
declare class ErrorService {
    /**
     * Handles API request errors with detailed error checking and logging
     * @param prefix - Prefix for error logging
     * @param error - The error object to handle
     * @throws Various error types based on the scenario
     */
    static HandleAPIRequestError(prefix: string, error: any): void;
    /**
     * Handles validation errors for form submissions or data processing
     * @param errors - Object containing validation errors
     */
    static HandleValidationError(errors: Record<string, string[]>): void;
    /**
     * Handles rate limiting errors
     * @param retryAfter - Optional time (in seconds) to wait before retrying
     */
    static HandleRateLimitError(retryAfter?: number): void;
    /**
     * Handles authentication-related errors
     * @param type - Type of authentication error
     */
    static HandleAuthError(type: 'expired' | 'invalid' | 'missing'): void;
    /**
     * Logs errors to an external service (implement as needed)
     * @param error - Error to log
     * @param context - Additional context information
     */
    static LogError(error: Error, context?: Record<string, any>): void;
}
export default ErrorService;
