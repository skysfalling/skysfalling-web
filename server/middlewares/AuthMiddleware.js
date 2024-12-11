const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    // Get the token from the request headers
    const token = req.header("accessToken");

    if (!token) {
        return res.status(403).json({ error: "Access token is required" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid token" });
        }
        req.user = user; // Attach user info to the request
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = validateToken;