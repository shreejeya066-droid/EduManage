import React from 'react';
import { Input } from '../../../components/ui/Input';

export const Step3Academic = ({ data, onChange }) => {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 align-top">
                <Input label="Degree" name="course" value="B.Sc" readOnly className="bg-gray-100 text-gray-500 cursor-not-allowed" />
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                        name="department"
                        value={data.department || ''}
                        onChange={onChange}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select Department</option>
                        <option value="IT">IT</option>
                        <option value="CS">CS</option>
                        <option value="Arts">Arts</option>
                        <option value="Language">Language</option>
                        <option value="Science">Science</option>
                    </select>
                </div>

                <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
                        <select
                            name="yearOfStudy"
                            value={data.yearOfStudy}
                            onChange={onChange}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <select
                        name="section"
                        value={data.section || ''}
                        onChange={onChange}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select Section</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                    </select>
                </div>
                <Input label="Roll Number" name="rollNumber" value={data.rollNumber} onChange={onChange} readOnly className="bg-gray-100 text-gray-500 cursor-not-allowed" />

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Year of Joining</label>
                    <select
                        name="yearOfJoining"
                        value={data.yearOfJoining}
                        onChange={onChange}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select Year</option>
                        {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">Previous Education</h3>
                <div className="grid gap-6 md:grid-cols-2">
                    <Input label="10th Percentage" name="tenthPercent" value={data.tenthPercent} onChange={onChange} placeholder="%" />
                    <Input label="12th Percentage" name="twelfthPercent" value={data.twelfthPercent} onChange={onChange} placeholder="%" />
                </div>
            </div>

            <div className="bg-indigo-50 p-5 rounded-lg space-y-4 border border-indigo-100">
                <h3 className="font-medium text-indigo-900 border-b border-indigo-200 pb-2">Semester-wise Performance</h3>
                <p className="text-sm text-indigo-700 mb-2">Please enter GPA and upload marksheet for each completed semester.</p>

                <div className="grid gap-3 sm:gap-4">
                    {[1, 2, 3, 4, 5, 6].map((sem) => (
                        <div key={sem} className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-end bg-white p-3 sm:p-4 rounded-md shadow-sm border border-gray-100">
                            <div className="md:col-span-2 flex items-center h-auto md:h-10 font-semibold text-gray-700 w-full mb-1 border-b md:border-b-0 pb-2 md:pb-0">
                                Semester {sem}
                            </div>
                            <div className="md:col-span-4 w-full">
                                <Input
                                    label={<span className="text-xs sm:text-sm">GPA / CGPA</span>}
                                    name={`sem${sem}_cgpa`}
                                    value={data[`sem${sem}_cgpa`] || ''}
                                    onChange={onChange}
                                    placeholder="Scale of 10"
                                    className="h-10 sm:h-9"
                                />
                            </div>
                            <div className="md:col-span-6 w-full mt-2 md:mt-0">
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Upload Marksheet</label>
                                <Input
                                    type="file"
                                    name={`sem${sem}_file`}
                                    onChange={onChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="w-full text-xs file:mr-2 file:py-1.5 sm:file:py-1 file:px-3 sm:file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 h-10 sm:h-9 p-1.5 sm:p-1"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">Current Overview</h3>
                <div className="grid gap-6 md:grid-cols-2">
                    <Input label="Overall CGPA" name="cgpa" value={data.cgpa} onChange={onChange} placeholder="Cumulative Grade Point Average" />
                    <Input label="Number of Active Backlogs" type="number" name="backlogs" value={data.backlogs} onChange={onChange} defaultValue="0" />
                </div>
            </div>
        </div>
    );
};
