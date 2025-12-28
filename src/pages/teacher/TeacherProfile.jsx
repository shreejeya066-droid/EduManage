import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, BookOpen, Building } from 'lucide-react';

export const TeacherProfile = () => {
    const { user, requestProfileUpdate, getPendingRequest, loading } = useAuth();
    const location = useLocation();

    const [isEditing, setIsEditing] = useState(false);
    const [pendingRequest, setPendingRequest] = useState(null);

    // Combined local state: starts with User data, potentially overridden by pending request for preview?
    // Requirement: "View details". If pending, maybe show "Current" and "Requested".
    // For now, let's show Current Data, and if editing, pre-fill with Current.

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        qualification: '',
        experience: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                department: user.department || '',
                qualification: user.qualification || '',
                experience: user.experience || ''
            });

            // Check for pending requests
            const req = getPendingRequest(user.username);
            setPendingRequest(req);
        }
    }, [user, getPendingRequest]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        // Create change object (diff) or just send all editable fields
        const changes = {
            name: formData.name, // Usually name is fixed but allowing request
            email: formData.email,
            phone: formData.phone,
            qualification: formData.qualification,
            experience: formData.experience
        };

        const success = requestProfileUpdate(user.username, changes);
        if (success) {
            setPendingRequest({ changes, status: 'pending' }); // Optimistic update
            setIsEditing(false);
            alert('Profile update requested. Waiting for Admin approval.');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
                {!pendingRequest && (
                    <Button variant={isEditing ? "ghost" : "primary"} onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}>
                        {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                )}
            </div>

            {/* Pending Request Banner */}
            {pendingRequest && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-amber-800">Update Pending Approval</h3>
                            <div className="mt-2 text-sm text-amber-700">
                                <p>You have requested changes to your profile. You cannot make further edits until an administrator reviews your request.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-6">
                    <Card className="p-6 text-center space-y-4">
                        <div className="mx-auto h-32 w-32 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="h-16 w-16 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{user?.name}</h3>
                            <p className="text-sm text-gray-500">{user?.department} Department</p>
                            <div className="mt-2 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                                {user?.id}
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <Card title="Personal Information" className="p-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={!isEditing && "bg-gray-50"}
                            />
                            <Input
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                suffix={<Mail className="h-4 w-4 text-gray-400" />}
                            />
                            <Input
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </Card>

                    <Card title="Professional Details" className="p-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input
                                label="Department"
                                name="department"
                                value={formData.department}
                                disabled={true} // Totally fixed
                                suffix={<Building className="h-4 w-4 text-gray-400" />}
                            />
                            <Input
                                label="Qualification"
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                disabled={!isEditing}
                                suffix={<BookOpen className="h-4 w-4 text-gray-400" />}
                            />
                            <Input
                                label="Experience"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </Card>

                    {isEditing && (
                        <div className="flex justify-end">
                            <Button onClick={handleSave}>Request Changes</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
