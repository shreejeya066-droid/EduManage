import React from 'react';
import { Input } from '../../../components/ui/Input';

export const Step5Extra = ({ data, onChange }) => {
    return (
        <div className="space-y-6">
            <Input
                label="Sports Participation"
                name="sports"
                value={data.sports || ''}
                onChange={onChange}
                placeholder="e.g. College Cricket Team, District Level Badminton"
            />

            <Input
                label="NSS / NCC / Clubs"
                name="clubs"
                value={data.clubs || ''}
                onChange={onChange}
                placeholder="e.g. NSS Volunteer, Robotics Club Member"
            />

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Achievements & Awards</label>
                <textarea
                    name="achievements"
                    value={data.achievements || ''}
                    onChange={onChange}
                    rows={3}
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Describe any significant awards or recognitions"
                />
            </div>

            <Input
                label="Events Participated"
                name="events"
                value={data.events || ''}
                onChange={onChange}
                placeholder="e.g. Hackathons, Paper Presentations"
            />

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Other Activities (Optional)</label>
                <textarea
                    name="otherActivities"
                    value={data.otherActivities || ''}
                    onChange={onChange}
                    rows={2}
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
        </div>
    );
};
