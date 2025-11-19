"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const services_1 = __importDefault(require("./routes/services"));
const contractors_1 = __importDefault(require("./routes/contractors"));
const jobCards_1 = __importDefault(require("./routes/jobCards"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/handygo';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
mongoose_1.default.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/jobs', jobs_1.default);
app.use('/api/services', services_1.default);
app.use('/api/contractors', contractors_1.default);
app.use('/api/job-cards', jobCards_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map