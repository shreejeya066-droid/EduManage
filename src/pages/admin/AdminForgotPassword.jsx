import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { ShieldCheck, Mail, ArrowLeft } from 'lucide-react';

export const AdminForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Mock API call for sending OTP
        setTimeout(() => {
            setLoading(false);
            setMessage('An OTP has been sent to your registered email address.');
            // Navigate to OTP verification after a short delay or let user click continue
            setTimeout(() => {
                navigate('/admin/verify-otp', { state: { email } });
            }, 1500);
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
