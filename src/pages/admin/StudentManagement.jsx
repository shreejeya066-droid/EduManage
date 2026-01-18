import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Search, Filter, MoreVertical, Plus, Users, ShieldAlert, Edit, Check, X, Eye, Trash2 } from 'lucide-react';
import { CreateStudentForm } from '../../components/admin/CreateStudentForm';

export const StudentManagement = () => {
    // const { getAllUsers, deleteUser } = useAuth(); // Removed unused

    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('list'); // 'list' | 'requests'

    // Fetch students
    const fetchStudentsData = async () => {
        try {
            const { fetchStudents } = await import('../../services/api');
            const data = await fetchStudents();
            setStudents(data);
        } catch (error) {
            console.error("Failed to fetch students", error);
        }
    };

    useEffect(() => {
        fetchStudentsData();
    }, []);

    const handleCreateUser = async (formData) => {
        try {
            const { registerStudent } = await import('../../services/api');

            const nameParts = formData.fullName.split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ') || '';

            await registerStudent({
                rollNumber: formData.rollNumber,
                password: 'password123',
                firstName: firstName,
                lastName: lastName,
                email: formData.email,
                phone: formData.mobile,
                department: formData.department,
                yearOfStudy: formData.year
            });

            setIsCreateModalOpen(false);
            fetchStudentsData();
            alert(`Student ${formData.rollNumber} created successfully.`);
        } catch (error) {
            console.error(error);
            alert(`Failed to create student: ${error.message}`);
        }
    };


    const handleViewProfile = (student) => {
        // Profile data is now part of student object from DB (hopefully)
        // Or we might need to fetch it? 
        // The mock implementation had separate profile storage.
        // DB implementation has profile fields in Student model.
        // So student object should have fields like firstName, lastName etc.
        setSelectedStudent(student);
    };

    const handleDelete = async (username) => {
        if (window.confirm(`Are you sure you want to delete student ${username}? This action cannot be undone.`)) {
            try {
                const { deleteStudent } = await import('../../services/api');
                await deleteStudent(username);
                fetchStudentsData();
            } catch (error) {
                alert('Failed to delete student');
            }
        }
    };

    // Requests Management Logic
    const [profileRequests, setProfileRequests] = useState({});

    useEffect(() => {
        const loadRequests = () => {
            const data = JSON.parse(localStorage.getItem('profile_requests') || '{}');
            setProfileRequests(data);
        };
        loadRequests();
        window.addEventListener('focus', loadRequests);
        return () => window.removeEventListener('focus', loadRequests);
    }, [activeTab]);

    const handleRequestAction = (username, action) => {
        const storedRequests = JSON.parse(localStorage.getItem('profile_requests') || '{}');
        if (storedRequests[username]) {
            storedRequests[username].status = action === 'approve' ? 'approved' : 'rejected';
            localStorage.setItem('profile_requests', JSON.stringify(storedRequests));
            setProfileRequests(storedRequests);
            alert(`Request ${action}d. Student ${username} can now edit their profile.`);
        }
    };

    const pendingRequests = Object.values(profileRequests).filter(r => r.status === 'pending');

    const filteredStudents = students.filter(student =>
        (student.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
                    <p className="text-gray-500">View and manage student records and requests.</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex bg-white rounded-lg border p-1">
                        <button
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'list' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
                            onClick={() => setActiveTab('list')}
                        >
                            <Users className="h-4 w-4 inline-block mr-2" />
                            All Students
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'requests' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
                            onClick={() => setActiveTab('requests')}
                        >
                            <ShieldAlert className="h-4 w-4 inline-block mr-2" />
                            Requests
                            {pendingRequests.length > 0 && <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">{pendingRequests.length}</span>}
                        </button>
                    </div>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Student
                    </Button>
                </div>
            </div>

            {activeTab === 'requests' && (
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Pending Profile Update Requests</h3>
                    </div>
                    {pendingRequests.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No pending requests at the moment.</p>
                    ) : (
                        <div className="space-y-4">
                            {pendingRequests.map((req, idx) => (
                                <div key={idx} className="bg-white border rounded-lg p-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-indigo-200 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-yellow-50 rounded-full text-yellow-600 hidden sm:block">
                                            <Edit className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-lg">{req.name}</h4>
                                            <p className="text-sm text-gray-500 font-mono mb-2">ID: {req.username}</p>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-700">Fields to Update:</span>
                                                    <p className="text-gray-600">{req.fields}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Reason:</span>
                                                    <p className="text-gray-600">{req.reason}</p>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-2">Requested on: {new Date(req.date).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 self-end md:self-center">
                                        <Button
                                            variant="outline"
                                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                            onClick={() => handleRequestAction(req.username, 'reject')}
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Reject
                                        </Button>
                                        <Button
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => handleRequestAction(req.username, 'approve')}
                                        >
                                            <Check className="h-4 w-4 mr-2" />
                                            Approve Request
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            )}

            {activeTab === 'list' && (
                <>
                    <div className="flex justify-between mb-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Roll No..."
                                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => {
                                            const name = student.name ? student.name : (student.firstName ? `${student.firstName} ${student.lastName}` : 'Profile Pending');
                                            // Backend returns rollNumber as the ID usually, or we mapped it.
                                            // The Student Model has "rollNumber"
                                            const displayId = student.rollNumber || student.username;

                                            return (
                                                <tr key={student._id || displayId} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{displayId}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.isLocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                            {student.isLocked ? 'Locked' : 'Active'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                        <Button size="sm" variant="ghost" onClick={() => handleViewProfile(student)}>
                                                            <Eye className="h-4 w-4 mr-1" /> View
                                                        </Button>
                                                        <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-800 hover:bg-red-50" onClick={() => handleDelete(displayId)}>
                                                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                                No students found.
                                            </td>
                                        </tr>
                                    )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </>
            )}

            <Modal
                isOpen={!!selectedStudent}
                onClose={() => setSelectedStudent(null)}
                title="Student Profile Details"
                className="max-w-2xl"
            >
                {selectedStudent && (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 border-b pb-4">
                            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold">
                                {(selectedStudent.username || selectedStudent.rollNumber || '?').substring(0, 2)}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    {selectedStudent.profile?.firstName
                                        ? `${selectedStudent.profile.firstName} ${selectedStudent.profile.lastName}`
                                        : (selectedStudent.name || selectedStudent.username || selectedStudent.rollNumber)}
                                </h3>
                                <p className="text-gray-500">{selectedStudent.username || selectedStudent.rollNumber}</p>
                            </div>
                        </div>

                        {selectedStudent.profile ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem label="Roll Number" value={selectedStudent.username || selectedStudent.rollNumber} />
                                <InfoItem label="Year of Joining" value={selectedStudent.profile.yearOfJoining || 'N/A'} />
                                <InfoItem label="Course" value={selectedStudent.profile.course} />
                                <InfoItem label="Department" value={selectedStudent.profile.department} />
                                <InfoItem label="Email" value={selectedStudent.profile.email} />
                                <InfoItem label="Mobile" value={selectedStudent.profile.mobile} />
                                <InfoItem label="Gender" value={selectedStudent.profile.gender} />
                                <InfoItem label="DOB" value={selectedStudent.profile.dob} />
                            </div>
                        ) : (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800">
                                Profile setup incomplete.
                            </div>
                        )}
                        {/* <div className="flex justify-end pt-4">
                            <Button variant="secondary" onClick={() => setSelectedStudent(null)}>Close</Button>
                        </div> */}
                    </div>
                )}
            </Modal>

            {isCreateModalOpen && (
                <CreateStudentForm
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreateUser}
                />
            )}
        </div>
    );
};

const InfoItem = ({ label, value }) => (
    <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-gray-900 mt-1">{value || '-'}</p>
    </div>
);
