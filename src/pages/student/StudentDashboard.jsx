import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { User, FileText, CheckCircle, Clock, Bell } from 'lucide-react';

export const StudentDashboard = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [requestStatus, setRequestStatus] = useState('none');

    useEffect(() => {
        const loadProfile = async () => {
            if (user && user.rollNumber) {
                try {
                    // Dynamic import or static? Tool says "import from api.js". 
                    // I will use dynamic import to avoid messing up top imports if I can't see them all, 
                    // OR I'll assume I can add import in a separate tool call. 
                    // I will use dynamic import inside useEffect to be safe given the tool constraints on "block replacement".
                    const { fetchStudentProfile } = await import('../../services/api');
                    const data = await fetchStudentProfile(user.rollNumber);
                    setProfileData(data);
                } catch (err) {
                    console.error("Failed to load profile", err);
                }
            }
        };

        if (user) {
            loadProfile();

            // Keep legacy mock requests for now until backend requests are implemented
            const requests = JSON.parse(localStorage.getItem('profile_requests') || '{}');
            const userRequest = requests[user.username || user.rollNumber]; // fallback
            if (userRequest) {
                setRequestStatus(userRequest.status);
            }
        }
    }, [user]);

    const stats = [
        { label: 'Forms Submitted', value: profileData?.isProfileComplete ? '1' : '0', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Pending Requests', value: requestStatus === 'pending' ? '1' : '0', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
        { label: 'Approved Requests', value: requestStatus === 'approved' ? '1' : '0', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Notifications', value: '0', icon: Bell, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border-2 border-white/50">
                        <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">
                            {profileData?.isProfileComplete ? 'Welcome Back,' : 'Welcome,'} {profileData?.firstName ? profileData.firstName : 'Student'}!
                        </h1>
                        <div className="flex gap-3 mt-2 text-indigo-100">
                            <span>{profileData?.rollNumber || 'No Roll Number'}</span>
                            <span>•</span>
                            <span>{profileData?.course || 'No Course'} - {profileData?.department || 'No Dept'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.bg}`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="p-6 h-full">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {requestStatus === 'pending' && (
                                <div className="flex items-start gap-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                    <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-yellow-800">Profile Update Requested</p>
                                        <p className="text-sm text-yellow-700">Your request is awaiting admin approval.</p>
                                        <p className="text-xs text-yellow-500 mt-1">Just now</p>
                                    </div>
                                </div>
                            )}
                            {requestStatus === 'approved' && (
                                <div className="flex items-start gap-4 p-3 bg-green-50 rounded-lg border border-green-100">
                                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-green-800">Profile Update Approved</p>
                                        <p className="text-sm text-green-700">You can now edit your profile details.</p>
                                        <p className="text-xs text-green-500 mt-1">{new Date().toLocaleDateString()}</p>
                                    </div>
                                </div>
                            )}
                            {(requestStatus === 'none' || !requestStatus) && (
                                <div className="text-gray-500 text-center py-8">
                                    No recent activity to show.
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="p-6 h-full bg-indigo-50 border-indigo-100">
                        <h3 className="text-lg font-bold text-indigo-900 mb-4">Quick Tips</h3>
                        <ul className="space-y-3 text-sm text-indigo-800">
                            <li className="flex gap-2">
                                <span className="font-bold">•</span>
                                Keep your profile updated for better placement opportunities.
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold">•</span>
                                Check notifications regularly for college announcements.
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold">•</span>
                                Upload all semester marks sheets on time.
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
}; 
