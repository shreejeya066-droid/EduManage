import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';

export const CreateTeacherForm = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        staffId: '',
        fullName: '',
        department: '',
        email: '',
        mobile: '',
        subjects: [], // multi-select handled simply for now
    });

    const [selectedSubjects, setSelectedSubjects] = useState([]);

    const availableSubjects = [
        'Mathematics', 'Physics', 'Chemistry', 'English',
        'Data Structures', 'Algorithms', 'Database Management', 'Networks'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubjectChange = (e) => {
        const options = [...e.target.selectedOptions].map(o => o.value);
        // Simple mock implementation for multi-select
        setSelectedSubjects(options);
        setFormData(prev => ({ ...prev, subjects: options }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-900">Create Teacher Account</h2>
                    <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Input
                            label="Staff ID"
                            name="staffId"
                            value={formData.staffId}
                            onChange={handleChange}
                            required
                            placeholder="e.g. T-CSEA01"
                        />
                        <Input
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            placeholder="Dr. Jane Smith"
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
                                <option value="Sci">Science & Humanities</option>
                            </select>
                        </div>

                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="faculty@college.edu"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Assigned Subjects (Hold Ctrl to select multiple)</label>
                        <select
                            multiple
                            name="subjects"
                            value={selectedSubjects}
                            onChange={handleSubjectChange}
                            className="w-full rounded-md border text-sm border-gray-300 p-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 h-32"
                        >
                            {availableSubjects.map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500">Selected: {selectedSubjects.join(', ')}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
