import React from 'react';
import { Input } from '../../../components/ui/Input';

export const Step2Contact = ({ data, onChange }) => {

    const handlePhoneChange = (e) => {
        const { name, value } = e.target;
        // Allow only numbers and max 10 chars
        // Optionally we can allow empty string to let them delete
        if (value === '' || (/^\d+$/.test(value) && value.length <= 10)) {
            onChange(e);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <Input
                    label="Mobile Number"
                    name="mobile"
                    value={data.mobile}
                    onChange={handlePhoneChange}
                    placeholder="10-digit Mobile Number"
                    required
                    maxLength={10}
                />
                <Input
                    label="Alternate Mobile (Parent)"
                    name="altMobile"
                    value={data.altMobile}
                    onChange={handlePhoneChange}
                    placeholder="10-digit Mobile Number"
                    maxLength={10}
                />
            </div>

            <Input label="Email Address" type="email" name="email" value={data.email} onChange={onChange} required />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
                <textarea
                    name="address"
                    value={data.address}
                    onChange={onChange}
                    rows={4}
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Full address including Pincode"
                />
            </div>
        </div>
    );
};
