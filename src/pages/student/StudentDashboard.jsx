import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { User, Edit, Key, LogOut, ChevronDown, ChevronUp, FileText, Lock, Clock } from 'lucide-react';
import { RequestUpdateModal } from '../../components/student/RequestUpdateModal';

export const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [showProfile, setShowProfile] = useState(false);

    // Permission State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [requestStatus, setRequestStatus] = useState('none'); // 'none', 'pending', 'approved', 'rejected'

    useEffect(() => {
        if (user) {
            const key = `student_profile_${user.username}`;
            const storedProfile = localStorage.getItem(key);
            if (storedProfile) {
                setProfileData(JSON.parse(storedProfile));
            } else {
                setProfileData(null);
            }

            // Check Permission Status
            const requests = JSON.parse(localStorage.getItem('profile_requests') || '{}');
            const userRequest = requests[user.username];

            if (userRequest) {
                setRequestStatus(userRequest.status);
            }
        }
    }, [user]);

    const handleEditProfile = () => {
        // Allow if approved OR if profile is incomplete (first time)
        if (requestStatus === 'approved' || !profileData || !profileData.isProfileComplete) {
            navigate('/student/profile-wizard');
        }
    };

    const handleRequestUpdate = ({ reason, fields }) => {
        if (!user) return;

        const newRequest = {
            username: user.username,
            name: user.name || (profileData ? `${profileData.firstName} ${profileData.lastName}` : 'Student'),
            reason,
            fields,
            status: 'pending',
            date: new Date().toISOString()
        };

        const requests = JSON.parse(localStorage.getItem('profile_requests') || '{}');
        requests[user.username] = newRequest;
        localStorage.setItem('profile_requests', JSON.stringify(requests));

        setRequestStatus('pending');
        setIsEditModalOpen(false);
        alert("Update request submitted successfully! Pending Admin Approval.");
    };

    const handleChangePassword = () => {
        navigate('/change-password');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const InfoRow = ({ label, value }) => (
        <div className="grid grid-cols-3 border-b py-2 last:border-0">
            <span className="font-medium text-gray-500">{label}</span>
            <span className="col-span-2 text-gray-900 font-medium break-words">{value || '-'}</span>
        </div>
    );

    const SectionToggle = ({ title, isActive, onClick, children }) => (
        <div className="border rounded-lg mb-4 overflow-hidden bg-white shadow-sm">
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
                <span className="font-semibold text-gray-800">{title}</span>
                {isActive ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
            </button>
            {isActive && (
                <div className="p-4">
                    {children}
                </div>
            )}
        </div>
    );

    const renderEditButton = () => {
        // If no profile data exists, OR profile is incomplete, allow editing (First time setup)
        if (!profileData || !profileData.isProfileComplete) {
            return (
                <Button
                    variant="outline"
                    className="h-auto py-6 sm:py-8 flex-col gap-2 text-lg hover:shadow-md transition-all border-green-200 hover:border-green-500 hover:text-green-600"
                    onClick={handleEditProfile}
                >
                    <Edit className="h-8 w-8" />
                    Complete Profile
                </Button>
            );
        }

        if (requestStatus === 'approved') {
            return (
                <Button
                    variant="outline"
                    className="h-auto py-6 sm:py-8 flex-col gap-2 text-lg hover:shadow-md transition-all border-green-200 hover:border-green-500 hover:text-green-600"
                    onClick={handleEditProfile}
                >
                    <Edit className="h-8 w-8" />
                    Edit Profile
                </Button>
            );
        } else if (requestStatus === 'pending') {
            return (
                <Button
                    variant="outline"
                    disabled
                    className="h-auto py-6 sm:py-8 flex-col gap-2 text-lg border-yellow-200 bg-yellow-50 text-yellow-600 opacity-80 cursor-not-allowed"
                >
                    <Clock className="h-8 w-8" />
                    Request Pending
                </Button>
            );
        } else {
            return (
                <Button
                    variant="outline"
                    className="h-auto py-6 sm:py-8 flex-col gap-2 text-lg hover:shadow-md transition-all border-indigo-200 hover:border-indigo-500 hover:text-indigo-600"
                    onClick={() => setIsEditModalOpen(true)}
                >
                    <Lock className="h-8 w-8" />
                    Request Update
                </Button>
            );
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 p-4">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border-2 border-white/50">
                            <User className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">
                                Welcome, {profileData?.firstName ? `${profileData.firstName} ${profileData.lastName || ''}` : 'Student'}!
                            </h1>
                            <p className="text-indigo-100 mt-1">
                                {profileData?.course ? `${profileData.course} - ${profileData.department}` : 'Complete your profile to see details'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                    variant={showProfile ? "primary" : "outline"}
                    className="h-auto py-6 sm:py-8 flex-col gap-2 text-lg hover:shadow-md transition-all"
                    onClick={() => setShowProfile(!showProfile)}
                >
                    <User className="h-8 w-8" />
                    {showProfile ? 'Hide Profile' : 'View Profile'}
                </Button>

                {renderEditButton()}

                <Button
                    variant="outline"
                    className="h-auto py-6 sm:py-8 flex-col gap-2 text-lg hover:shadow-md transition-all border-red-200 hover:border-red-500 hover:text-red-600"
                    onClick={handleLogout}
                >
                    <LogOut className="h-8 w-8" />
                    Logout
                </Button>
            </div>

            <div className="flex justify-end gap-4">
                <Button variant="ghost" size="sm" onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                }} className="text-red-500 hover:text-red-700">
                    <Trash2 className="mr-2 h-4 w-4" /> Reset Demo Data
                </Button>
                <Button variant="ghost" size="sm" onClick={handleChangePassword} className="text-gray-500 hover:text-indigo-600">
                    <Key className="mr-2 h-4 w-4" /> Change Password
                </Button>
            </div>

            {/* Profile Details View */}
            {showProfile && profileData ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex justify-between items-center">
                        <span>Student Profile Details</span>
                        <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            Status: {requestStatus === 'approved' ? 'Unlocked (Editing Allowed)' : 'Locked (Read-Only)'}
                        </span>
                    </h2>

                    <SectionToggle title="1. Personal Information" isActive={true} onClick={() => { }}>
                        <InfoRow label="Full Name" value={`${profileData.firstName} ${profileData.lastName}`} />
                        <InfoRow label="Date of Birth" value={profileData.dob} />
                        <InfoRow label="Gender" value={profileData.gender} />
                        <InfoRow label="Blood Group" value={profileData.bloodGroup} />
                        <InfoRow label="Nationality" value={profileData.nationality} />
                        <InfoRow label="Parent's Name" value={`${profileData.fatherName} / ${profileData.motherName}`} />
                    </SectionToggle>

                    <SectionToggle title="2. Contact Details" isActive={true} onClick={() => { }}>
                        <InfoRow label="Mobile" value={profileData.mobile} />
                        <InfoRow label="Email" value={profileData.email} />
                        <InfoRow label="Address" value={profileData.address} />
                    </SectionToggle>

                    <SectionToggle title="3. Academic Details" isActive={true} onClick={() => { }}>
                        <InfoRow label="Course" value={profileData.course} />
                        <InfoRow label="Department" value={profileData.department} />
                        <InfoRow label="Roll Number" value={profileData.rollNumber} />

                        {/* Semester Performance Subsection */}
                        <div className="mt-4 border-t pt-4">
                            <h4 className="font-semibold text-gray-700 mb-3">Semester Performance</h4>
                            {[1, 2, 3, 4, 5, 6].map(sem => (
                                <div key={sem} className="grid grid-cols-3 border-b py-2 text-sm">
                                    <span className="text-gray-600">Semester {sem}</span>
                                    <span className="font-medium">GPA: {profileData[`sem${sem}_cgpa`] || '-'}</span>
                                    <span className="flex items-center text-indigo-600">
                                        {profileData[`sem${sem}_file`] ? (
                                            <><FileText className="h-4 w-4 mr-1" /> File Uploaded</>
                                        ) : <span className="text-gray-400">No Sheet</span>}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-2">
                            <InfoRow label="Overall CGPA" value={profileData.cgpa} />
                            <InfoRow label="Backlogs" value={profileData.backlogs} />
                        </div>
                    </SectionToggle>

                    <SectionToggle title="4. Technical Skills" isActive={true} onClick={() => { }}>
                        <InfoRow label="Languages" value={profileData.programmingLanguages} />
                        <InfoRow label="Tools" value={profileData.tools} />
                        <InfoRow label="Certifications" value={profileData.certifications} />
                    </SectionToggle>

                    <SectionToggle title="Career & Others" isActive={true} onClick={() => { }}>
                        <InfoRow label="Higher Studies?" value={profileData.higherStudies} />
                        <InfoRow label="Interested Domain" value={profileData.interestedDomain} />
                        <InfoRow label="Preferred Location" value={profileData.prefLocation} />
                    </SectionToggle>
                </div>
            ) : showProfile && !profileData ? (
                <Card className="p-8 text-center text-gray-500">
                    <p>No profile data found. Please Request Update to add details.</p>
                </Card>
            ) : null}

            <RequestUpdateModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleRequestUpdate}
            />

            <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 z-50 text-xs rounded shadow-lg max-w-sm overflow-auto">
                <strong>DEBUG INFO:</strong><br />
                Has Profile: {profileData ? 'Yes' : 'No'} <br />
                Is Complete: {String(profileData?.isProfileComplete)} <br />
                Req Status: {requestStatus} <br />
                User: {user?.username}
            </div>
        </div>
    );
};
