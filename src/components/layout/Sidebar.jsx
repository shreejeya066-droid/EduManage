import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    Settings,
    LogOut,
    BarChart3
} from 'lucide-react';
import { clsx } from 'clsx';

export const Sidebar = () => {
    const { user, logout } = useAuth();

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
        <aside className="hidden h-screen w-64 flex-col border-r bg-gray-50/40 md:flex">
            <div className="flex h-14 items-center border-b px-6 font-bold text-xl text-indigo-600">
                EduManage
            </div>
            <nav className="flex-1 space-y-1 p-4">
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
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </aside>
    );
};
