const ApiError = require("../utils/api-error");

// Not Found
const notFound = (req, res, next) => {
    const error = new ApiError(404, `Not Found: ${req.originalUrl}`);
    next(error);
};

// Error Handler
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err?.message,
        stack: err?.stack,
    });
};

module.exports = { notFound, errorHandler };
