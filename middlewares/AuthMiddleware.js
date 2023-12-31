const jwt = require("jsonwebtoken");
const ApiError = require("../utils/api-error");
const User = require("../models/UserModel");

const handleForbidden = (res) => {
    return res.status(403).json({ message: "You are not alowed to do that" });
};

const authMiddleware = async (req, res, next) => {
    const authorToken = req.headers["authorization"];
    const token = authorToken.split(" ")[1];
    try {
        if (!token) {
            return res
                .status(401)
                .json({ message: "There is no token attached to header" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Token is invalid or expired");
    }
};

const isAdmin = async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
    if (adminUser.role !== "admin") {
        handleForbidden();
    } else {
        next();
    }
};
module.exports = { authMiddleware, isAdmin };
