
const express = require("express");
const mongoose = require("mongoose");
const Leave = require("../models/Leave");
const User = require("../models/User");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// USER: APPLY FOR LEAVE
router.post("/apply", verifyToken, async (req, res) => {
    try {
        const {
            employeeName,
            employeeId,
            email,
            leaveType,
            startDate,
            endDate,
            reason
        } = req.body;

        if (
            !employeeName?.trim() ||
            !employeeId?.trim() ||
            !email?.trim() ||
            !leaveType ||
            !startDate ||
            !endDate ||
            !reason?.trim()
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (!["Casual Leave", "Medical Leave"].includes(leaveType)) {
            return res.status(400).json({
                message: "Invalid leave type"
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                message: "Invalid date"
            });
        }

        if (end < start) {
            return res.status(400).json({
                message: "End date cannot be before start date"
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (start < today) {
            return res.status(400).json({
                message: "Past dates are not allowed"
            });
        }

        const totalDays = Math.floor(
            (
                Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) -
                Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
            ) / (1000 * 60 * 60 * 24)
        ) + 1;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const balanceField =
            leaveType === "Casual Leave"
                ? "casualLeaveBalance"
                : "medicalLeaveBalance";

        if (user[balanceField] < totalDays) {
            return res.status(400).json({
                message: `Insufficient ${leaveType} balance. Available: ${user[balanceField]} days`
            });
        }

        const leave = new Leave({
            userId: user._id,
            employeeName: employeeName.trim(),
            employeeId: employeeId.trim(),
            email: email.trim(),
            leaveType,
            startDate: start,
            endDate: end,
            totalDays,
            reason: reason.trim()
        });

        await leave.save();

        res.status(201).json({
            message: "Leave application submitted successfully",
            leave
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// USER: VIEW OWN LEAVE APPLICATIONS
router.get("/my-leaves", verifyToken, async (req, res) => {
    try {
        const leaves = await Leave.find({
            userId: req.user.id
        }).sort({ createdAt: -1 });

        res.json(leaves);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// USER: VIEW OWN LEAVE BALANCE
router.get("/balance", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select(
            "casualLeaveBalance medicalLeaveBalance"
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            casualLeaveBalance: user.casualLeaveBalance,
            medicalLeaveBalance: user.medicalLeaveBalance
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// ADMIN: VIEW ALL LEAVE APPLICATIONS
router.get("/all", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const leaves = await Leave.find().sort({ createdAt: -1 });
        res.json(leaves);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// ADMIN: APPROVE OR REJECT LEAVE
router.patch("/:id/decision", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { status, adminRemark } = req.body;

        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({
                message: "Status must be Approved or Rejected"
            });
        }

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid leave ID"
            });
        }

        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({
                message: "Leave application not found"
            });
        }

        if (leave.status !== "Pending") {
            return res.status(400).json({
                message: "This leave application has already been processed"
            });
        }

        if (status === "Approved") {
            const user = await User.findById(leave.userId);

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const balanceField =
                leave.leaveType === "Casual Leave"
                    ? "casualLeaveBalance"
                    : "medicalLeaveBalance";

            if (user[balanceField] < leave.totalDays) {
                return res.status(400).json({
                    message: "Insufficient leave balance"
                });
            }

            user[balanceField] -= leave.totalDays;
            await user.save();
        }

        leave.status = status;
        leave.adminRemark = adminRemark || "";

        await leave.save();

        res.json({
            message: `Leave ${status.toLowerCase()} successfully`,
            leave
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
