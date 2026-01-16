import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [attempts, setAttempts] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            setError('Please enter both username and password.');
            return;
        }

        if (attempts >= 5) {
            setError('Account locked due to too many failed attempts. Please contact system support.');
            return;
        }

        setLoading(true);
        // Simulate network delay
        setTimeout(() => {
            const result = login(formData.username, formData.password);

            if (result.success) {
                if (result.role !== 'admin') {
                    setError('Access Denied. You do not have admin privileges.');
                    setLoading(false);
                    return;
                }
                navigate('/admin/dashboard');
            } else {
                setAttempts(prev => prev + 1);
                setError(result.message || 'Invalid credentials');
                setLoading(false);
            }
        }, 800);
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all application data? This will restore default accounts and clear any changes.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <ShieldCheck className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
                <p className="mt-2 text-gray-600">Secure System Management Access</p>
            </div>

            <Card className="w-full max-w-md p-8 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <Input
                        label="Admin Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter admin username"
                        disabled={loading}
                    />

                    <div className="relative">
                        <Input
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/forgot-password')}
                            className="text-sm font-medium text-purple-600 hover:text-purple-500"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        isLoading={loading}
                    >
                        Sign In
                    </Button>

                    <div className="mt-4 text-center space-y-3">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="text-sm text-gray-500 hover:text-gray-700 block w-full"
                        >
                            Back to Home
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                            title="Clear all local data and restore defaults"
                        >
                            Reset Application Data
                        </button>
                    </div>
                </form>
            </Card>

            <p className="mt-8 text-xs text-gray-400">
                Authorized Personnel Only • Secure Access
            </p>
        </div>
    );
};
