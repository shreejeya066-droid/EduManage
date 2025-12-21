import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../components/layout/MainLayout';
import { Login } from '../pages/auth/Login';
import { ForgotPassword } from '../pages/auth/ForgotPassword';

import { ChangePassword } from '../pages/auth/ChangePassword';

// Student Component
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { StudentProfile } from '../pages/student/StudentProfile';
import { WizardContainer } from '../pages/student/ProfileWizard/WizardContainer';

// Teacher Components
import { TeacherDashboard } from '../pages/teacher/TeacherDashboard';
import { StudentList } from '../pages/teacher/StudentList';
import { Analytics } from '../pages/teacher/Analytics';
import { QueryInput } from '../pages/teacher/QueryInput';

// Admin Components
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import { AdminForgotPassword } from '../pages/admin/AdminForgotPassword';
import { AdminOTPVerification } from '../pages/admin/AdminOTPVerification';
import { AdminResetPassword } from '../pages/admin/AdminResetPassword';
import { AdminProtectedRoute } from './AdminProtectedRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { StudentManagement } from '../pages/admin/StudentManagement';
import { TeacherManagement } from '../pages/admin/TeacherManagement';
import { Home } from '../pages/Home';
import { AcademicSetup } from '../pages/admin/AcademicSetup';
import { SecurityAccess } from '../pages/admin/SecurityAccess';
import { AdminProfile } from '../pages/admin/AdminProfile';
import { AdminLayout } from '../components/layout/AdminLayout';

export const AppRouter = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Admin Authentication Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
            <Route path="/admin/verify-otp" element={<AdminOTPVerification />} />
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />

            <Route path="/change-password" element={<ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}><ChangePassword /></ProtectedRoute>} />

            {/* Admin Protected Routes */}
            <Route element={<AdminProtectedRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/students" element={<StudentManagement />} />
                    <Route path="/admin/teachers" element={<TeacherManagement />} />
                    <Route path="/admin/academic" element={<AcademicSetup />} />
                    <Route path="/admin/security" element={<SecurityAccess />} />
                    <Route path="/admin/profile" element={<AdminProfile />} />
                </Route>
            </Route>

            {/* Student & Teacher Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student', 'teacher']}><MainLayout /></ProtectedRoute>}>
                {/* Student Routes */}
                <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
                <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />
                <Route path="/student/profile-wizard" element={<ProtectedRoute allowedRoles={['student']}><WizardContainer /></ProtectedRoute>} />

                {/* Teacher Routes */}
                <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
                <Route path="/teacher/students" element={<ProtectedRoute allowedRoles={['teacher']}><StudentList /></ProtectedRoute>} />
                <Route path="/teacher/analytics" element={<ProtectedRoute allowedRoles={['teacher']}><Analytics /></ProtectedRoute>} />
                <Route path="/teacher/query" element={<ProtectedRoute allowedRoles={['teacher']}><QueryInput /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    );
};
