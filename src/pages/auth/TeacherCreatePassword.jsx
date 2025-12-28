import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const TeacherCreatePassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setupPassword } = useAuth();
    const [username, setUsername] = useState('');

    // Form state
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        // If we arrived here without state (direct link navigation), redirect back to login
        if (!location.state?.username) {
            navigate('/teacher-login');
            return;
        }
        setUsername(location.state.username);
    }, [location, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        const complexityRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!complexityRegex.test(password)) {
            setError('Password must contain at least 1 Uppercase, 1 Digit, and 1 Special Character.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Action
        const success = setupPassword(username, password);
        if (success) {
            // Updated user is now "logged in" but isFirstLogin is still true in my logic
            // so we redirect to profile setup
            navigate('/teacher/profile-setup');
        } else {
            setError('Failed to update password. Please try again.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md p-6 sm:p-8 bg-white shadow-xl border-t-4 border-indigo-600">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Create Password</h1>
                    <p className="text-gray-500 mt-2">Set up security for your account: {username}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <Input
                            label="New Password"
                            type="password"
                            placeholder="Min 8 chars, 1 Upper, 1 Special"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoFocus
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" size="lg">
                        Set Password & Continue
                    </Button>
                </form>
            </Card>
        </div>
    );
};
