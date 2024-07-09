import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const protect = (req, res, next) => {
    let token = req.cookies.token;

    // Check if token is provided
    if (!token) return res.status(401).json({ message: "Unauthorized User" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized User" });
    }
};

export default protect;
