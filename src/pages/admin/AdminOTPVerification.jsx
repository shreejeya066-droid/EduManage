import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { ShieldCheck } from 'lucide-react';

export const AdminOTPVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState('');
    const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!location.state?.email) {
            navigate('/admin/login'); // Redirect if accessed directly
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate, location.state]);

    const handleResend = () => {
        setTimeLeft(60);
        // Mock resend logic
        console.log('Resending OTP...');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (otp.length !== 4) { // Assuming 4-digit OTP
            setError('Please enter a valid 4-digit OTP.');
            return;
        }

        setLoading(true);
        // Mock verification
        setTimeout(() => {
            if (otp === '1234') { // Mock valid OTP
                navigate('/admin/reset-password', { state: { email: location.state.email } });
            } else {
                setError('Invalid or expired OTP. Please try again.');
                setLoading(false);
            }
        }, 800);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <ShieldCheck className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Verification</h1>
                <p className="mt-2 text-gray-600">Enter the code sent to your email</p>
            </div>

            <Card className="w-full max-w-md p-8 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                        <input
                            type="text"
                            maxLength={4}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full tracking-[1em] text-center text-2xl font-bold py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            placeholder="----"
                        />
                    </div>

                    <div className="text-center text-sm">
                        {timeLeft > 0 ? (
                            <p className="text-gray-500">Expires in <span className="font-medium text-gray-900">{timeLeft}s</span></p>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                className="text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        isLoading={loading}
                    >
                        Verify & Proceed
                    </Button>
                </form>
            </Card>
        </div>
    );
};
