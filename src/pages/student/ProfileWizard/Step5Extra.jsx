import React, { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { Plus, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const Step5Extra = ({ data, onChange }) => {
    const [currentHobby, setCurrentHobby] = useState('');

    const handleAddHobby = () => {
        if (!currentHobby.trim()) return;

        // Check if hobby already exists
        const currentHobbies = Array.isArray(data.hobbies) ? data.hobbies : [];
        if (currentHobbies.includes(currentHobby.trim())) {
            alert('This hobby is already added!');
            return;
        }

        const newHobbies = [...currentHobbies, currentHobby.trim()];
        onChange({
            target: {
                name: 'hobbies',
                value: newHobbies
            }
        });
        setCurrentHobby('');
    };

    const handleRemoveHobby = (hobbyToRemove) => {
        const currentHobbies = Array.isArray(data.hobbies) ? data.hobbies : [];
        const newHobbies = currentHobbies.filter(hobby => hobby !== hobbyToRemove);
        onChange({
            target: {
                name: 'hobbies',
                value: newHobbies
            }
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddHobby();
        }
    };

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
                <label className="block text-sm font-medium text-gray-700">Hobbies & Interests</label>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <Input
                            name="hobby_input"
                            value={currentHobby}
                            onChange={(e) => setCurrentHobby(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a hobby and press correct button"
                            className="mb-0" // Override default margin if any
                        />
                    </div>
                    <Button
                        type="button"
                        onClick={handleAddHobby}
                        className="mt-0" // Align with input
                        size="icon"
                    >
                        <Plus className="h-5 w-5" />
                        <span className="sr-only">Add Hobby</span>
                    </Button>
                </div>

                {/* Hobbies List */}
                <div className="flex flex-wrap gap-2 mt-3">
                    {Array.isArray(data.hobbies) && data.hobbies.map((hobby, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                        >
                            {hobby}
                            <button
                                type="button"
                                onClick={() => handleRemoveHobby(hobby)}
                                className="ml-2 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-600 hover:bg-indigo-200 hover:text-indigo-900 focus:outline-none"
                            >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remove {hobby}</span>
                            </button>
                        </span>
                    ))}
                    {(!data.hobbies || data.hobbies.length === 0) && (
                        <p className="text-sm text-gray-400 italic">No hobbies added yet.</p>
                    )}
                </div>
            </div>

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
