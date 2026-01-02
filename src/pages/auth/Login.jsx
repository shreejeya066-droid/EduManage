import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Eye, EyeOff } from 'lucide-react';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isCreatePasswordOpen, setIsCreatePasswordOpen] = useState(false);

    // Create Password State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [createPwdError, setCreatePwdError] = useState(null);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { login, checkUserStatus, registerStudent, allowedYears } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const validateRollNumber = (roll) => {
        // Format: <YEAR><DEPT><NUMBER>
        // Example: 23BIT01, 23CS120, 24EC05
        const regex = /^(\d{2})([A-Z]+)(\d{1,3})$/;
        const match = roll.match(regex);

        if (!match) {
            return { valid: false, message: 'Invalid Username. Format must be YY<DEPT>XXX (e.g. 23BIT01).' };
        }

        const year = match[1]; // e.g., '23'
        // const dept = match[2]; // e.g., 'BIT'
        const number = parseInt(match[3], 10);

        // Check Allowed Years (Now checking just the year part)
        // If allowedYears contains full batch codes (legacy), we check if the year matches any start, OR if allowedYears is just years.
        // To be safe/robust: Check if 'year' is in allowedYears OR if `${year}BIT` was the old style.
        // With my change to mockData, it's just years. But let's be robust.
        const isYearAllowed = allowedYears.some(y => y === year || y.startsWith(year));

        if (!isYearAllowed) {
            return { valid: false, message: `Invalid Username. Admission year 20${year} is not enabled.` };
        }

        // Check Number Range 01 - 200
        if (number < 1 || number > 200) {
            return { valid: false, message: 'Invalid Username. Roll number must be between 01 and 200.' };
        }

        return { valid: true };
    };

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setError(null);

        if (!username) {
            setError('Please enter your User ID or Roll Number.');
            return;
        }

        // 1. Check User Status First
        const status = checkUserStatus(username);

        // 2. Conditional Validation
        if (status.exists && (status.role === 'teacher' || status.role === 'admin')) {
            // Skip strict Roll Number regex for Teachers/Admins
            if (!isPasswordVisible) {
                setIsPasswordVisible(true);
                return;
            }
        } else {
            // For Students or Unknown users, apply strict format check
            const validation = validateRollNumber(username);
            if (!validation.valid) {
                // If invalid format AND not found as teacher/admin -> Show error
                setError(validation.message);
                return;
            }
        }

        // 3. Login Flow
        if (!status.exists) {
            // Case 1: First-time student -> Open Modal
            setIsCreatePasswordOpen(true);
        } else {
            // Case 2: User exists
            if (!isPasswordVisible) {
                // Step 1: Show password field
                setIsPasswordVisible(true);
            } else {
                // Step 2: Standard Login
                if (!password) {
                    setError('Please enter your password.');
                    return;
                }

                const result = login(username, password);
                if (result.success) {
                    if (result.role === 'teacher') {
                        navigate('/teacher/dashboard');
                    } else if (result.role === 'admin') {
                        navigate('/admin/dashboard');
                    } else {
                        navigate('/student/dashboard');
                    }
                } else {
                    setError(result.message);
                }
            }
        }
    };

    const handleBack = () => {
        setIsPasswordVisible(false);
        setPassword('');
        setError(null);
    };

    const handleCreatePassword = () => {
        setCreatePwdError(null);

        // Regex: At least 1 Uppercase, 1 Digit, 1 Special Char, and Max 8 characters
        // allow any characters as long as requirements are met
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{1,8}$/;

        if (!newPassword || !confirmPassword) {
            setCreatePwdError('Please fill all fields.');
            return;
        }

        if (newPassword.length > 8) {
            setCreatePwdError('Password must be 8 characters or less.');
            return;
        }

        if (!passwordRegex.test(newPassword)) {
            setCreatePwdError('Password must contain at least 1 uppercase letter, 1 digit, and 1 special character.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setCreatePwdError('Passwords do not match.');
            return;
        }

        // Register Student
        const result = registerStudent(username, newPassword);
        if (result.success) {
            setIsCreatePasswordOpen(false);
            navigate('/student/dashboard');
        } else {
            setCreatePwdError('Failed to create password.');
        }
    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md p-4 sm:p-6 bg-white shadow-xl">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-indigo-600">Portal Login</h1>
                    <p className="text-gray-500 mt-2">Enter your credentials to access the portal</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                        <Input
                            label="User ID / Roll Number"
                            placeholder="e.g. 23BIT01 "
                            value={username}
                            onChange={(e) => setUsername(e.target.value.toUpperCase())}
                            disabled={isPasswordVisible}
                        />
                        {isPasswordVisible && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="text-xs text-indigo-600 hover:text-indigo-800"
                            >
                                Change User ID
                            </button>
                        )}
                    </div>

                    {isPasswordVisible && (
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                        />
                    )}

                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {isPasswordVisible && (
                        <div className="flex items-center justify-between">
                            <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
                                Forgot Password?
                            </Link>
                        </div>
                    )}

                    <Button type="submit" className="w-full" size="lg">
                        {isPasswordVisible ? 'Login' : 'Next'}
                    </Button>
                </form>

                <div className="mt-6 text-center border-t pt-4 space-y-2">
                    <p className="text-sm text-gray-600">

                    </p>
                    <Link to="/" className="text-sm font-medium text-gray-600 hover:text-indigo-600 flex items-center justify-center gap-2 transition-colors">
                        ← Back to Home
                    </Link>
                </div>

                {/* First Time Password Creation Modal */}
                <Modal
                    isOpen={isCreatePasswordOpen}
                    onClose={() => setIsCreatePasswordOpen(false)}
                    title="Setup Your Password"
                    footer={
                        <Button onClick={handleCreatePassword} className="w-full sm:w-auto">
                            Save Password
                        </Button>
                    }
                >
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Welcome! As a first-time user, please set a secure password for your account <strong>{username}</strong>.
                        </p>
                        <div className="space-y-2">
                            <Input
                                label="New Password"
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                maxLength={8}
                                suffix={
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                }
                            />
                            <Input
                                label="Confirm Password"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                maxLength={8}
                                suffix={
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                }
                            />
                        </div>
                        {createPwdError && (
                            <p className="text-sm text-red-600">{createPwdError}</p>
                        )}
                    </div>
                </Modal>
            </Card>
        </div>
    );
};

export default Login;
