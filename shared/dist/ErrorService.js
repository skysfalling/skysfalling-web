"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.AuthenticationError = exports.NetworkError = void 0;
const axios_1 = __importDefault(require("axios"));
// Custom error types for different scenarios
class NetworkError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NetworkError';
    }
}
exports.NetworkError = NetworkError;
class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthenticationError';
    }
}
exports.AuthenticationError = AuthenticationError;
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
class ErrorService {
    /**
     * Handles API request errors with detailed error checking and logging
     * @param prefix - Prefix for error logging
     * @param error - The error object to handle
     * @throws Various error types based on the scenario
     */
    static HandleAPIRequestError(prefix, error) {
        var _a;
        // Handle Axios specific errors
        if (axios_1.default.isAxiosError(error)) {
            const axiosError = error;
            const statusCode = (_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.status;
            const errorMessage = axiosError.message || 'An error occurred';
            console.error(`${prefix} Axios Error [${statusCode}]: ${errorMessage}`, axiosError.response);
        }
    }
    /**
     * Handles validation errors for form submissions or data processing
     * @param errors - Object containing validation errors
     */
    static HandleValidationError(errors) {
        const errorMessages = Object.entries(errors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('; ');
        throw new ValidationError(`Validation failed: ${errorMessages}`);
    }
    /**
     * Handles rate limiting errors
     * @param retryAfter - Optional time (in seconds) to wait before retrying
     */
    static HandleRateLimitError(retryAfter) {
        const message = retryAfter
            ? `Rate limit exceeded. Please try again in ${retryAfter} seconds`
            : 'Rate limit exceeded. Please try again later';
        throw new Error(message);
    }
    /**
     * Handles authentication-related errors
     * @param type - Type of authentication error
     */
    static HandleAuthError(type) {
        switch (type) {
            case 'expired':
                throw new AuthenticationError('Authentication token has expired');
            case 'invalid':
                throw new AuthenticationError('Invalid authentication token');
            case 'missing':
                throw new AuthenticationError('Authentication token is missing');
        }
    }
    /**
     * Logs errors to an external service (implement as needed)
     * @param error - Error to log
     * @param context - Additional context information
     */
    static LogError(error, context) {
        // Implement error logging logic (e.g., to external service)
        console.error('Error:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            context,
            timestamp: new Date().toISOString()
        });
    }
}
exports.default = ErrorService;
