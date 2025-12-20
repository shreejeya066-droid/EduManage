import React from 'react';
import { Input } from '../../../components/ui/Input';

export const Step7Career = ({ data, onChange }) => {
    return (
        <div className="space-y-6">
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700">Are you planning for Higher Studies?</label>
                <div className="flex items-center gap-6 mt-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="higherStudies"
                            value="Yes"
                            checked={data.higherStudies === 'Yes'}
                            onChange={onChange}
                            className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="higherStudies"
                            value="No"
                            checked={data.higherStudies === 'No'}
                            onChange={onChange}
                            className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>No</span>
                    </label>
                </div>
                {data.higherStudies === 'Yes' && (
                    <Input
                        label="Details (Year/Course/Exam)"
                        name="higherStudiesDetails"
                        value={data.higherStudiesDetails || ''}
                        onChange={onChange}
                        placeholder="e.g. Planning for GATE 2026"
                    />
                )}
            </div>

            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700">Willing to attend Placement Drives?</label>
                <div className="flex items-center gap-6 mt-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="placementWillingness"
                            value="Yes"
                            checked={data.placementWillingness === 'Yes'}
                            onChange={onChange}
                            className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="placementWillingness"
                            value="No"
                            checked={data.placementWillingness === 'No'}
                            onChange={onChange}
                            className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>No</span>
                    </label>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Input
                    label="Interested Domain"
                    name="interestedDomain"
                    value={data.interestedDomain || ''}
                    onChange={onChange}
                    placeholder="e.g. Software Engineering, Consulting"
                />
                <Input
                    label="Preferred Job Location"
                    name="prefLocation"
                    value={data.prefLocation || ''}
                    onChange={onChange}
                    placeholder="e.g. Bangalore, Pune, Remote"
                />
            </div>

            <div className="mt-8 p-4 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                <p><strong>Note:</strong> By clicking Submit, you declare that all the above information is true to the best of your knowledge.</p>
            </div>
        </div>
    );
};
