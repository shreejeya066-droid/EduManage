import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    Settings,
    LogOut,
    BarChart3,
    X
} from 'lucide-react';
import { clsx } from 'clsx';

export const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        const role = user?.role;
        logout();
        if (role === 'teacher') {
            navigate('/teacher-login');
        } else if (role === 'admin') {
            navigate('/admin/login');
        } else {
            navigate('/login');
        }
    };

    const getLinks = () => {
        switch (user?.role) {
            case 'admin':
                return [
                    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
                    { name: 'Manage Students', path: '/admin/students', icon: GraduationCap },
                    { name: 'Manage Teachers', path: '/admin/teachers', icon: Users },
                ];
            case 'teacher':
                return [
                    { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
                    { name: 'Student List', path: '/teacher/students', icon: Users },
                    { name: 'Query Input', path: '/teacher/query', icon: BookOpen },
                    { name: 'Analytics', path: '/teacher/analytics', icon: BarChart3 },
                ];
            case 'student':
                return [
                    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
                    { name: 'My Profile', path: '/student/profile', icon: Users },
                ];
            default:
                return [];
        }
    };

    const links = getLinks();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={clsx(
                    'fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r bg-white transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:bg-gray-50/40',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex h-14 items-center justify-between border-b px-6 font-bold text-xl text-indigo-600 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
                        <span>EduManage</span>
                    </div>
                    <button onClick={onClose} className="text-gray-500 md:hidden">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                clsx(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-indigo-600',
                                    isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'
                                )
                            }
                        >
                            <link.icon className="h-4 w-4" />
                            {link.name}
                        </NavLink>
                    ))}
                </nav>
                <div className="border-t p-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};
