import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Eye, EyeOff } from 'lucide-react';
import { checkStudentStatus } from '../../services/api';

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

    const [isLoading, setIsLoading] = useState(false);
    const [userType, setUserType] = useState(null); // 'student' or 'teacher'

    // Use Async Methods
    const { 
        loginStudentAsync, 
        registerStudentAsync, 
        checkTeacherStatusAsync,
        login, 
        allowedYears, 
        loginTeacherAsync,
        setupTeacherPasswordAsync 
    } = useAuth();
    const navigate = useNavigate();

    const validateRollNumber = (roll) => {
        // Strict Validation for Students
        const regex = /^(\d{2})([A-Z]+)(\d{1,3})$/;
        const match = roll.match(regex);

        if (!match) {
            return { valid: false, message: 'Invalid Username. Format must be YY<DEPT>XXX (e.g. 23BIT01).' };
        }

        const year = match[1];
        const isYearAllowed = allowedYears.some(y => y === year || y.startsWith(year));

        if (!isYearAllowed) {
            return { valid: false, message: `Invalid Username. Admission year 20${year} is not enabled.` };
        }

        const number = parseInt(match[3], 10);
        if (number < 1 || number > 200) {
            return { valid: false, message: 'Invalid Username. Roll number must be between 01 and 200.' };
        }

        return { valid: true };
    };

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        if (!username) {
            setError('Please enter your User ID or Roll Number.');
            return;
        }

        const isStudentFormat = /^\d{2}[A-Z]+\d{1,3}$/.test(username);
        setIsLoading(true);

        try {
            // 1. Step 1: Check ID status if password is not yet visible
            if (!isPasswordVisible) {
                if (isStudentFormat) {
                    const validation = validateRollNumber(username);
                    if (!validation.valid) {
                        setError(validation.message);
                        setIsLoading(false);
                        return;
                    }

                    // Check Student Status API
                    const status = await checkStudentStatus(username);
                    setUserType('student');

                    if (!status.exists || !status.hasPassword) {
                        setIsCreatePasswordOpen(true);
                    } else {
                        setIsPasswordVisible(true);
                    }
                } else {
                    // Check Teacher Status API
                    const status = await checkTeacherStatusAsync(username);
                    
                    if (status.exists) {
                        setUserType('teacher');
                        if (!status.hasPassword) {
                            setIsCreatePasswordOpen(true);
                        } else {
                            setIsPasswordVisible(true);
                        }
                    } else {
                        // Admin or unknown format - fallback to just asking for password
                        // Or you can show error if you want strict checking
                        setIsPasswordVisible(true);
                    }
                }
            } else {
                // 2. Step 2: Perform actual Login
                if (!password) {
                    setError('Please enter your password.');
                    setIsLoading(false);
                    return;
                }

                if (userType === 'student' || isStudentFormat) {
                    const result = await loginStudentAsync(username, password);
                    if (result.success) {
                        navigate('/student/dashboard');
                    } else {
                        setError(result.message || 'Invalid credentials');
                    }
                } else if (userType === 'teacher') {
                    const result = await loginTeacherAsync(username, password);
                    if (result.success) {
                        if (result.isFirstLogin) {
                            setIsCreatePasswordOpen(true);
                        } else if (result.isProfileComplete === false) {
                            navigate('/teacher/profile-setup');
                        } else {
                            navigate('/teacher/dashboard');
                        }
                    } else {
                        setError(result.message || 'Invalid credentials');
                    }
                } else {
                    // Default Admin login
                    const result = await login(username, password);
                    if (result.success) {
                        navigate('/admin/dashboard');
                    } else {
                        setError('Invalid credentials');
                    }
                }
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreatePassword = async () => {
        setCreatePwdError(null);
        // Regex: At least 1 Uppercase, 1 Digit, 1 Special Char, and Min 8 characters
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/;

        if (!newPassword || !confirmPassword) {
            setCreatePwdError('Please fill all fields.');
            return;
        }
        if (newPassword.length < 8) {
            setCreatePwdError('Password must be at least 8 characters.');
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

        setIsLoading(true);
        try {
            let result;
            if (userType === 'student' || /^\d{2}[A-Z]+\d{1,3}$/.test(username)) {
                result = await registerStudentAsync(username, newPassword);
            } else {
                result = await setupTeacherPasswordAsync(username, newPassword);
            }

            if (result.success) {
                setIsCreatePasswordOpen(false);
                if (userType === 'teacher') {
                    navigate('/teacher/profile-setup');
                } else {
                    navigate('/student/dashboard');
                }
            } else {
                setCreatePwdError('Failed to create password: ' + result.message);
            }
        } catch (err) {
            setCreatePwdError('An error occurred while setting password.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setIsPasswordVisible(false);
        setPassword('');
        setError(null);
        setUserType(null);
        setIsCreatePasswordOpen(false);
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
                            <button type="button" onClick={handleBack} className="text-xs text-indigo-600 hover:text-indigo-800">
                                Change User ID
                            </button>
                        )}
                    </div>

                    {isPasswordVisible && (
                        <Input
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                            suffix={
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            }
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

                    <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                        {isPasswordVisible ? 'Login' : 'Next'}
                    </Button>
                </form>

                <div className="mt-6 text-center border-t pt-4 space-y-2">
                    <Link to="/" className="text-sm font-medium text-gray-600 hover:text-indigo-600 flex items-center justify-center gap-2 transition-colors">
                        ← Back to Home
                    </Link>
                </div>

                {/* First Time Password Creation Modal - Registers to DB */}
                <Modal
                    isOpen={isCreatePasswordOpen}
                    onClose={() => setIsCreatePasswordOpen(false)}
                    title="Setup Your Password"
                    footer={
                        <Button onClick={handleCreatePassword} className="w-full sm:w-auto" isLoading={isLoading}>
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
                                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
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
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
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
