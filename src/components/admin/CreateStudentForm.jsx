import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';

export const CreateStudentForm = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        rollNumber: '',
        fullName: '',
        department: '',
        year: '',
        email: '',
        mobile: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Auto-generate temporary username
        const tempUsername = `${formData.rollNumber.toLowerCase()}_temp`;
        onSubmit({ ...formData, tempUsername });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-900">Create Student Account</h2>
                    <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Input
                            label="Roll Number"
                            name="rollNumber"
                            value={formData.rollNumber}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 2024CSE001"
                        />
                        <Input
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Department</label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full rounded-md border text-sm border-gray-300 p-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                required
                            >
                                <option value="">Select Department</option>
                                <option value="CSE">Computer Science</option>
                                <option value="ECE">Electronics</option>
                                <option value="MECH">Mechanical</option>
                                <option value="CIVIL">Civil</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Year / Semester</label>
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full rounded-md border text-sm border-gray-300 p-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                required
                            >
                                <option value="">Select Year</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>

                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="student@college.edu"
                        />
                        <Input
                            label="Mobile Number"
                            name="mobile"
                            type="tel"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                            placeholder="10-digit number"
                        />
                    </div>

                    <div className="rounded-lg bg-blue-50 p-4">
                        <p className="text-sm text-blue-700">
                            <strong>Note:</strong> A temporary username will be auto-generated based on the Roll Number.
                            The user will be prompted to set a password on first login.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
