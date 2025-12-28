import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Eye, Search, Plus, Trash2 } from 'lucide-react';
import { CreateTeacherForm } from '../../components/admin/CreateTeacherForm';

export const TeacherManagement = () => {
    const { getAllUsers, deleteUser, getProfileRequests, approveProfileRequest, rejectProfileRequest } = useAuth();
    const [teachers, setTeachers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchData = () => {
        const all = getAllUsers();
        setTeachers(all.filter(u => u.role === 'teacher'));

        if (getProfileRequests) {
            setRequests(getProfileRequests());
        }
    };

    useEffect(() => {
        fetchData();
        // Poll for updates or just simpler reload logic? 
        // For this demo, we'll refresh on actions.
    }, []);

    const handleDelete = (username) => {
        if (window.confirm(`Are you sure you want to delete teacher ${username}?`)) {
            deleteUser(username);
            fetchData();
        }
    };

    const handleApprove = (reqId) => {
        approveProfileRequest(reqId);
        fetchData();
        alert('Changes approved.');
    };

    const handleReject = (reqId) => {
        rejectProfileRequest(reqId);
        fetchData();
        alert('Request rejected.');
    };

    const handleCreateTeacher = (formData) => {
        // ... (Same as before) ...
        // Keeping previous logic intact for brevity, assuming replace_file wraps this correctly 
        // But since I'm replacing the whole component body mostly, let me ensure I don't lose the fixed logic.

        const username = formData.staffId;
        if (!username) { alert('Error: Teacher ID is missing'); return; }

        const newTeacher = {
            id: username,
            name: formData.fullName,
            role: 'teacher',
            username: username,
            password: '',
            email: formData.email,
            isFirstLogin: true,
            passwordSet: false,
            status: formData.status || 'Active',
            department: formData.department,
            subjects: formData.subjects
        };

        const currentUsers = getAllUsers();
        if (currentUsers.some(u => u.username === username)) {
            alert('User with this Staff ID already exists');
            return;
        }

        try {
            const rawStored = localStorage.getItem('all_users');
            let storedUsers = [];
            if (rawStored) {
                try { storedUsers = JSON.parse(rawStored); if (!Array.isArray(storedUsers)) storedUsers = []; }
                catch (e) { storedUsers = []; }
            }
            const updatedUsers = [...storedUsers, newTeacher];
            localStorage.setItem('all_users', JSON.stringify(updatedUsers));
            setIsCreateModalOpen(false);
            setTimeout(() => { fetchData(); alert(`Teacher ${username} added successfully.`); }, 100);
        } catch (error) {
            console.error(error);
            alert('Failed to save.');
        }
    };

    const filteredTeachers = teachers.filter(t =>
        t.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.name && t.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            {/* Pending Requests Section */}
            {requests.length > 0 && (
                <Card className="border-l-4 border-amber-500 bg-amber-50">
                    <div className="p-4">
                        <h3 className="text-lg font-bold text-amber-900 mb-2">📢 Pending Profile Updates ({requests.length})</h3>
                        <div className="space-y-3">
                            {requests.map(req => (
                                <div key={req.id} className="bg-white p-3 rounded shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-900">{req.username}</p>
                                        <div className="text-xs text-gray-500 mt-1 space-y-1">
                                            {Object.keys(req.changes).map(key => (
                                                <div key={key}>
                                                    <span className="font-medium capitalize">{key}:</span> {req.changes[key]}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(req.id)}>Approve</Button>
                                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleReject(req.id)}>Reject</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            )}

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            🔐 Authorized Teacher Access
                        </h2>
                    </div>
                    <Button onClick={() => setIsCreateModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Add Teacher
                    </Button>
                </div>

                {/* List Chips code (simplified for brevity in this replace) */}
                <div className="flex flex-wrap gap-2">
                    {teachers.map((teacher) => (
                        <div key={teacher.username} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {teacher.username}
                            <button onClick={() => handleDelete(teacher.username)} className="ml-2 text-indigo-400 hover:text-indigo-600">×</button>
                        </div>
                    ))}
                </div>

                {teachers.length === 0 && (
                    <div className="bg-red-50 p-4 rounded-md border border-red-200 flex items-center justify-between mt-4">
                        <div className="text-red-800 text-sm font-bold">No Teachers Found? Reset Data if corrupted.</div>
                        <Button size="sm" className="bg-red-100 text-red-700" onClick={() => {
                            localStorage.removeItem('all_users');
                            localStorage.removeItem('deleted_users');
                            window.location.reload();
                        }}>Reset</Button>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Teacher Directory</h3>
                <input
                    type="text"
                    placeholder="Search..."
                    className="pl-4 pr-4 py-2 border rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTeachers.map((teacher) => (
                                <tr key={teacher.username}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{teacher.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDelete(teacher.username)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isCreateModalOpen && <CreateTeacherForm onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreateTeacher} />}
        </div>
    );
};
