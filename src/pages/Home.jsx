import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { GraduationCap, Users, ShieldCheck } from 'lucide-react';

export const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-4">
            <div className="mb-8 text-center">
                <div className="flex justify-center mb-6">
                    <img src="/logo.png" alt="Logo" className="h-24 w-24 object-contain shadow-lg rounded-full bg-white p-2" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-indigo-900 sm:text-5xl">
                    EduMana<span className="text-indigo-600">ge</span>
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                    Student-Teacher Data Management & Analysis System
                </p>
            </div>

            <Card className="w-full max-w-4xl p-8 shadow-2xl backdrop-blur-sm bg-white/80">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">Select Your Role</h2>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Student Login */}
                    <div className="group relative rounded-xl border-2 border-transparent bg-white p-6 shadow-sm transition-all hover:border-indigo-500 hover:shadow-lg">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                                <GraduationCap className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Student</h3>
                                <p className="text-sm text-gray-500">Access your dashboard & profile</p>
                            </div>
                            <Button
                                className="w-full mt-2"
                                onClick={() => navigate('/login')}
                            >
                                Student Login
                            </Button>
                        </div>
                    </div>

                    {/* Teacher Login */}
                    <div className="group relative rounded-xl border-2 border-transparent bg-white p-6 shadow-sm transition-all hover:border-indigo-500 hover:shadow-lg">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                                <Users className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Teacher</h3>
                                <p className="text-sm text-gray-500">Faculty & Staff Login</p>
                            </div>
                            <Button
                                className="w-full mt-2"
                                onClick={() => navigate('/teacher-login')}
                            >
                                Teacher Login
                            </Button>
                        </div>
                    </div>

                    {/* Admin Login */}
                    <div className="group relative rounded-xl border-2 border-transparent bg-white p-6 shadow-sm transition-all hover:border-purple-500 hover:shadow-lg">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Admin</h3>
                                <p className="text-sm text-gray-500">System Management</p>
                            </div>
                            <Button
                                className="w-full mt-2 bg-purple-600 hover:bg-purple-700"
                                onClick={() => navigate('/admin/login')}
                            >
                                Admin Login
                            </Button>
                        </div>
                    </div>
                </div>

                {/* <div className="mt-8 text-center text-xs text-blue-400">
                    <p>For demonstration purposes, please use the Unified Student Login button.</p>
                </div> */}


                <div className="mt-8 text-center border-t pt-4">
                    <p className="text-sm text-gray-500 mb-2">Developer Tools</p>
                    <div className="flex justify-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/test-backend")}
                            className="text-indigo-600 hover:bg-indigo-50"
                        >
                            Test Student Fetch
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/test-teacher-db")}
                            className="text-purple-600 hover:bg-purple-50"
                        >
                            Test Teacher DB Storage
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};



