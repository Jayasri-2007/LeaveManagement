
import React, { useState, useEffect } from "react";
import API from "../api";

function UserDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [balance, setBalance] = useState({
        casualLeaveBalance: 12,
        medicalLeaveBalance: 10
    });

    const [leaves, setLeaves] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const balanceResponse = await API.get(
                    "/leaves/balance", config
                );

                const leavesResponse = await API.get(
                    "/leaves/my-leaves", config
                );

                setBalance(balanceResponse.data);
                setLeaves(leavesResponse.data);

            } catch (error) {
                console.log("Dashboard Error:", error);
            }
        };

        fetchData();
    }, []);

    const approved = leaves.filter(
        leave => leave.status === "Approved"
    ).length;

    const pending = leaves.filter(
        leave => leave.status === "Pending"
    ).length;

    const rejected = leaves.filter(
        leave => leave.status === "Rejected"
    ).length;

    return (
        <div>
            <h2>Welcome, {user?.name || "User"}!</h2>
            <h2>User Dashboard</h2>

            <div style={{ textAlign: "center", margin: "20px" }}>
                <button onClick={() => window.location.href = "/apply-leave"}>
                    Apply for Leave
                </button>
            </div>

            <div className="dashboard-container">

                <div className="dashboard-card">
                    <h3>Casual Leave Balance</h3>
                    <p>{balance.casualLeaveBalance} Days</p>
                </div>

                <div className="dashboard-card">
                    <h3>Medical Leave Balance</h3>
                    <p>{balance.medicalLeaveBalance} Days</p>
                </div>

                <div className="dashboard-card">
                    <h3>Total Leaves Applied</h3>
                    <p>{leaves.length}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Approved Leaves</h3>
                    <p>{approved}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Pending Leaves</h3>
                    <p>{pending}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Rejected Leaves</h3>
                    <p>{rejected}</p>
                </div>

            </div>
        </div>
    );
}

export default UserDashboard;
