import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Added import
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { ShieldCheck, Lock, CheckCircle } from 'lucide-react';

export const AdminResetPassword = () => {
    const { resetPassword } = useAuth(); // Destructure resetPassword
    const navigate = useNavigate();
    const location = useLocation();
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
        setError('');
    };

    const validatePassword = (pwd) => {
        // Minimum 8 chars, at least one number and one special char
        const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        return regex.test(pwd);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!location.state?.email) {
            setError('Missing email information. Please restart the process.');
            return;
        }

        if (!passwords.newPassword || !passwords.confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!validatePassword(passwords.newPassword)) {
            setError('Password must be at least 8 characters with 1 number and 1 special character.');
            return;
        }

        setLoading(true);

        // Use resetPassword from context
        setTimeout(() => {
            const result = resetPassword(location.state.email, passwords.newPassword);

            setLoading(false);

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/admin/login');
                }, 2000);
            } else {
                setError(result.message || 'Failed to update password. Please try again.');
            }
        }, 1000);
    };

    if (success) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md p-8 text-center shadow-xl">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <CheckCircle className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Password Reset!</h2>
                    <p className="mt-2 text-gray-600">Your password has been updated successfully.</p>
                    <p className="mt-1 text-sm text-gray-500">Redirecting to login...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <ShieldCheck className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
                <p className="mt-2 text-gray-600">Create a new secure password</p>
            </div>

            <Card className="w-full max-w-md p-8 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                            {error}
                        </div>
                    )}

                    <Input
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={passwords.newPassword}
                        onChange={handleChange}
                        placeholder="Min 8 chars, 1 number, 1 special char"
                        required
                        icon={<Lock className="h-4 w-4 text-gray-400" />}
                    />

                    <Input
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                        required
                        icon={<Lock className="h-4 w-4 text-gray-400" />}
                    />

                    <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        isLoading={loading}
                    >
                        Update Password
                    </Button>
                </form>
            </Card>
        </div>
    );
};
