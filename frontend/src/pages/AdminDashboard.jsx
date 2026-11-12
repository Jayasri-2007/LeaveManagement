
import React, { useState, useEffect } from "react";
import API from "../api";

function AdminDashboard() {
    const [leaves, setLeaves] = useState([]);
    const [message, setMessage] = useState("");
    const [filter, setFilter] = useState("All");

    const token = localStorage.getItem("token");

    const fetchLeaves = async () => {
        try {
            const response = await API.get("/leaves/all", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLeaves(response.data);
        } catch (error) {
            setMessage("Unable to fetch leave applications");
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleDecision = async (id, status) => {
        const adminRemark = prompt("Enter Admin Remark:");

        if (adminRemark === null) return;

        try {
            const response = await API.patch(
                `/leaves/${id}/decision`,
                { status, adminRemark },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(response.data.message);
            fetchLeaves();
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Action failed"
            );
        }
    };

    const filteredLeaves = filter === "All"
        ? leaves
        : leaves.filter((leave) => leave.status === filter);

    return (
        <div>
            <h2>Welcome, Admin!</h2>
            <h2>Admin Dashboard</h2>

            <p>{message}</p>

            <div style={{
                textAlign: "center",
                margin: "25px auto"
            }}>
                <label style={{
                    fontWeight: "bold",
                    color: "#512580"
                }}>
                    Filter Leave Status:
                </label>

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{
                        width: "180px",
                        marginLeft: "10px",
                        padding: "12px",
                        borderRadius: "8px"
                    }}
                >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            {filteredLeaves.length === 0 ? (
                <p>No leave applications found.</p>
            ) : (
                <div className="dashboard-container">
                    {filteredLeaves.map((leave) => (
                        <div className="dashboard-card" key={leave._id}>
                            <h3>{leave.employeeName}</h3>

                            <p>
                                <strong>Employee ID:</strong> {leave.employeeId}
                            </p>

                            <p>
                                <strong>Email:</strong> {leave.email}
                            </p>

                            <p>Leave Type: {leave.leaveType}</p>
                            <p>Total Days: {leave.totalDays}</p>

                            <p>
                                Start: {new Date(leave.startDate).toLocaleDateString()}
                            </p>

                            <p>
                                End: {new Date(leave.endDate).toLocaleDateString()}
                            </p>

                            <p>Reason: {leave.reason}</p>
                            <p>Status: {leave.status}</p>

                            {leave.status === "Pending" && (
                                <div>
                                    <button onClick={() => handleDecision(leave._id, "Approved")}>
                                        Approve
                                    </button>

                                    <button onClick={() => handleDecision(leave._id, "Rejected")}>
                                        Reject
                                    </button>
                                </div>
                            )}

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

export default AdminDashboard;
