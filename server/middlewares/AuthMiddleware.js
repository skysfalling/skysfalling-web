// Import the verify function from jsonwebtoken library to validate JWT tokens
const { verify } = require("jsonwebtoken");

// Middleware function to validate JWT tokens
// This will be used to protect routes that require authentication
const validateToken = (req, res, next) => {
    // Get the token from the request headers
    // The token should be sent in the Authorization header
    const token = req.header("accessToken");

    // If no token is present, return a 403 Forbidden error
    // This means the user is trying to access a protected route without being logged in
    if (!token) {
        return res.status(403).json({ error: "AuthMiddleware.js : User is not logged in" });
    }

    try {
        // Verify the token using the JWT_SECRET from environment variables
        // If the token is valid, this will decode it and return the payload
        // If the token is invalid or expired, this will throw an error
        const validToken = verify(token, process.env.JWT_SECRET);

        // Attach the decoded user information to the request object
        // This makes the user info available to subsequent middleware and route handlers
        req.user = validToken;

        // If the token is valid, call next() to continue to the next middleware/route handler
        if (validToken) {
            return next();
        }
    } catch (error) {
        // If token verification fails, return a 403 Forbidden error
        // This could happen if the token is invalid, expired, or tampered with
        return res.status(403).json({ error: error });
    }
}

module.exports = validateToken;