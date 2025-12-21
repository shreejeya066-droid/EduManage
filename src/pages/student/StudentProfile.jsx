import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { User, Edit, Key, LogOut, ChevronDown, ChevronUp, FileText, Lock, Clock } from 'lucide-react';
import { RequestUpdateModal } from '../../components/student/RequestUpdateModal';

export const StudentProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [requestStatus, setRequestStatus] = useState('none');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Initial Load
    useEffect(() => {
        if (user) {
            const key = `student_profile_${user.username}`;
            const storedProfile = localStorage.getItem(key);
            if (storedProfile) {
                setProfileData(JSON.parse(storedProfile));
            } else {
                setProfileData(null);
            }

            const requests = JSON.parse(localStorage.getItem('profile_requests') || '{}');
            const userRequest = requests[user.username];
            if (userRequest) {
                setRequestStatus(userRequest.status);
            }
        }
    }, [user]);

    const handleEditProfile = () => {
        if (requestStatus === 'approved' || !profileData || !profileData.isProfileComplete || !profileData.course) {
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
        <div className="flex flex-col sm:grid sm:grid-cols-3 border-b py-2 last:border-0 gap-1 sm:gap-0">
            <span className="font-medium text-gray-500">{label}</span>
            <span className="sm:col-span-2 text-gray-900 font-medium break-words">{value || '-'}</span>
        </div>
    );

    const SectionToggle = ({ title, isActive, children }) => (
        <div className="border rounded-lg mb-4 overflow-hidden bg-white shadow-sm">
            <div className="w-full flex items-center justify-between p-4 bg-gray-50 border-b">
                <span className="font-semibold text-gray-800">{title}</span>
            </div>
            <div className="p-4">
                {children}
            </div>
        </div>
    );

    const renderEditButton = () => {
        if (!profileData || !profileData.isProfileComplete || !profileData.course) {
            return (
                <Button variant="outline" className="w-full justify-center border-green-200 text-green-700 hover:bg-green-50" onClick={handleEditProfile}>
                    <Edit className="h-4 w-4 mr-2" /> Complete Profile
                </Button>
            );
        }
        if (requestStatus === 'approved') {
            return (
                <Button variant="outline" className="w-full justify-center border-green-200 text-green-700 hover:bg-green-50" onClick={handleEditProfile}>
                    <Edit className="h-4 w-4 mr-2" /> Edit Profile
                </Button>
            );
        } else if (requestStatus === 'pending') {
            return (
                <Button variant="outline" disabled className="w-full justify-center border-yellow-200 bg-yellow-50 text-yellow-600 opacity-80 cursor-not-allowed">
                    <Clock className="h-4 w-4 mr-2" /> Request Pending
                </Button>
            );
        } else {
            return (
                <Button variant="outline" className="w-full justify-center border-indigo-200 text-indigo-600 hover:bg-indigo-50" onClick={() => setIsEditModalOpen(true)}>
                    <Lock className="h-4 w-4 mr-2" /> Request Update
                </Button>
            );
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header / Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-sm">
                    <User className="h-12 w-12 text-indigo-600" />
                </div>
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">{profileData ? `${profileData.firstName} ${profileData.lastName}` : user?.name}</h1>
                    <p className="text-gray-500">{profileData?.rollNumber || user?.username}</p>
                    <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${requestStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            Status: {requestStatus === 'approved' ? 'Unlocked' : 'Locked'}
                        </span>
                        {profileData?.department && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                                {profileData.department}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2 w-full md:w-auto min-w-[160px]">
                    {renderEditButton()}
                    <Button variant="outline" onClick={handleChangePassword} className="w-full justify-center">
                        <Key className="h-4 w-4 mr-2" /> Change Password
                    </Button>
                    <Button variant="outline" onClick={handleLogout} className="w-full justify-center text-red-600 border-red-100 hover:bg-red-50">
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                    </Button>
                </div>
            </div>

            {/* Profile Content */}
            {profileData ? (
                <div className="space-y-6">
                    <SectionToggle title="1. Personal Information">
                        <InfoRow label="Full Name" value={`${profileData.firstName} ${profileData.lastName}`} />
                        <InfoRow label="Date of Birth" value={profileData.dob} />
                        <InfoRow label="Gender" value={profileData.gender} />
                        <InfoRow label="Blood Group" value={profileData.bloodGroup} />
                        <InfoRow label="Nationality" value={profileData.nationality} />
                        <InfoRow label="Parent's Name" value={`${profileData.fatherName} / ${profileData.motherName}`} />
                    </SectionToggle>

                    <SectionToggle title="2. Contact Details">
                        <InfoRow label="Mobile" value={profileData.mobile} />
                        <InfoRow label="Email" value={profileData.email} />
                        <InfoRow label="Address" value={profileData.address} />
                    </SectionToggle>

                    <SectionToggle title="3. Academic Details">
                        <InfoRow label="Course" value={profileData.course} />
                        <InfoRow label="Department" value={profileData.department} />
                        <InfoRow label="Roll Number" value={profileData.rollNumber} />
                        <div className="mt-4 border-t pt-4">
                            <h4 className="font-semibold text-gray-700 mb-3">Semester Performance</h4>
                            {[1, 2, 3, 4, 5, 6].map(sem => (
                                <div key={sem} className="flex flex-col sm:grid sm:grid-cols-3 border-b py-2 text-sm gap-1 sm:gap-0">
                                    <span className="text-gray-600">Semester {sem}</span>
                                    <span className="font-medium">GPA: {profileData[`sem${sem}_cgpa`] || '-'}</span>
                                    <span className="flex items-center text-indigo-600">
                                        {profileData[`sem${sem}_file`] ? (
                                            <><FileText className="h-4 w-4 mr-1" /> Sheet Uploaded</>
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

                    <SectionToggle title="4. Technical Skills">
                        <InfoRow label="Languages" value={profileData.programmingLanguages} />
                        <InfoRow label="Tools" value={profileData.tools} />
                        <InfoRow label="Certifications" value={profileData.certifications} />
                    </SectionToggle>

                    <SectionToggle title="5. Extracurricular Activities">
                        <InfoRow label="Hobbies" value={Array.isArray(profileData.hobbies) ? profileData.hobbies.join(', ') : profileData.hobbies} />
                        <InfoRow label="Sports" value={profileData.sports} />
                        <InfoRow label="Clubs" value={profileData.clubs} />
                        <InfoRow label="Events" value={profileData.events} />
                        <InfoRow label="Achievements" value={profileData.achievements} />
                    </SectionToggle>

                    <SectionToggle title="Career & Others">
                        <InfoRow label="Higher Studies?" value={profileData.higherStudies} />
                        <InfoRow label="Interested Domain" value={profileData.interestedDomain} />
                        <InfoRow label="Preferred Location" value={profileData.prefLocation} />
                    </SectionToggle>
                </div>
            ) : (
                <Card className="p-12 text-center text-gray-500">
                    <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-700">Profile Not Found</h3>
                    <p>Please complete your profile details to view them here.</p>
                </Card>
            )}

            <RequestUpdateModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleRequestUpdate}
            />
        </div>
    );
};
