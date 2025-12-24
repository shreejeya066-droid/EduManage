import React from 'react';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Users, FileText, TrendingUp, AlertCircle } from 'lucide-react';

export const TeacherDashboard = () => {
    const { getAllUsers, user } = useAuth();
    const students = getAllUsers().filter(u => u.role === 'student');
    const totalStudents = students.length;
    const avgAttendance = Math.round(students.reduce((acc, s) => acc + (s.attendance || 0), 0) / totalStudents);

    // Calculate average math score as a sample metric
    const avgMathScore = Math.round(students.reduce((acc, s) => acc + (s.marks?.Math || 0), 0) / totalStudents);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
                    <p className="text-gray-500">Welcome, {user?.name || 'Teacher'}</p>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
                        <Users className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{totalStudents}</div>
                    <p className="text-xs text-gray-500">Active learners</p>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium text-gray-500">Avg. Attendance</h3>
                        <FileText className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">{avgAttendance}%</div>
                    <p className="text-xs text-gray-500">+2.1% from last month</p>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium text-gray-500">Class Average (Math)</h3>
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="text-2xl font-bold text-indigo-600">{avgMathScore}%</div>
                    <p className="text-xs text-gray-500">Across all sections</p>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium text-gray-500">Pending Queries</h3>
                        <AlertCircle className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="text-2xl font-bold text-amber-600">3</div>
                    <p className="text-xs text-gray-500">Requires attention</p>
                </Card>
            </div>

            {/* Navigation Cards */}
            <h3 className="text-xl font-semibold">Overview</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Link to="/teacher/students" className="block">
                    <Card className="hover:bg-indigo-50 transition-colors cursor-pointer h-full flex flex-col items-center justify-center p-6 text-center space-y-2 border-indigo-100">
                        <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                            <Users className="h-8 w-8" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Student List</h3>
                        <p className="text-sm text-gray-500">View and manage student details</p>
                    </Card>
                </Link>

                <Link to="/teacher/analytics" className="block">
                    <Card className="hover:bg-emerald-50 transition-colors cursor-pointer h-full flex flex-col items-center justify-center p-6 text-center space-y-2 border-emerald-100">
                        <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                            <TrendingUp className="h-8 w-8" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Analytics</h3>
                        <p className="text-sm text-gray-500">View performance insights</p>
                    </Card>
                </Link>

                <Link to="/teacher/notifications" className="block">
                    <Card className="hover:bg-amber-50 transition-colors cursor-pointer h-full flex flex-col items-center justify-center p-6 text-center space-y-2 border-amber-100">
                        <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                            <AlertCircle className="h-8 w-8" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <p className="text-sm text-gray-500">Recent updates & requests</p>
                    </Card>
                </Link>

                <Link to="/teacher/profile" className="block">
                    <Card className="hover:bg-blue-50 transition-colors cursor-pointer h-full flex flex-col items-center justify-center p-6 text-center space-y-2 border-blue-100">
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                            <FileText className="h-8 w-8" />
                        </div>
                        <h3 className="font-semibold text-gray-900">My Profile</h3>
                        <p className="text-sm text-gray-500">View and edit personal info</p>
                    </Card>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4" title="Recent Activity">
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                                <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                    ST
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Student Report Updated</p>
                                    <p className="text-xs text-gray-500">Academic details for Alice Johnson were updated.</p>
                                </div>
                                <div className="ml-auto font-medium text-xs text-gray-500">2h ago</div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="col-span-3" title="Quick Actions">
                    <div className="grid grid-cols-1 gap-2">
                        <button className="w-full text-left px-4 py-3 rounded-lg border hover:bg-gray-50 transition-colors text-sm font-medium">
                            Create New Assessment
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-lg border hover:bg-gray-50 transition-colors text-sm font-medium">
                            Update Attendance Record
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-lg border hover:bg-gray-50 transition-colors text-sm font-medium">
                            Generate Performance Report
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};
