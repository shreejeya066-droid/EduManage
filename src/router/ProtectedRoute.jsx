import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles, loginPath = '/login' }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // Optional: Render a spinner here
        return <div className="flex items-center justify-center min-h-screen text-indigo-600">Loading...</div>;
    }

    if (!user) {
        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    // First time login flow enforcement
    // If first login, ONLY allow change-password or profile-setup (if legacy)
    // New flow: login -> change-password -> profile-wizard
    if (user.isFirstLogin && location.pathname !== '/change-password') {
        return <Navigate to="/change-password" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their respective dashboard if they try to access unauthorized routes
        if (user.role === 'student') return <Navigate to="/student/dashboard" replace />;
        if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;

        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};
