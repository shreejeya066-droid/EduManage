
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    GraduationCap
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui';

export const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-2xl">
                        <GraduationCap className="h-8 w-8" />
                        <span>EduManage</span>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Define navigation items based on role
    const navItems = [
        {
            label: 'Dashboard',
            path: `/${user?.role}/dashboard`,
            icon: LayoutDashboard,
            roles: ['student', 'teacher', 'admin']
        },
        {
            label: 'My Academics',
            path: '/student/academics',
            icon: BookOpen,
            roles: ['student']
        },
        {
            label: 'Students Directory',
            path: '/teacher/students',
            icon: Users,
            roles: ['teacher']
        },
        {
            label: 'Analytics',
            path: '/teacher/analytics',
            icon: BarChart3,
            roles: ['teacher']
        },
        {
            label: 'Manage Students',
            path: '/admin/students',
            icon: Users,
            roles: ['admin']
        },
        {
            label: 'Manage Teachers',
            path: '/admin/teachers',
            icon: GraduationCap,
            roles: ['admin']
        },
    ];

    const filteredNav = navItems.filter(item => item.roles.includes(user?.role));

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:transform-none flex flex-col",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-16 flex items-center px-6 border-b border-slate-200">
                    <GraduationCap className="h-8 w-8 text-indigo-600 mr-2" />
                    <span className="font-bold text-xl text-slate-900">EduManage</span>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="px-3 space-y-1">
                        {filteredNav.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-indigo-50 text-indigo-600"
                                            : "text-slate-700 hover:bg-slate-100 placeholder:text-slate-500"
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {user?.name?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 mt-2"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:hidden">
                    <span className="font-semibold text-slate-900">
                        {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu className="h-6 w-6" />
                    </Button>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
