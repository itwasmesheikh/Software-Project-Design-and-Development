"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Service_1 = require("../models/Service");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const services = await Service_1.Service.find();
        res.json(services);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching services' });
    }
});
router.get('/category/:category', async (req, res) => {
    try {
        const services = await Service_1.Service.find({ category: req.params.category });
        res.json(services);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching services' });
    }
});
router.post('/', async (req, res) => {
    try {
        const service = new Service_1.Service(req.body);
        await service.save();
        res.status(201).json(service);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating service' });
    }
});
exports.default = router;
//# sourceMappingURL=services.js.map