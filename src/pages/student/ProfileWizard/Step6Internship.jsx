import React from 'react';
import { Input } from '../../../components/ui/Input';

export const Step6Internship = ({ data, onChange }) => {
    return (
        <div className="space-y-6">
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

            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-4">Proof of Completion</h3>
                <Input
                    type="file"
                    label="Upload Internship Certificate"
                    name="internshipCert"
                    className="border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
            </div>
        </div>
    );
};
