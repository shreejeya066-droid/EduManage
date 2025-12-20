import React from 'react';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { Users, FileText, TrendingUp, AlertCircle } from 'lucide-react';

export const TeacherDashboard = () => {
    const { getAllUsers } = useAuth();
    const students = getAllUsers().filter(u => u.role === 'student');
    const totalStudents = students.length;
    const avgAttendance = Math.round(students.reduce((acc, s) => acc + (s.attendance || 0), 0) / totalStudents);

    // Calculate average math score as a sample metric
    const avgMathScore = Math.round(students.reduce((acc, s) => acc + (s.marks?.Math || 0), 0) / totalStudents);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
            </div>

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
                    <div className="text-2xl font-bold text-amber-600">12</div>
                    <p className="text-xs text-gray-500">Requires attention</p>
                </Card>
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
