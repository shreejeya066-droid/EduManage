import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { User, FileText, ArrowLeft, Shield, GraduationCap, Trophy, Briefcase, Code } from 'lucide-react';

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

            // Priority: DB Data (if isProfileComplete is explicitly true, or fallback to object itself)
            if (found.isProfileComplete) {
                setProfileDetails(found);
            } else {
                // Fallback: Check Legacy LocalStorage
                const storedProfile = localStorage.getItem(`student_profile_${found.username}`);
                if (storedProfile) {
                    try {
                        setProfileDetails(JSON.parse(storedProfile));
                    } catch (e) {
                        console.error("Error parsing profile data", e);
                    }
                }
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

    // Helper to format camelCase keys to Title Case
    const formatKey = (key) => {
        const result = key.replace(/([A-Z])/g, " $1");
        return result.charAt(0).toUpperCase() + result.slice(1);
    };

    // System keys to exclude from the detailed view
    const IGNORED_KEYS = [
        '_id', 'password', '__v', 'createdAt', 'updatedAt',
        'isFirstLogin', 'isProfileComplete', 'isLocked',
        'role', 'username', 'id', 'rollNumber'
    ];

    const InfoRow = ({ label, value, fieldKey }) => {
        // If value is an object (like a file reference or nested data), handle it
        let displayValue = value;
        let isFile = false;

        // Check if this field represents a file
        // Logic: Key ends with '_file' OR value is a string that looks like a filename (not perfect but helpful)
        if (fieldKey && (fieldKey.endsWith('_file') || fieldKey.includes('File'))) {
            isFile = true;
        }

        if (Array.isArray(value)) {
            displayValue = value.join(', ');
        } else if (typeof value === 'object' && value !== null) {
            displayValue = JSON.stringify(value);
        } else if (value === true) {
            displayValue = 'Yes';
        } else if (value === false) {
            displayValue = 'No';
        } else if (!value) {
            return null;
        }

        // If it's a file, render a link
        if (isFile && typeof value === 'string') {
            const fileUrl = `http://localhost:5000/uploads/${value}`;
            displayValue = (
                <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                    <FileText className="h-4 w-4" />
                    View File ({value})
                </a>
            );
        }

        return (
            <div className="flex flex-col sm:grid sm:grid-cols-3 border-b py-3 last:border-0 gap-1 sm:gap-0 hover:bg-gray-50 transition-colors px-2">
                <span className="font-medium text-gray-500 capitalize">{label}</span>
                <span className="sm:col-span-2 text-gray-900 font-medium break-words">{displayValue || '-'}</span>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/teacher/students')}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to List
                </Button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3 text-amber-800">
                <Shield className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">Teacher View Only – You are viewing the complete student record. Editing is restricted to Admin.</span>
            </div>

            {/* Header / Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-sm flex-shrink-0">
                    <User className="h-12 w-12 text-indigo-600" />
                </div>
                <div className="text-center md:text-left flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-gray-900 truncate">
                        {student.firstName ? `${student.firstName} ${student.lastName}` : (student.name || student.username)}
                    </h1>
                    <p className="text-gray-500 font-mono">{student.rollNumber || student.username}</p>
                    <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                        {(student.department) && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                {student.department}
                            </span>
                        )}
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                            Role: {student.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Structured Profile Content */}
            {profileDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                    {/* Row 1 */}
                    <DetailSection
                        title="Personal Details"
                        icon={<User className="h-4 w-4" />}
                        data={profileDetails}
                        fields={['firstName', 'lastName', 'dob', 'gender', 'bloodGroup', 'nationality', 'religion', 'fatherName', 'motherName']}
                    />
                    <DetailSection
                        title="Contact Information"
                        icon={<FileText className="h-4 w-4" />} // Using FileText as generic placeholder if needed, or import Phone/Mail
                        data={profileDetails}
                        fields={['email', 'phone', 'mobile', 'address']}
                    />
                    <DetailSection
                        title="Academic Details"
                        icon={<GraduationCap className="h-4 w-4" />}
                        data={profileDetails}
                        fields={[
                            'rollNumber', 'course', 'department', 'yearOfStudy', 'semester', 'yearOfJoining',
                            'tenthPercent', 'twelfthPercent', 'cgpa', 'backlogs',
                            'sem1_cgpa', 'sem1_file',
                            'sem2_cgpa', 'sem2_file',
                            'sem3_cgpa', 'sem3_file',
                            'sem4_cgpa', 'sem4_file',
                            'sem5_cgpa', 'sem5_file',
                            'sem6_cgpa', 'sem6_file'
                        ]}
                    />

                    {/* Row 2 */}
                    <DetailSection
                        title="Extracurricular & Activities"
                        icon={<Trophy className="h-4 w-4" />}
                        data={profileDetails}
                        fields={['sports', 'clubs', 'achievements', 'events', 'hobbies']}
                    />
                    <DetailSection
                        title="Skills & Competencies"
                        icon={<Code className="h-4 w-4" />}
                        data={profileDetails}
                        fields={['programmingLanguages', 'technicalSkills', 'tools', 'certifications']}
                    />
                    <DetailSection
                        title="Career & Internships"
                        icon={<Briefcase className="h-4 w-4" />}
                        data={profileDetails}
                        fields={['internshipCompany', 'internshipDomain', 'placementWillingness', 'interestedDomain', 'prefLocation', 'higherStudies', 'higherStudiesDetails']}
                    />
                </div>
            ) : (
                <div className="p-12 text-center text-gray-500 bg-white rounded-xl shadow-sm border">
                    <p className="text-lg">Student has not completed their profile yet.</p>
                    <p className="text-sm mt-2">Only basic login information is available.</p>
                </div>
            )}
        </div>
    );
};

// Helper Component for Sections
const DetailSection = ({ title, icon, data, fields }) => {
    return (
        <Card className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-4 py-3 bg-gray-50 border-b flex items-center gap-2 font-semibold text-gray-800">
                <span className="text-indigo-600">{icon}</span>
                {title}
            </div>
            <div className="p-4 space-y-3 text-sm flex-1">
                {fields.map(key => {
                    const val = data[key];
                    if (!val && val !== 0) return null;

                    const label = key.replace(/([A-Z])/g, " $1")
                        .replace(/sem(\d+)_([a-z]+)/gi, "Sem $1 $2") // Format sem1_cgpa -> Sem 1 cgpa
                        .trim();

                    // Check if this is a file field
                    const isFile = key.toLowerCase().includes('file');

                    return (
                        <div key={key} className="flex flex-col border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                            <span className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">
                                {label}
                            </span>
                            <span className="font-medium text-gray-900 break-words">
                                {isFile ? (
                                    <a
                                        href={`http://localhost:5000/uploads/${val}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 hover:underline"
                                    >
                                        <FileText className="h-3 w-3" /> View Document
                                    </a>
                                ) : (
                                    Array.isArray(val) ? val.join(', ') : val.toString()
                                )}
                            </span>
                        </div>
                    );
                })}
                {fields.every(f => !data[f] && data[f] !== 0) && (
                    <p className="text-gray-400 italic text-center py-2">No details provided</p>
                )}
            </div>
        </Card>
    );
};
