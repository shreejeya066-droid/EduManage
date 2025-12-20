import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminProtectedRoute = () => {
    const { user } = useAuth();

    // Check if user is authenticated and has admin role
    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    if (user.role !== 'admin') {
        // Optionally redirect to a "Not Authorized" page or their respective dashboard
        if (user.role === 'student') return <Navigate to="/student/dashboard" replace />;
        if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
