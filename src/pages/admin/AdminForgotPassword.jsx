import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { ShieldCheck, Mail, ArrowLeft, AlertCircle } from 'lucide-react';

const { verifyEmail, sendOTP } = useAuth();
const navigate = useNavigate();
const [email, setEmail] = useState('');
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState('');
const [error, setError] = useState('');

const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // 1. Verify Email Exists
    const check = verifyEmail(email);
    if (!check.exists) {
        setError('Email address not found in our records.');
        setLoading(false);
        return;
    }

    // 2. Send OTP
    // Simulate network delay for better UX
    setTimeout(() => {
        const result = sendOTP(email);
        setLoading(false);

        if (result.success) {
            setMessage('An OTP has been sent to your registered email address.');
            // Navigate to OTP verification after a short delay
            setTimeout(() => {
                navigate('/admin/verify-otp', { state: { email } });
            }, 1500);
        } else {
            setError('Failed to send OTP. Please try again.');
        }
    }, 1000);
};

return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Recovery</h1>
            <p className="mt-2 text-gray-600">Reset your admin access</p>
        </div>

        <Card className="w-full max-w-md p-8 shadow-xl">
            {!message ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-gray-900">Forgot Password?</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Enter your registered email to receive an OTP.
                        </p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@example.com"
                        required
                        icon={<Mail className="h-4 w-4 text-gray-400" />}
                    />

                    <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        isLoading={loading}
                    >
                        Send OTP
                    </Button>

                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/login')}
                            className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 w-full"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Login
                        </button>
                    </div>
                </form>
            ) : (
                <div className="text-center space-y-6">
                    <div className="rounded-full bg-green-100 p-3 mx-auto w-fit">
                        <Mail className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">OTP Sent!</h3>
                        <p className="mt-2 text-sm text-gray-500">{message}</p>
                    </div>
                    <Button
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => navigate('/admin/verify-otp', { state: { email } })}
                    >
                        Enter OTP
                    </Button>
                </div>
            )}
        </Card>
    </div>
);
};
