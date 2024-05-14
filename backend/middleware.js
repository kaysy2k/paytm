const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // if (!authHeader || !authHeader.startsWith('Bearer ')) { return res.status(403).json({}); }:

    // This line checks if the authHeader exists and if it starts with the string 'Bearer '.
    // If authHeader is falsy (null, undefined, empty string, etc.) or if it doesn't start with 'Bearer ', the condition becomes true.
    // If the condition is true, it means the request doesn't have a valid Authorization header in the format expected for JWT authentication.
    // In that case, it returns a 403 status code (Forbidden) with an empty JSON response.

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        }
        else {
            return res.status(403).json({});
        }

    } catch (err) {
        return res.status(403).json({});
    }
};

module.exports = {
    authMiddleware
}