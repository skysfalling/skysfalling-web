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
    static LogAPIRequestError(prefix: string, error: any): void {
        // Handle Axios specific errors
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            const statusCode = axiosError.response?.status || 500;
            const errorMessage = axiosError.message || 'An error occurred';

            console.error(`${prefix} Axios Error : Status (${statusCode}): ${errorMessage}`, axiosError);
        }
        else if (error instanceof Error) {
            ErrorService.LogError(prefix, error);
        }
    }

    /**
     * Logs errors to an external service (implement as needed)
     * @param error - Error to log
     * @param context - Additional context information
     */
    static LogError(prefix: string, error: Error, context?: Record<string, any>): void {
        // Implement error logging logic (e.g., to external service)
        console.error(`${prefix} Error:`, {
            name: error.name,
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
}

export default ErrorService;
