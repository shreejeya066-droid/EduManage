import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';

export const CreateTeacherForm = ({ onClose, onSubmit }) => {
    const [idComponents, setIdComponents] = useState({
        type: 'TF',
        year: new Date().getFullYear().toString(),
        sequence: '01'
    });

    const [formData, setFormData] = useState({
        // staffId will be composed on submit
        fullName: '',
        department: '',
        email: '',
        mobile: '',
        subjects: [],
        status: 'Active' // Default status
    });

    const [selectedSubjects, setSelectedSubjects] = useState([]);

    const availableSubjects = [
        'Mathematics', 'Physics', 'Chemistry', 'English',
        'Data Structures', 'Algorithms', 'Database Management', 'Networks'
    ];

    const generatedId = `${idComponents.type}${idComponents.year}${idComponents.sequence}`;

    const handleIdChange = (field, value) => {
        setIdComponents(prev => ({ ...prev, [field]: value }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubjectChange = (e) => {
        const options = [...e.target.selectedOptions].map(o => o.value);
        setSelectedSubjects(options);
        setFormData(prev => ({ ...prev, subjects: options }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass composed ID
        onSubmit({
            ...formData,
            staffId: generatedId
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-900">Add New Teacher</h2>
                    <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100 mb-6">
                    <p className="text-sm text-indigo-800 font-medium mb-2">Teacher ID Construction</p>
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="w-24">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                            <select
                                value={idComponents.type}
                                onChange={(e) => handleIdChange('type', e.target.value)}
                                className="w-full rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="TF">TF (Tech)</option>
                                <option value="NT">NT (Non-Tech)</option>
                            </select>
                        </div>
                        <div className="w-24">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                            <Input
                                value={idComponents.year}
                                onChange={(e) => handleIdChange('year', e.target.value)}
                                className="h-9 text-sm"
                            />
                        </div>
                        <div className="w-24">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Sequence</label>
                            <select
                                value={idComponents.sequence}
                                onChange={(e) => handleIdChange('sequence', e.target.value)}
                                className="w-full rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                {[...Array(10)].map((_, i) => {
                                    const num = (i + 1).toString().padStart(2, '0');
                                    return <option key={num} value={num}>{num}</option>
                                })}
                            </select>
                        </div>
                        <div className="flex-1 min-w-[120px]">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Preview ID</label>
                            <div className="h-9 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-bold text-gray-900 shadow-sm">
                                {generatedId}
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                            + Add Teacher
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
