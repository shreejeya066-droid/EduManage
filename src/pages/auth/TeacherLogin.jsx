import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const TeacherLogin = () => {
    const [step, setStep] = useState('check_id'); // 'check_id' | 'password'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login, checkUserStatus } = useAuth();
    const navigate = useNavigate();

    const handleCheckId = (e) => {
        e.preventDefault();
        setError(null);

        if (!username) {
            setError('Please enter your Teacher ID.');
            return;
        }

        const status = checkUserStatus(username);

        if (!status.exists) {
            setError('Invalid Teacher ID');
            return;
        }

        // Check for new user flow
        if (status.role === 'teacher' && status.isFirstLogin && status.passwordSet === false) {
            // Redirect to Create Password Flow
            navigate('/teacher/create-password', { state: { username: username } });
        } else {
            // Start Normal Login Flow
            setStep('password');
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setError(null);

        if (!password) {
            setError('Please enter your password.');
            return;
        }

        const result = login(username, password);

        if (result.success) {
            if (result.role === 'teacher') {
                if (result.isFirstLogin) {
                    // Password exists, but profile wizard incomplete
                    navigate('/teacher/profile-setup');
                } else {
                    navigate('/teacher/dashboard');
                }
            } else if (result.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                setError('Access restricted to Teachers only.');
            }
        } else {
            // Strict error messaging
            setError('Incorrect password');
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
                    <form onSubmit={handleCheckId} className="space-y-6">
                        <div className="space-y-4">
                            <Input
                                label="Teacher ID"
                                placeholder="Enter your Teacher ID"
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
                )}

                {step === 'password' && (
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="p-4 bg-indigo-50 rounded mb-4 flex justify-between items-center">
                            <div>
                                <span className="block text-xs text-gray-500 uppercase font-medium">Teacher ID</span>
                                <span className="block font-semibold text-gray-900">{username}</span>
                            </div>
                            <button type="button" onClick={handleBack} className="text-indigo-600 text-sm hover:underline">
                                Change
                            </button>
                        </div>

                        <div className="space-y-4">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-gray-500">
                                <input type="checkbox" className="mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                Remember me
                            </label>
                            <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                Forgot Password?
                            </Link>
                        </div>

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
