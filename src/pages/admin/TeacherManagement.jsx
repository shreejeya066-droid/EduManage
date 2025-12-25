import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Eye, Search, Plus, Trash2 } from 'lucide-react';
import { CreateTeacherForm } from '../../components/admin/CreateTeacherForm';

export const TeacherManagement = () => {
    const { getAllUsers, deleteUser } = useAuth();
    const [teachers, setTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchTeachers = () => {
        const all = getAllUsers();
        setTeachers(all.filter(u => u.role === 'teacher'));
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleDelete = (username) => {
        if (window.confirm(`Are you sure you want to delete teacher ${username}?`)) {
            deleteUser(username);
            fetchTeachers();
        }
    };

    const handleCreateTeacher = (formData) => {
        const defaultPassword = 'password123'; // Default logic
        const username = formData.staffId; // Manually composed ID from form

        const newTeacher = {
            id: username,
            name: formData.fullName,
            role: 'teacher',
            username: username,
            password: defaultPassword,
            email: formData.email,
            isFirstLogin: true, // Force password change
            status: formData.status || 'Active', // Ensure Active status
            department: formData.department,
            subjects: formData.subjects
        };

        const currentUsers = getAllUsers();
        if (currentUsers.some(u => u.username === username)) {
            alert('User with this Staff ID already exists');
            return;
        }

        const updatedUsers = [...currentUsers, newTeacher];
        localStorage.setItem('all_users', JSON.stringify(updatedUsers));

        setIsCreateModalOpen(false);
        fetchTeachers();
    };

    const filteredTeachers = teachers.filter(t =>
        t.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.name && t.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            🔐 Authorized Teacher Access
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Only admin-approved teaching and non-teaching staff can log in using a system-generated Teacher ID.
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Add Teacher
                    </Button>
                </div>

                {/* Admin Info Notice */}
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-amber-700">
                                Adding a teacher creates a secure login ID. Teachers can log in only after admin approval and must create a new password on first login.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Authorized Teacher List (Chips) */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Active Teacher IDs
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {teachers.length > 0 ? (
                            teachers.map((teacher) => (
                                <div
                                    key={teacher.username}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                                >
                                    {teacher.username}
                                    <button
                                        onClick={() => handleDelete(teacher.username)}
                                        className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-indigo-200 text-indigo-400 hover:text-indigo-600 transition-colors"
                                        title="Revoke Access"
                                    >
                                        <span className="sr-only">Remove {teacher.username}</span>
                                        ×
                                    </button>
                                </div>
                            ))
                        ) : (
                            <span className="text-sm text-gray-400 italic">No authorized teachers yet.</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Teacher Directory</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search teachers..."
                        className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTeachers.length > 0 ? (
                                filteredTeachers.map((teacher) => (
                                    <tr key={teacher.username} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{teacher.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.department || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${teacher.isLocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                {teacher.isLocked ? 'Locked' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <Button size="sm" variant="ghost">
                                                <Eye className="h-4 w-4 mr-1" /> Details
                                            </Button>
                                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-800 hover:bg-red-50" onClick={() => handleDelete(teacher.username)}>
                                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                        No teachers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isCreateModalOpen && (
                <CreateTeacherForm
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreateTeacher}
                />
            )}
        </div>
    );
};
