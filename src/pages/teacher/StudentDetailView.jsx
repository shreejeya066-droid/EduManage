import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { User, FileText, ArrowLeft, Shield } from 'lucide-react';

export const StudentDetailView = () => {
    const { id } = useParams(); // Start with username or ID
    const navigate = useNavigate();
    const { getAllUsers } = useAuth();
    const [student, setStudent] = useState(null);
    const [profileDetails, setProfileDetails] = useState(null);

    useEffect(() => {
        const users = getAllUsers();
        // Try to find by username first, then ID
        const found = users.find(u => u.username === id || u.id === id);

        if (found) {
            setStudent(found);
            // In a real app, this would be an API call. 
            // Here we look for localStorage "student_profile_{username}" if it exists, 
            // OR use the basic info from the found user object if no profile is set.
            const storedProfile = localStorage.getItem(`student_profile_${found.username}`);
            if (storedProfile) {
                setProfileDetails(JSON.parse(storedProfile));
            }
        }
    }, [id, getAllUsers]);

    if (!student) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Loading student details...</p>
                <Button variant="ghost" onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        );
    }

    const InfoRow = ({ label, value }) => (
        <div className="flex flex-col sm:grid sm:grid-cols-3 border-b py-2 last:border-0 gap-1 sm:gap-0">
            <span className="font-medium text-gray-500">{label}</span>
            <span className="sm:col-span-2 text-gray-900 font-medium break-words">{value || '-'}</span>
        </div>
    );

    const Section = ({ title, children }) => (
        <div className="border rounded-lg mb-4 overflow-hidden bg-white shadow-sm">
            <div className="w-full flex items-center justify-between p-4 bg-gray-50 border-b">
                <span className="font-semibold text-gray-800">{title}</span>
            </div>
            <div className="p-4">
                {children}
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/teacher/students')}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to List
                </Button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3 text-amber-800">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Editing restricted – Admin approval required to change student data.</span>
            </div>

            {/* Header / Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-sm">
                    <User className="h-12 w-12 text-indigo-600" />
                </div>
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {profileDetails ? `${profileDetails.firstName} ${profileDetails.lastName}` : student.name}
                    </h1>
                    <p className="text-gray-500">{student.username}</p>
                    <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                        {student.department && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                                {student.department}
                            </span>
                        )}
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Role: {student.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            {profileDetails ? (
                <div className="space-y-6">
                    <Section title="1. Personal Information">
                        <InfoRow label="Full Name" value={`${profileDetails.firstName} ${profileDetails.lastName}`} />
                        <InfoRow label="Date of Birth" value={profileDetails.dob} />
                        <InfoRow label="Gender" value={profileDetails.gender} />
                        <InfoRow label="Blood Group" value={profileDetails.bloodGroup} />
                    </Section>

                    <Section title="2. Contact Details">
                        <InfoRow label="Mobile" value={profileDetails.mobile} />
                        <InfoRow label="Email" value={profileDetails.email} />
                        <InfoRow label="Address" value={profileDetails.address} />
                    </Section>

                    <Section title="3. Academic Details">
                        <InfoRow label="Course" value={profileDetails.course} />
                        <InfoRow label="Department" value={profileDetails.department} />
                        <InfoRow label="Roll Number" value={profileDetails.rollNumber} />
                        <div className="mt-4 border-t pt-4">
                            <h4 className="font-semibold text-gray-700 mb-3">Semester Performance</h4>
                            {[1, 2, 3, 4, 5, 6].map(sem => (
                                <div key={sem} className="flex flex-col sm:grid sm:grid-cols-3 border-b py-2 text-sm gap-1 sm:gap-0">
                                    <span className="text-gray-600">Semester {sem}</span>
                                    <span className="font-medium">GPA: {profileDetails[`sem${sem}_cgpa`] || '-'}</span>
                                    <span className="flex items-center text-indigo-600">
                                        {profileDetails[`sem${sem}_file`] ? (
                                            <><FileText className="h-4 w-4 mr-1" /> Sheet Available</>
                                        ) : <span className="text-gray-400">No Sheet</span>}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-2">
                            <InfoRow label="Overall CGPA" value={profileDetails.cgpa} />
                            <InfoRow label="Backlogs" value={profileDetails.backlogs} />
                        </div>
                    </Section>
                </div>
            ) : (
                <Card className="p-12 text-center text-gray-500">
                    <p>Student has not completed their profile yet.</p>
                    <p className="text-sm mt-2">Basic Info: {student.name} ({student.username})</p>
                </Card>
            )}
        </div>
    );
};
