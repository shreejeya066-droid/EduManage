import React from 'react';
import { Input } from '../../../components/ui/Input';

export const Step4Skills = ({ data, onChange }) => {
    return (
        <div className="space-y-6">
            {/* Technical Skills Section */}
            <div className="space-y-6 border-b pb-6">
                <h3 className="text-lg font-medium text-gray-900">Technical Competencies</h3>
                <div className="grid gap-6 md:grid-cols-1">
                    <label className="block text-sm font-medium text-gray-700">Programming Languages Known</label>
                    <Input
                        name="programmingLanguages"
                        value={data.programmingLanguages || ''}
                        onChange={onChange}
                        placeholder="e.g. Java, Python, C++, JavaScript"
                    />

                    <label className="block text-sm font-medium text-gray-700">Technical Skills</label>
                    <textarea
                        name="technicalSkills"
                        value={data.technicalSkills || ''}
                        onChange={onChange}
                        rows={3}
                        className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. Web Development, Data Analysis, Machine Learning"
                    />

                    <label className="block text-sm font-medium text-gray-700">Tools / Software Known</label>
                    <Input
                        name="tools"
                        value={data.tools || ''}
                        onChange={onChange}
                        placeholder="e.g. VS Code, Git, Figma, Docker"
                    />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <h3 className="font-medium text-gray-900 border-b pb-2">Certifications</h3>
                    <Input
                        label="Certifications Completed"
                        name="certifications"
                        value={data.certifications || ''}
                        onChange={onChange}
                        placeholder="List certification names"
                    />
                    <div className="flex items-center gap-4">
                        <Input
                            type="file"
                            label="Upload Proof (Optional)"
                            name="certProof"
                            onChange={onChange}
                            className="border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                    </div>
                </div>
            </div>

            {/* Internship Details Section (Merged) */}
            <div className="space-y-6">
                <h3 className="text-lg font-medium text-indigo-900">Internship Details</h3>
                <p className="text-sm text-gray-500 -mt-4">If you have completed any internships, please provide details below.</p>

                <div className="grid gap-6 md:grid-cols-2">
                    <Input
                        label="Company Name"
                        name="internshipCompany"
                        value={data.internshipCompany || ''}
                        onChange={onChange}
                    />
                    <Input
                        label="Internship Type"
                        name="internshipType"
                        value={data.internshipType || ''}
                        onChange={onChange}
                        placeholder="e.g. Summer Intern, Remote, Industrial Training"
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Input
                        label="Duration"
                        name="internshipDuration"
                        value={data.internshipDuration || ''}
                        onChange={onChange}
                        placeholder="e.g. 3 Months, June-Aug 2024"
                    />
                    <Input
                        label="Domain / Role"
                        name="internshipDomain"
                        value={data.internshipDomain || ''}
                        onChange={onChange}
                        placeholder="e.g. Web Dev, QA"
                    />
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">Proof of Completion</h3>
                    <Input
                        type="file"
                        label="Upload Internship Certificate"
                        name="internshipCert"
                        onChange={onChange}
                        className="border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                </div>
            </div>
        </div>
    );
};
