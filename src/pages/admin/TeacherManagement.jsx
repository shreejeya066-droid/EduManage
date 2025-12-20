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
        const defaultPassword = 'password123';
        const username = formData.staffId;

        const newTeacher = {
            id: username, // Use staffId as key
            name: formData.fullName,
            role: 'teacher',
            username: username,
            password: defaultPassword,
            isFirstLogin: true,
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
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Teacher Management</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
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
