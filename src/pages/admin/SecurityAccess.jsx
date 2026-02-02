import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ShieldAlert, Unlock, Settings, AlertTriangle, Calendar, Plus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';


export const SecurityAccess = () => {
    const { allowedYears, updateAllowedYears } = useAuth();
    const [newYear, setNewYear] = useState('');
    // Mock OTP Config
    const [otpConfig, setOtpConfig] = useState({
        expiry: 5,
        maxAttempts: 3
    });
    const [yearError, setYearError] = useState('');




    const handleAddYear = () => {
        setYearError('');
        if (!newYear) return;

        // Validate format XXBIT
        if (!/^\d{2}BIT$/.test(newYear)) {
            setYearError('Format must be XXBIT (e.g. 25BIT)');
            return;
        }

        if (allowedYears.includes(newYear)) {
            setYearError('Year already exists');
            return;
        }

        updateAllowedYears([...allowedYears, newYear].sort());
        setNewYear('');
    };

    const handleRemoveYear = (year) => {
        updateAllowedYears(allowedYears.filter(y => y !== year));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Security & Access Control</h1>
                <p className="text-gray-500">Manage system security, locked accounts, and authentication rules.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">


                {/* OTP Configuration Section */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Settings className="h-6 w-6" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Authentication Rules</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-gray-700">OTP Expiry Time (minutes)</label>
                                <span className="text-sm font-bold text-gray-900">{otpConfig.expiry} min</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="15"
                                value={otpConfig.expiry}
                                onChange={(e) => setOtpConfig({ ...otpConfig, expiry: e.target.value })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-gray-700">Max OTP Attempts</label>
                                <span className="text-sm font-bold text-gray-900">{otpConfig.maxAttempts}</span>
                            </div>
                            <div className="flex gap-2">
                                {[3, 5, 10].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setOtpConfig({ ...otpConfig, maxAttempts: val })}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md border ${otpConfig.maxAttempts === val
                                            ? 'bg-purple-100 border-purple-500 text-purple-700'
                                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-100">
                            <p className="font-semibold mb-1">Note:</p>
                            <p>Admins cannot view OTPs. Configure policies carefully to balance security and usability.</p>
                        </div>
                    </div>
                </Card>

                {/* Admission Config Section */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Allowed Admission Years</h2>
                            <p className="text-sm text-gray-500">Only students with roll numbers starting with these years can log in.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {allowedYears.map((year) => (
                                <div key={year} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-gray-700 font-medium text-sm border border-gray-200">
                                    {year}
                                    <button
                                        onClick={() => handleRemoveYear(year)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                        title="Remove Year"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-start gap-4 max-w-md">
                            <div className="flex-1">
                                <Input
                                    placeholder="e.g. 26BIT"
                                    value={newYear}
                                    onChange={(e) => {
                                        setNewYear(e.target.value.toUpperCase());
                                        setYearError('');
                                    }}
                                />
                                {yearError && <p className="text-xs text-red-500 mt-1">{yearError}</p>}
                            </div>
                            <Button onClick={handleAddYear} className="whitespace-nowrap">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Year
                            </Button>
                        </div>

                        <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-100 flex gap-2">
                            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                            <p>Adding a new year (e.g., <strong>25BIT</strong>) immediately allows students with roll numbers like <strong>25BIT01</strong> to log in. They will be prompted to create a password on their first login.</p>
                        </div>
                    </div>
                </Card>

            </div>
        </div>
    );
};
