import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Plus, Filter, MoreVertical, Lock, Unlock, RotateCcw } from 'lucide-react';
import { CreateStudentForm } from '../../components/admin/CreateStudentForm';
import { CreateTeacherForm } from '../../components/admin/CreateTeacherForm';

export const ManageUsers = ({ roleType }) => {
    const isStudent = roleType === 'student';
    const title = isStudent ? 'Student Management' : 'Teacher Management';
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock Data
    const [users, setUsers] = useState(
        isStudent
            ? [
                { id: 1, name: 'Alice Johnson', rollNo: 'S101', dept: 'CSE', status: 'Active' },
                { id: 2, name: 'Bob Brown', rollNo: 'S102', dept: 'ECE', status: 'Locked' },
                { id: 3, name: 'Charlie Davis', rollNo: 'S103', dept: 'MECH', status: 'Active' },
            ]
            : [
                { id: 1, name: 'Dr. Smith', staffId: 'T001', dept: 'CSE', status: 'Active' },
                { id: 2, name: 'Prof. Jones', staffId: 'T002', dept: 'Mathematics', status: 'Active' },
            ]
    );

    const [searchTerm, setSearchTerm] = useState('');

    const toggleStatus = (id) => {
        setUsers(users.map(u =>
            u.id === id ? { ...u, status: u.status === 'Active' ? 'Locked' : 'Active' } : u
        ));
    };

    const handleCreateUser = (formData) => {
        // Mock API call
        const newUser = isStudent
            ? {
                id: users.length + 1,
                name: formData.fullName,
                rollNo: formData.rollNumber,
                dept: formData.department,
                status: 'Active'
            }
            : {
                id: users.length + 1,
                name: formData.fullName,
                staffId: formData.staffId,
                dept: formData.department,
                status: 'Active'
            };

        setUsers([...users, newUser]);
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    <p className="text-gray-500">Manage, create and update {roleType} accounts.</p>
                </div>
                <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New {isStudent ? 'Student' : 'Teacher'}
                </Button>
            </div>

            <Card className="p-4">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder={`Search by name, ${isStudent ? 'roll number' : 'ID'}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b bg-gray-50/50">
                                <th className="p-4 font-medium text-gray-500">Name</th>
                                <th className="p-4 font-medium text-gray-500">{isStudent ? 'Roll No' : 'Staff ID'}</th>
                                <th className="p-4 font-medium text-gray-500">Department</th>
                                <th className="p-4 font-medium text-gray-500">Status</th>
                                <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">{user.name}</td>
                                    <td className="p-4 text-gray-600">{user.rollNo || user.staffId}</td>
                                    <td className="p-4 text-gray-600 max-w-[200px] truncate">{user.dept}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                        `}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                title={user.status === 'Active' ? 'Lock Account' : 'Unlock Account'}
                                                onClick={() => toggleStatus(user.id)}
                                                className={`p-2 rounded-md transition-colors ${user.status === 'Active'
                                                    ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                                    : 'text-red-500 hover:text-green-600 hover:bg-green-50'
                                                    }`}
                                            >
                                                {user.status === 'Active' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                                            </button>
                                            <button
                                                title="Reset Password"
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            >
                                                <RotateCcw className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <p>Showing {users.length} results</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm" disabled>Next</Button>
                    </div>
                </div>
            </Card>

            {isModalOpen && isStudent && (
                <CreateStudentForm
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreateUser}
                />
            )}

            {isModalOpen && !isStudent && (
                <CreateTeacherForm
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreateUser}
                />
            )}
        </div>
    );
};
