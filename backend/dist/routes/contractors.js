"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Contractor_1 = require("../models/Contractor");
const router = express_1.default.Router();
router.get('/', async (_req, res) => {
    try {
        const contractors = await Contractor_1.Contractor.find();
        res.json(contractors);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching contractors' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const contractor = await Contractor_1.Contractor.findById(req.params.id);
        if (!contractor) {
            return res.status(404).json({ message: 'Contractor not found' });
        }
        res.json(contractor);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching contractor' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const contractor = await Contractor_1.Contractor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!contractor) {
            return res.status(404).json({ message: 'Contractor not found' });
        }
        res.json(contractor);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating contractor profile' });
    }
});
exports.default = router;
//# sourceMappingURL=contractors.js.map