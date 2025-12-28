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
    if (user.isFirstLogin) {
        // Teacher Flow: Change Password (handled externally or via flag?) -> Profile Setup
        if (user.role === 'teacher') {
            // If password is confirmed set (we can check a property if we added one to session, let's assume isFirstLogin is the main gate for Profile Setup now)
            // The setupPassword fn sets passwordSet: true but keeps isFirstLogin: true.
            // So if they are here, they need to complete profile.
            if (location.pathname !== '/teacher/profile-setup') {
                return <Navigate to="/teacher/profile-setup" replace />;
            }
        }
        // Student Flow (Legacy) or Admin
        else if (user.role === 'student' || user.role === 'admin') {
            if (location.pathname !== '/change-password') {
                return <Navigate to="/change-password" replace />;
            }
        }
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
