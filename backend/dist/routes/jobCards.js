"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JobCard_1 = require("../models/JobCard");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const { userId, role } = req.query;
        let query = {};
        if (role === 'client') {
            query = { clientId: userId };
        }
        else if (role === 'contractor') {
            query = { contractorId: userId };
        }
        const jobCards = await JobCard_1.JobCard.find(query);
        res.json(jobCards);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching job cards' });
    }
});
router.post('/', async (req, res) => {
    try {
        const jobCard = new JobCard_1.JobCard(req.body);
        await jobCard.save();
        res.status(201).json(jobCard);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating job card' });
    }
});
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const jobCard = await JobCard_1.JobCard.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!jobCard) {
            return res.status(404).json({ message: 'Job card not found' });
        }
        res.json(jobCard);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating job card status' });
    }
});
exports.default = router;
//# sourceMappingURL=jobCards.js.map