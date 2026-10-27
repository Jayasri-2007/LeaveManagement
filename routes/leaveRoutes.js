const express = require('express');
const router = express.Router();

const Leave = require('../models/Leave');

// Apply for leave
router.post('/', async (req, res) => {
    try {
        const { name, leaveType, startDate, endDate, reason } = req.body;

        if (!name || !leaveType || !startDate || !endDate || !reason) {
            return res.status(400).json({
                message: 'Please fill in all fields'
            });
        }

        if (new Date(endDate) < new Date(startDate)) {
            return res.status(400).json({
                message: 'End date cannot be before start date'
            });
        }

        const leave = new Leave({
            name,
            leaveType,
            startDate,
            endDate,
            reason
        });

        await leave.save();

        res.status(201).json({
            message: 'Leave application submitted successfully',
            leave
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// View all leave applications
router.get('/', async (req, res) => {
    try {
        const leaves = await Leave.find().sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Approve or reject a leave application
router.patch('/:id', async (req, res) => {
    try {
        const { status } = req.body;

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({
                message: 'Invalid leave status'
            });
        }

        const leave = await Leave.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!leave) {
            return res.status(404).json({
                message: 'Leave application not found'
            });
        }

        res.json({
            message: 'Leave status updated successfully',
            leave
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
