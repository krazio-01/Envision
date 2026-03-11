import jwt from 'jsonwebtoken';

const optionalAuth = (req, res, next) => {
    let token = req.cookies.token;

    if (!token) return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        next();
    }
};

export default optionalAuth;
