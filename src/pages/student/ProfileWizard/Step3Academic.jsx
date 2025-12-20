import React from 'react';
import { Input } from '../../../components/ui/Input';

export const Step3Academic = ({ data, onChange }) => {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <Input label="Degree" name="course" value={data.course} onChange={onChange} placeholder="e.g. B.Sc" />
                <Input label="Department" name="department" value={data.department} onChange={onChange} placeholder="e.g. Computer Science" />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Input label="Section" name="section" value={data.section} onChange={onChange} placeholder="e.g. A" />
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

                <div className="grid gap-4">
                    {[1, 2, 3, 4, 5, 6].map((sem) => (
                        <div key={sem} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white p-3 rounded-md shadow-sm">
                            <div className="md:col-span-2 flex items-center h-10 font-semibold text-gray-700">
                                Semester {sem}
                            </div>
                            <div className="md:col-span-4">
                                <Input
                                    label="GPA / CGPA"
                                    name={`sem${sem}_cgpa`}
                                    value={data[`sem${sem}_cgpa`] || ''}
                                    onChange={onChange}
                                    placeholder="Scale of 10"
                                    className="h-9"
                                />
                            </div>
                            <div className="md:col-span-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Marksheet</label>
                                <Input
                                    type="file"
                                    name={`sem${sem}_file`}
                                    onChange={onChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 h-9 p-1"
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
