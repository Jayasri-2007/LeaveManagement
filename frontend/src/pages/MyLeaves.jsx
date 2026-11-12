
import React, { useState, useEffect } from "react";
import API from "../api";

function MyLeaves() {
    const [leaves, setLeaves] = useState([]);

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await API.get("/leaves/my-leaves", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setLeaves(response.data);
            } catch (error) {
                console.log("Error:", error);
            }
        };

        fetchLeaves();
    }, []);

    return (
        <div>
            <h2>My Leave Applications</h2>

            {leaves.length === 0 ? (
                <p>No leave applications found.</p>
            ) : (
                <div className="dashboard-container">
                    {leaves.map((leave) => (
                        <div className="dashboard-card" key={leave._id}>
                            <h3>{leave.leaveType}</h3>

                            <p>Total Days: {leave.totalDays}</p>

                            <p>
                                Start: {new Date(leave.startDate).toLocaleDateString()}
                            </p>

                            <p>
                                End: {new Date(leave.endDate).toLocaleDateString()}
                            </p>

                            <p>Reason: {leave.reason}</p>

                            <p>Status: {leave.status}</p>

                            {leave.adminRemark && (
                                <p>Admin Remark: {leave.adminRemark}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyLeaves;
