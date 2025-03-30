const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Access denied, no token provided" });
    }

    try {
        // Extract token after "Bearer "
        const tokenParts = token.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return res.status(400).json({ message: "Invalid token format" });
        }

        const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
        req.user = decoded;  // Attach user details to request
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid token" });
    }
};
