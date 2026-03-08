import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    // 1. Get token from the authorization header
    let token = req.header("Authorization");

    // 2. Check if no token
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    // 3. Extract the Bearer token (if the header is "Bearer <token>")
    if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
    }

    // 4. Verify the token signature
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // The user object maps back to what we encoded { id: user._id }
        next(); // Proceed to the final controller logic
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

export default authMiddleware;