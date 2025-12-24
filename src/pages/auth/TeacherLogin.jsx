import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const TeacherLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError(null);

        if (!username || !password) {
            setError('Please enter both User ID and Password.');
            return;
        }

        // Attempt login
        // Note: We do NOT force uppercase here, allowing for 'teacher', 'admin', etc.
        const result = login(username, password);

        if (result.success) {
            if (result.role === 'teacher') {
                navigate('/teacher/dashboard');
            } else if (result.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                // Technically shouldn't happen here if we frame it as Teacher Login, 
                // but AuthContext is generic.
                setError('Access restricted to Teachers only.');
                // In a real app, we'd log them out or redirect to student dashboard
            }
        } else {
            setError(result.message || 'Invalid credentials.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md p-6 sm:p-8 bg-white shadow-xl border-t-4 border-indigo-600">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Teacher Portal</h1>
                    <p className="text-gray-500 mt-2">Faculty & Staff Login</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <Input
                            label="Teacher ID / Username"
                            placeholder="e.g. teacher or TEACHER_001"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoFocus
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        {/* Reusing existing forgot password or generic placeholder */}
                        <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-500 font-medium">
                            Forgot Password?
                        </Link>
                    </div>

                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" size="lg">
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 text-center border-t pt-4 space-y-2">

                    <Link to="/" className="inline-block text-sm text-gray-500 hover:text-gray-900 transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </Card>
        </div>
    );
};
