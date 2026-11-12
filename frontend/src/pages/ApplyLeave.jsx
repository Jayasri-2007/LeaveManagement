
import React, { useState } from "react";
import API from "../api";

function ApplyLeave() {
    const [employeeName, setEmployeeName] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [email, setEmail] = useState("");

    const [leaveType, setLeaveType] = useState("Casual Leave");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");
    const [message, setMessage] = useState("");

    const today = new Date().toISOString().split("T")[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (endDate < startDate) {
            setMessage("End Date cannot be before Start Date!");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await API.post(
                "/leaves/apply",
                {
                    employeeName,
                    employeeId,
                    email,
                    leaveType,
                    startDate,
                    endDate,
                    reason
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(response.data.message || "Leave applied successfully!");

            setEmployeeName("");
            setEmployeeId("");
            setEmail("");
            setStartDate("");
            setEndDate("");
            setReason("");

        } catch (error) {
            setMessage(
                error.response?.data?.message || "Leave application failed"
            );
        }
    };

    return (
        <div>
            <h2>Apply for Leave</h2>

            <form onSubmit={handleSubmit}>
                <label>Employee Name</label>
                <input
                    type="text"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    placeholder="Enter employee name"
                    required
                />

                <label>Employee ID</label>
                <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="Enter employee ID"
                    required
                />

                <label>Email ID</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email ID"
                    required
                />

                <label>Leave Type</label>
                <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                >
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Medical Leave">Medical Leave</option>
                </select>

                <label>Start Date</label>
                <input
                    type="date"
                    min={today}
                    value={startDate}
                    onChange={(e) => {
                        setStartDate(e.target.value);
                        if (endDate && e.target.value > endDate) {
                            setEndDate("");
                        }
                    }}
                    required
                />

                <label>End Date</label>
                <input
                    type="date"
                    min={startDate || today}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                />

                <label>Reason</label>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter leave reason"
                    required
                />

                <button type="submit">Submit Leave</button>
            </form>

            <p>{message}</p>
        </div>
    );
}

export default ApplyLeave;
