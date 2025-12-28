import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const TeacherProfileSetup = () => {
    const { user, completeProfile } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        phone: '',
        qualification: '',
        experience: ''
    });

    useEffect(() => {
        // Protect route: If no user or not teacher, back to login
        if (!user || user.role !== 'teacher') {
            navigate('/teacher-login');
        }
    }, [user, navigate]);

    if (!user) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.phone || !formData.qualification) {
            alert('Please fill in all required fields');
            return;
        }

        const success = completeProfile({
            phone: formData.phone,
            qualification: formData.qualification,
            experience: formData.experience,
            // Add any other mapped fields
        });

        if (success) {
            navigate('/teacher/dashboard');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-lg p-6 sm:p-8 bg-white shadow-xl border-t-4 border-indigo-600">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
                    <p className="text-gray-500 mt-1">Please provide additional details to finalize your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Read-only Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Teacher ID</label>
                            <div className="mt-1 text-sm font-semibold text-gray-900">{user.id || user.username}</div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Department</label>
                            <div className="mt-1 text-sm font-semibold text-gray-900">{user.department || 'Not Assigned'}</div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 uppercase">Full Name</label>
                            <div className="mt-1 text-sm font-semibold text-gray-900">{user.name}</div>
                        </div>
                    </div>

                    {/* Editable Section */}
                    <div className="space-y-4">
                        <Input
                            label="Phone Number"
                            name="phone"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Qualification"
                                name="qualification"
                                placeholder="e.g. M.Sc, PhD"
                                value={formData.qualification}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Experience (Years)"
                                name="experience"
                                type="number"
                                placeholder="e.g. 5"
                                value={formData.experience}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" size="lg">
                        Complete Profile & access Dashboard
                    </Button>
                </form>
            </Card>
        </div>
    );
};
