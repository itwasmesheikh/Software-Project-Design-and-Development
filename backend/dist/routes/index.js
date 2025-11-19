"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const contractor_routes_1 = __importDefault(require("./contractor.routes"));
const service_routes_1 = __importDefault(require("./service.routes"));
const booking_routes_1 = __importDefault(require("./booking.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/users', user_routes_1.default);
router.use('/contractors', contractor_routes_1.default);
router.use('/services', service_routes_1.default);
router.use('/bookings', booking_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map