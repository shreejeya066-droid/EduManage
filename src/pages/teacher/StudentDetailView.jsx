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

            {/* Dynamic Profile Content */}
            <Card className="overflow-hidden">
                <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Complete Profile Data
                    </h3>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Read Only</span>
                </div>

                {profileDetails ? (
                    <div className="p-4">
                        <div className="grid grid-cols-1 gap-x-8">
                            {/* Dynamically Map ALL keys in profile details, excluding system keys */}
                            {Object.entries(profileDetails)
                                .filter(([key]) => !IGNORED_KEYS.includes(key))
                                .map(([key, value]) => (
                                    <InfoRow
                                        key={key}
                                        fieldKey={key}
                                        label={formatKey(key)}
                                        value={value}
                                    />
                                ))}
                        </div>
                        {Object.keys(profileDetails).length === 0 && (
                            <p className="text-center text-gray-500 py-4">Profile data object is empty.</p>
                        )}
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500">
                        <p className="text-lg">Student has not completed their profile yet.</p>
                        <p className="text-sm mt-2">Only basic login information is available.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};
