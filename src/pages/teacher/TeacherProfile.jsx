import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, BookOpen, Building } from 'lucide-react';

export const TeacherProfile = () => {
    const { user, updateProfile } = useAuth();
    const location = useLocation();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: 'teacher@university.edu', // Mock email
        phone: '123-456-7890',
        department: '',
        designation: 'Senior Lecturer',
        specialization: 'Software Engineering'
    });

    useEffect(() => {
        if (location.state?.isNewProfile) {
            setIsEditing(true);
        }
    }, [location.state]);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                department: user.department || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        // Logic to save profile
        updateProfile({ name: formData.name }); // Only mock updating name for now
        setIsEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
                <Button variant={isEditing ? "ghost" : "primary"} onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}>
                    {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-6">
                    <Card className="p-6 text-center space-y-4">
                        <div className="mx-auto h-32 w-32 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="h-16 w-16 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{formData.name}</h3>
                            <p className="text-sm text-gray-500">{formData.designation}</p>
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

                    <Card title="Academic Details" className="p-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input
                                label="Department"
                                name="department"
                                value={formData.department}
                                disabled={true} // Usually department is fixed
                                suffix={<Building className="h-4 w-4 text-gray-400" />}
                            />
                            <Input
                                label="Specialization"
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                disabled={!isEditing}
                                suffix={<BookOpen className="h-4 w-4 text-gray-400" />}
                            />
                        </div>
                    </Card>

                    {isEditing && (
                        <div className="flex justify-end">
                            <Button onClick={handleSave}>Save Changes</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
