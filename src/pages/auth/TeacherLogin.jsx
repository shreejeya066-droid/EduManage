import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

import { Eye, EyeOff } from 'lucide-react';

export const TeacherLogin = () => {
    // Modes: 'check_id', 'password' (removed 'register')
    const [step, setStep] = useState('check_id');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);

    // Auth
    const { login, checkUserStatus, loginTeacherAsync } = useAuth();
    const navigate = useNavigate();

    const handleCheckId = async (e) => {
        e.preventDefault();
        setError(null);

        if (!username) {
            setError('Please enter your Teacher ID or Email.');
            return;
        }

        try {
            const { checkTeacherStatus } = await import('../../services/api');
            const status = await checkTeacherStatus(username);

            if (!status.exists) {
                setError('Teacher ID not found. Please contact the Admin.');
                return;
            }

            // Check if password needed
            if (!status.hasPassword) {
                navigate('/teacher/create-password', { state: { username: username } });
                return;
            }

            setStep('password');

        } catch (err) {
            console.error(err);
            // setError('Failed to check status. Using fallback login.'); // Suppressed to avoid confusing user
            setStep('password'); // Fallback to try login anyway
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        if (!password) {
            setError('Please enter your password.');
            return;
        }

        // Try DB Login (Async)
        // We pass username as 'email' parameter since controller now accepts both in that field
        const result = await loginTeacherAsync(username, password);

        if (result.success) {
            if (result.isFirstLogin) {
                navigate('/teacher/create-password', { state: { username: username } });
            } else if (result.isProfileComplete === false) {
                // Force profile completion if not first login but profile incomplete (e.g. skipped or old data)
                navigate('/teacher/profile-setup');
            } else {
                navigate('/teacher/dashboard');
            }
        } else {
            setError('Login Failed: ' + (result.message || 'Invalid credentials'));
        }
    };

    const handleBack = () => {
        setStep('check_id');
        setError(null);
        setPassword('');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md p-6 sm:p-8 bg-white shadow-xl border-t-4 border-indigo-600">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Teacher Portal</h1>
                    <p className="text-gray-500 mt-2">Faculty & Staff Login</p>
                </div>

                {step === 'check_id' && (
                    <div className="space-y-6">
                        <form onSubmit={handleCheckId} className="space-y-6">
                            <div className="space-y-4">
                                <Input
                                    label="Teacher ID or Email"
                                    placeholder="Enter your ID or Email"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" size="lg">
                                Next
                            </Button>
                        </form>
                    </div>
                )}

                {step === 'password' && (
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="p-4 bg-indigo-50 rounded mb-4 flex justify-between items-center">
                            <div>
                                <span className="block text-xs text-gray-500 uppercase font-medium">Login as</span>
                                <span className="block font-semibold text-gray-900">{username}</span>
                            </div>
                            <button type="button" onClick={handleBack} className="text-indigo-600 text-sm hover:underline">
                                Change
                            </button>
                        </div>

                        <div className="space-y-4">
                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                                suffix={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                }
                            />
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" size="lg">
                            Sign In
                        </Button>
                    </form>
                )}

                <div className="mt-6 text-center border-t pt-4 space-y-2">
                    <Link to="/" className="inline-block text-sm text-gray-500 hover:text-gray-900 transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </Card>
        </div>
    );
};
