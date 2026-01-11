import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Lock } from 'lucide-react';

export const AdminProfile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || 'Super Admin',
        email: user?.username === 'admin' ? 'admin@school.edu' : 'admin@example.com',
        mobile: '9876543210'
    });

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const { changePassword } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        setIsEditing(false);
        // Mock save
    };

    const handleChangePassword = () => {
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return;
        }

        const success = changePassword(passwordData.newPassword);
        if (success) {
            setPasswordSuccess("Password updated successfully");
            setTimeout(() => {
                setIsPasswordModalOpen(false);
                setPasswordData({ newPassword: '', confirmPassword: '' });
                setPasswordSuccess('');
            }, 2000);
        } else {
            setPasswordError("Failed to update password");
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-500">Manage your admin account details.</p>
                </div>
            </div>

            <Card className="p-4 sm:p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-32 w-32 rounded-full bg-purple-100 flex items-center justify-center text-4xl font-bold text-purple-600 border-4 border-white shadow-lg">
                            {formData.name[0]}
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">Role</p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 mt-1">
                                SYSTEM ADMIN
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                            <Button
                                variant={isEditing ? 'secondary' : 'outline'}
                                onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </Button>
                        </div>

                        <form className="space-y-6">
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                icon={<User className="h-4 w-4 text-gray-400" />}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    icon={<Mail className="h-4 w-4 text-gray-400" />}
                                />
                                <Input
                                    label="Mobile Number"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    icon={<Phone className="h-4 w-4 text-gray-400" />}
                                />
                            </div>

                            {isEditing && (
                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </form>

                        {!isEditing && (
                            <div className="mt-8 pt-6 border-t">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-md shadow-sm">
                                            <Lock className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Password</p>
                                            <p className="text-xs text-gray-500">Last changed 30 days ago</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => setIsPasswordModalOpen(true)}>Change Password</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordData({ newPassword: '', confirmPassword: '' });
                    setPasswordError('');
                    setPasswordSuccess('');
                }}
                title="Change Password"
                footer={
                    <div className="flex justify-end gap-2 w-full">
                        <Button
                            variant="outline"
                            onClick={() => setIsPasswordModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleChangePassword}
                            disabled={!passwordData.newPassword || !passwordData.confirmPassword}
                        >
                            Update Password
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    {passwordError && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                            {passwordError}
                        </div>
                    )}
                    {passwordSuccess && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
                            {passwordSuccess}
                        </div>
                    )}
                    <Input
                        label="New Password"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        placeholder="Enter new password"
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                    />
                </div>
            </Modal>
        </div>
    );
};
