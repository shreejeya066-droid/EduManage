import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentList = () => {
    const { getAllUsers, refreshUsers } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    // Ensure data is fresh
    React.useEffect(() => {
        if (refreshUsers) refreshUsers();
    }, []);

    const allUsers = getAllUsers();
    let students = allUsers.filter(user => user.role === 'student');

    // --- Filters ---
    if (filterDept) {
        students = students.filter(s => s.department === filterDept);
    }
    if (filterYear) {
        // Strict match or loose match depending on data quality
        students = students.filter(s => s.yearOfStudy && s.yearOfStudy.toString() === filterYear);
    }

    // --- Search ---
    if (searchTerm) {
        students = students.filter(student =>
            (student.name && student.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (student.username && student.username.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }

    // --- Sort ---
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    if (sortConfig.key) {
        students.sort((a, b) => {
            const valA = a[sortConfig.key] || '';
            const valB = b[sortConfig.key] || '';
            if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
    }

    const getSortIcon = (name) => {
        if (sortConfig.key !== name) return "↕";
        return sortConfig.direction === 'ascending' ? "↑" : "↓";
    };

    const getStudentYearSection = (student) => {
        let year = student.yearOfStudy;
        const dept = student.department;

        if (!year && student.semester) year = Math.ceil(student.semester / 2);
        if (typeof year === 'string') {
            const match = year.match(/(\d+)/);
            if (match) year = parseInt(match[0]);
        }

        const formatYear = (y) => {
            if (!y) return '';
            const num = parseInt(y);
            if (isNaN(num)) return y;
            if (num === 1) return 'I (1st)';
            if (num === 2) return 'II (2nd)';
            if (num === 3) return 'III (3rd)';
            return `${num}th`;
        };

        const yearStr = formatYear(year);
        if (yearStr && dept) return `${yearStr} Year - ${dept}`;
        if (yearStr) return `${yearStr} Year`;
        if (dept) return dept;
        return 'N/A';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Student Directory</h2>
                    <p className="text-gray-500 mt-1">Manage and view all registered students.</p>
                </div>
            </div>

            {/* Main List Filters */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Text */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            className="pl-9"
                            placeholder="Search by Name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Department Filter */}
                    <div className="w-full md:w-48">
                        <select
                            className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={filterDept}
                            onChange={(e) => setFilterDept(e.target.value)}
                        >
                            <option value="">All Departments</option>
                            <option value="CSE">CSE</option>
                            <option value="IT">IT</option>
                            <option value="ECE">ECE</option>
                            <option value="EEE">EEE</option>
                            <option value="MECH">MECH</option>
                        </select>
                    </div>

                    {/* Year Filter */}
                    <div className="w-full md:w-40">
                        <select
                            className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                        >
                            <option value="">All Years</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>

                    {/* Clear Filters */}
                    {(searchTerm || filterDept || filterYear) && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setSearchTerm('');
                                setFilterDept('');
                                setFilterYear('');
                            }}
                            className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            Clear
                        </Button>
                    )}
                </div>
            </Card>

            <Card>
                <Table headers={[
                    <div onClick={() => handleSort('username')} className="cursor-pointer font-bold select-none hover:text-indigo-600">Student ID {getSortIcon('username')}</div>,
                    <div onClick={() => handleSort('name')} className="cursor-pointer font-bold select-none hover:text-indigo-600">Name {getSortIcon('name')}</div>,
                    <div onClick={() => handleSort('year')} className="cursor-pointer font-bold select-none hover:text-indigo-600">Year / Section {getSortIcon('year')}</div>,
                    "Actions"
                ]}>
                    {students.length > 0 ? (
                        students.map((student) => (
                            <TableRow key={student.id || student.username}>
                                <TableCell className="font-mono text-gray-600">{student.username}</TableCell>
                                <TableCell className="font-medium text-gray-900">{student.name || 'Unknown Name'}</TableCell>
                                <TableCell>{getStudentYearSection(student)}</TableCell>
                                <TableCell>
                                    <Link to={`/teacher/students/${student.username}`}>
                                        <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50">
                                            View Profile
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan="4" className="text-center py-12 text-gray-500">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="bg-gray-100 p-3 rounded-full mb-3">
                                        <Filter className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <p className="text-lg font-medium text-gray-900">No students found</p>
                                    <p className="text-sm text-gray-500">Try adjusting your filters.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </Table>
            </Card>
        </div>
    );
};
