"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const appError_1 = require("../utils/appError");
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let status = 'error';
    let message = 'Something went wrong';
    if (err instanceof appError_1.AppError) {
        statusCode = err.statusCode;
        status = err.status;
        message = err.message;
    }
    else if (err.message) {
        message = err.message;
    }
    if (process.env.NODE_ENV === 'development') {
        res.status(statusCode).json({
            success: false,
            error: err,
            message: message,
            stack: err.stack,
        });
    }
    else {
        res.status(statusCode).json({
            success: false,
            message: message,
        });
    }
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.js.map