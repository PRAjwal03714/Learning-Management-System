const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        console.log("🚫 No token provided");
        return res.status(401).json({ message: "Access denied, no token provided" });
    }

    try {
        const tokenParts = token.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            console.log("🚫 Invalid token format:", tokenParts);
            return res.status(400).json({ message: "Invalid token format" });
        }

        const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (err) {
        console.log("❌ Token verification failed:", err.message); // NEW LOG
        return res.status(400).json({ message: "Invalid token" });
    }
};

