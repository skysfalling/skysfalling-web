import axios, { AxiosError } from "axios";

// Custom error types for different scenarios
export class NetworkError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NetworkError';
    }
}

export class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthenticationError';
    }
}

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

class ErrorService {
    /**
     * Handles API request errors with detailed error checking and logging
     * @param prefix - Prefix for error logging
     * @param error - The error object to handle
     * @throws Various error types based on the scenario
     */
    static HandleAPIRequestError(prefix: string, error: any): void {
        // Handle Axios specific errors
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            const statusCode = axiosError.response?.status;
            const errorMessage = axiosError.message || 'An error occurred';

            console.error(`${prefix} Axios Error [${statusCode}]: ${errorMessage}`, axiosError.response);
        }
    }

    /**
     * Handles validation errors for form submissions or data processing
     * @param errors - Object containing validation errors
     */
    static HandleValidationError(errors: Record<string, string[]>): void {
        const errorMessages = Object.entries(errors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('; ');
        throw new ValidationError(`Validation failed: ${errorMessages}`);
    }

    /**
     * Handles rate limiting errors
     * @param retryAfter - Optional time (in seconds) to wait before retrying
     */
    static HandleRateLimitError(retryAfter?: number): void {
        const message = retryAfter 
            ? `Rate limit exceeded. Please try again in ${retryAfter} seconds`
            : 'Rate limit exceeded. Please try again later';
        throw new Error(message);
    }

    /**
     * Handles authentication-related errors
     * @param type - Type of authentication error
     */
    static HandleAuthError(type: 'expired' | 'invalid' | 'missing'): void {
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
    static LogError(error: Error, context?: Record<string, any>): void {
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

export default ErrorService;
