import React, { useState, useEffect } from 'react';
import { registerTeacher, fetchTeachers } from '../../services/api';

export const TeacherDBDemo = () => {
    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        department: '',
        subject: ''
    });
    const [message, setMessage] = useState('');

    const loadTeachers = async () => {
        try {
            const data = await fetchTeachers();
            setTeachers(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadTeachers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerTeacher(formData);
            setMessage('Teacher registered directly to MongoDB!');
            setFormData({ name: '', email: '', password: '', department: '', subject: '' });
            loadTeachers();
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-6 text-indigo-900 text-center">MongoDB Teacher Storage Demo</h1>

            <div className="max-w-4xl mx-auto">
                {/* List */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Teachers in MongoDB</h2>
                    <div className="space-y-4">
                        {teachers.length === 0 ? <p>No teachers found in DB.</p> : teachers.map(t => (
                            <div key={t._id} className="p-3 border rounded bg-gray-50 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-lg">{t.name}</p>
                                    <p className="text-sm text-gray-600">{t.department} • {t.email}</p>
                                    <p className="text-xs text-gray-400">Subjects: {t.subjects ? t.subjects.join(', ') : t.subject}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400">ID: {t._id}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${t.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {t.isApproved ? 'Approved' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
