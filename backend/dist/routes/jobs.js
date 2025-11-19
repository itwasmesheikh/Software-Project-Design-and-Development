"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Job_1 = require("../models/Job");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const jobs = await Job_1.Job.find();
        res.json(jobs);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching jobs' });
    }
});
router.post('/', async (req, res) => {
    try {
        const job = new Job_1.Job(req.body);
        await job.save();
        res.status(201).json(job);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating job' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const job = await Job_1.Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching job' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const job = await Job_1.Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating job' });
    }
});
router.post('/:id/applications', async (req, res) => {
    try {
        const job = await Job_1.Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        job.applicants.push(req.body);
        await job.save();
        res.status(201).json(job);
    }
    catch (error) {
        res.status(500).json({ message: 'Error applying for job' });
    }
});
router.put('/:id/assign', async (req, res) => {
    try {
        const { contractorId } = req.body;
        const job = await Job_1.Job.findByIdAndUpdate(req.params.id, {
            assignedContractorId: contractorId,
            status: 'assigned'
        }, { new: true });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    }
    catch (error) {
        res.status(500).json({ message: 'Error assigning job' });
    }
});
exports.default = router;
//# sourceMappingURL=jobs.js.map