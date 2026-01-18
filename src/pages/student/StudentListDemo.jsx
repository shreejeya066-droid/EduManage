import React, { useEffect, useState } from 'react';
import { fetchStudents } from '../../services/api';

export const StudentListDemo = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadStudents = async () => {
            try {
                const data = await fetchStudents();
                setStudents(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadStudents();
    }, []);

    if (loading) return <div className="p-4 text-center">Loading students from backend...</div>;
    if (error) return <div className="p-4 text-red-500 text-center">Error connecting to backend: {error}</div>;

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-6 text-indigo-900 text-center">Connected Student List</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {students.map((student) => (
                    <div key={student.id} className="p-6 rounded-xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800">{student.name}</h2>
                            <span className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full">ID: {student.id}</span>
                        </div>
                        <div className="space-y-2 text-gray-600">
                            <p><span className="font-semibold">Department:</span> {student.department}</p>
                            <p><span className="font-semibold">Year:</span> {student.year}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
