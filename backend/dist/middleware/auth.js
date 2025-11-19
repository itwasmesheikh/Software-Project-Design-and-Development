"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const appError_1 = require("../utils/appError");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return next(new appError_1.AppError('No authorization header found', 401));
        }
        if (!authHeader.startsWith('Bearer ')) {
            return next(new appError_1.AppError('Invalid authorization format', 401));
        }
        const token = authHeader.replace('Bearer ', '');
        if (!process.env.JWT_SECRET) {
            return next(new appError_1.AppError('JWT secret is not configured', 500));
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return next(new appError_1.AppError('Token has expired', 401));
            }
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return next(new appError_1.AppError('Invalid token', 401));
            }
            throw error;
        }
        const user = await models_1.User.findById(decoded.id).select('+active');
        if (!user) {
            return next(new appError_1.AppError('User not found', 404));
        }
        if (!user.active) {
            return next(new appError_1.AppError('User account is deactivated', 401));
        }
        req.user = user;
        next();
    }
    catch (err) {
        next(new appError_1.AppError('Authentication failed', 401));
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        const authReq = req;
        if (!authReq.user || !roles.includes(authReq.user.role || '')) {
            return next(new appError_1.AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map