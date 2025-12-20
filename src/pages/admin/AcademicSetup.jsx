import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Trash2, Edit2, BookOpen, Layers } from 'lucide-react';

const SimpleTable = ({ columns, data, onDelete }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
            <thead>
                <tr className="border-b bg-gray-50/50">
                    {columns.map((col, idx) => (
                        <th key={idx} className="p-4 font-medium text-gray-500">{col}</th>
                    ))}
                    <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, idx) => (
                    <tr key={item.id || idx} className="border-b last:border-0 hover:bg-gray-50/50">
                        {Object.values(item).slice(1).map((val, vIdx) => ( // Skip ID
                            <td key={vIdx} className="p-4 text-gray-900">{val}</td>
                        ))}
                        <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button onClick={() => onDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export const AcademicSetup = () => {
    const [activeTab, setActiveTab] = useState('departments');

    // Mock Data
    const [departments, setDepartments] = useState([
        { id: 1, name: 'Computer Science', code: 'CSE', head: 'Dr. Smith' },
        { id: 2, name: 'Electronics', code: 'ECE', head: 'Prof. Jones' },
    ]);

    const [subjects, setSubjects] = useState([
        { id: 1, name: 'Mathematics I', code: 'MAT101', dept: 'Science' },
        { id: 2, name: 'Data Structures', code: 'CS201', dept: 'CSE' },
    ]);

    const handleDelete = (id, type) => {
        if (type === 'dept') setDepartments(depts => depts.filter(d => d.id !== id));
        else setSubjects(subs => subs.filter(s => s.id !== id));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Academic Structure</h1>
                <p className="text-gray-500">Manage departments, subjects, and academic configurations.</p>
            </div>

            <div className="flex gap-4 border-b">
                <button
                    onClick={() => setActiveTab('departments')}
                    className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'departments'
                            ? 'border-purple-600 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Layers className="h-4 w-4" />
                    Departments
                </button>
                <button
                    onClick={() => setActiveTab('subjects')}
                    className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'subjects'
                            ? 'border-purple-600 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <BookOpen className="h-4 w-4" />
                    Subjects
                </button>
            </div>

            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {activeTab === 'departments' ? 'Department List' : 'Subject List'}
                    </h2>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New {activeTab === 'departments' ? 'Department' : 'Subject'}
                    </Button>
                </div>

                {activeTab === 'departments' ? (
                    <SimpleTable
                        columns={['Department Name', 'Code', 'Head of Dept']}
                        data={departments}
                        onDelete={(id) => handleDelete(id, 'dept')}
                    />
                ) : (
                    <SimpleTable
                        columns={['Subject Name', 'Code', 'Department']}
                        data={subjects}
                        onDelete={(id) => handleDelete(id, 'subj')}
                    />
                )}
            </Card>
        </div>
    );
};
