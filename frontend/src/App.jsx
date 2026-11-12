
import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useNavigate,
    useLocation
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import ApplyLeave from "./pages/ApplyLeave";
import MyLeaves from "./pages/MyLeaves";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return <button onClick={handleLogout}>Logout</button>;
}

function Layout() {
    const location = useLocation();

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    return (
        <div>
            <h1>Leave Management System</h1>

            <nav>
                {!user && (
                    <>
                        <Link to="/">Login</Link> |{" "}
                        <Link to="/register">Register</Link>
                    </>
                )}

                {user?.role === "user" && (
                    <>
                        <Link to="/user-dashboard">Dashboard</Link> |{" "}
                        <Link to="/apply-leave">Apply Leave</Link> |{" "}
                        <Link to="/my-leaves">My Leaves</Link> |{" "}
                        <LogoutButton />
                    </>
                )}

                {user?.role === "admin" && (
                    <>
                        <Link to="/admin-dashboard">Admin Dashboard</Link> |{" "}
                        <LogoutButton />
                    </>
                )}
            </nav>

            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/user-dashboard" element={
                    <ProtectedRoute>
                        <UserDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/apply-leave" element={
                    <ProtectedRoute>
                        <ApplyLeave />
                    </ProtectedRoute>
                } />

                <Route path="/my-leaves" element={
                    <ProtectedRoute>
                        <MyLeaves />
                    </ProtectedRoute>
                } />

                <Route path="/admin-dashboard" element={
                    <ProtectedRoute adminOnly>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
    );
}

export default App;
