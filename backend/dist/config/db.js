"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/handygo';
const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose_1.default.connect(MONGODB_URI);
        const connection = mongoose_1.default.connection;
        connection.on('connected', () => {
            console.log('MongoDB Connected Successfully');
        });
        connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            throw err;
        });
        connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
        process.on('SIGINT', async () => {
            try {
                await connection.close();
                console.log('MongoDB connection closed through app termination');
                process.exit(0);
            }
            catch (err) {
                console.error('Error closing MongoDB connection:', err);
                process.exit(1);
            }
        });
    }
    catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map