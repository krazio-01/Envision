import jwt from "jsonwebtoken";

const getDataFromToken = (request) => {
    try {
        const token = request.cookies.token;

        if (!token) {
            throw new Error("No token provided");
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        return decodedToken.userId;
    } catch (error) {
        throw new Error(`Failed to get data from token: ${error.message}`);
    }
};

export default getDataFromToken;