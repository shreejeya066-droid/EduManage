import React from 'react';
import { Card } from '../../components/ui/Card';
import { Users, GraduationCap, ShieldAlert, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, label, icon: Icon, color, linkTo }) => {
    const CardContent = (
        <Card className="p-6 transition-all hover:shadow-lg border-l-4 h-full cursor-pointer" style={{ borderLeftColor: color }}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="mt-2 text-3xl font-bold text-gray-900">{value}</h3>
                    <p className="mt-1 text-sm text-gray-600">{label}</p>
                </div>
                <div className={`p-3 rounded-lg bg-opacity-10`} style={{ backgroundColor: `${color}20`, color: color }}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </Card>
    );

    return linkTo ? <Link to={linkTo}>{CardContent}</Link> : CardContent;
};

export const AdminDashboard = () => {
    const { getAllUsers } = useAuth();
    const allUsers = getAllUsers();

    const studentsCount = allUsers.filter(u => u.role === 'student').length;
    const teachersCount = allUsers.filter(u => u.role === 'teacher').length;
    const activeAccounts = allUsers.filter(u => !u.isLocked).length; // Assuming isLocked property or similar, else allUsers.length

    // Mock Data
    const stats = [
        {
            title: 'Total Students',
            value: studentsCount,
            label: 'Active enrollments',
            icon: GraduationCap,
            color: '#4F46E5', // Indigo
            linkTo: '/admin/students'
        },
        {
            title: 'Total Teachers',
            value: teachersCount,
            label: 'Across departments',
            icon: Users,
            color: '#059669', // Emerald
            linkTo: '/admin/teachers'
        },
        {
            title: 'Active Accounts',
            value: activeAccounts,
            label: 'Students & Staff',
            icon: UserCheck,
            color: '#2563EB' // Blue
        },
        {
            title: 'Locked / Inactive',
            value: '20',
            label: 'Requires attention',
            icon: ShieldAlert,
            color: '#DC2626' // Red
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome to the system administration portal.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Recent Activity / Quick Actions Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Notices</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h4 className="font-medium text-blue-900">Academic Year Setup</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                The new academic year configuration is pending. Please visit Academic Structure Setup to finalize.
                            </p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                            <h4 className="font-medium text-yellow-900">Security Alert</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                                5 failed login attempts detected from student accounts in the last hour.
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Setup</h3>
                    <p className="text-sm text-gray-500 mb-4">Common administrative tasks available for quick access.</p>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all">
                            <span className="block font-medium text-gray-900">Add New Student</span>
                            <span className="text-xs text-gray-500">Single entry enrollment</span>
                        </button>
                        <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all">
                            <span className="block font-medium text-gray-900">Add New Teacher</span>
                            <span className="text-xs text-gray-500">Staff onboarding</span>
                        </button>
                        <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all">
                            <span className="block font-medium text-gray-900">Reset User Password</span>
                            <span className="text-xs text-gray-500">Manual override</span>
                        </button>
                        <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all">
                            <span className="block font-medium text-gray-900">View Audit Log</span>
                            <span className="text-xs text-gray-500">System activity</span>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};
