import React from 'react';
import { Input } from '../../../components/ui/Input';

export const Step1Personal = ({ data, onChange }) => {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Input label="First Name" name="firstName" value={data.firstName} onChange={onChange} required />
            <Input label="Last Name" name="lastName" value={data.lastName} onChange={onChange} required />

            <Input label="Father's Name" name="fatherName" value={data.fatherName} onChange={onChange} />
            <Input label="Mother's Name" name="motherName" value={data.motherName} onChange={onChange} />

            <Input label="Date of Birth" type="date" name="dob" value={data.dob} onChange={onChange} />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                    name="gender"
                    value={data.gender}
                    onChange={onChange}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>

            <Input label="Blood Group" name="bloodGroup" value={data.bloodGroup} onChange={onChange} placeholder="e.g. O+" />
            <Input label="Nationality" name="nationality" value={data.nationality} onChange={onChange} />

            <Input label="Religion" name="religion" value={data.religion} onChange={onChange} />
        </div>
    );
};
