import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { USERS } from '../../data/mockData';
import { Search, Filter } from 'lucide-react';

export const StudentList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    // Filter only students from mock data
    let students = USERS.filter(user => user.role === 'student');

    // Handle Search
    if (searchTerm) {
        students = students.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Handle Sort
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    if (sortConfig.key) {
        students.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }

    // Helper for sort arrow
    const getSortIcon = (name) => {
        if (sortConfig.key !== name) return "↕";
        return sortConfig.direction === 'ascending' ? "↑" : "↓";
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Student List</h2>
                <div className="flex items-center gap-2">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            className="pl-9"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="sm" className="hidden sm:flex">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                </div>
            </div>

            <Card>
                <Table headers={[
                    <div onClick={() => handleSort('name')} className="cursor-pointer font-bold select-none">Name {getSortIcon('name')}</div>,
                    <div onClick={() => handleSort('username')} className="cursor-pointer font-bold select-none">Username {getSortIcon('username')}</div>,
                    <div onClick={() => handleSort('grade')} className="cursor-pointer font-bold select-none">Grade {getSortIcon('grade')}</div>,
                    <div onClick={() => handleSort('attendance')} className="cursor-pointer font-bold select-none">Attendance {getSortIcon('attendance')}</div>,
                    "Actions"
                ]}>
                    {students.length > 0 ? (
                        students.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell className="font-medium">{student.name}</TableCell>
                                <TableCell>{student.username}</TableCell>
                                <TableCell>{student.grade}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.attendance >= 90 ? 'bg-green-100 text-green-800' :
                                            student.attendance >= 75 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {student.attendance}%
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="sm" className="text-indigo-600">View Details</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan="5" className="text-center py-8 text-gray-500">
                                No students found matching your search.
                            </TableCell>
                        </TableRow>
                    )}
                </Table>
            </Card>
        </div>
    );
};
