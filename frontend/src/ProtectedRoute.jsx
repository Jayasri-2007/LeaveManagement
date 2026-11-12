import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
        return <Navigate to="/" />;
    }

    if (adminOnly && user.role !== "admin") {
        return <Navigate to="/user-dashboard" />;
    }

    return children;
}

export default ProtectedRoute;