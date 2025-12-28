import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentList = () => {
    const { getAllUsers } = useAuth(); // Use shared data source
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    // Fetch all users and filter for students
    // This ensures we get specific students added via Admin/Student Portal
    const allUsers = getAllUsers();
    let students = allUsers.filter(user => user.role === 'student');

    // Handle Search
    if (searchTerm) {
        students = students.filter(student =>
            (student.name && student.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
            // Handle potentially missing values safely
            const valA = a[sortConfig.key] || '';
            const valB = b[sortConfig.key] || '';

            if (valA < valB) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (valA > valB) {
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

    // Helper to get Year/Section display (e.g. "Ist - A")
    const getStudentYearSection = (student) => {
        let year = null;
        let section = null;

        // Try to determine year from multiple sources
        if (student.grade) {
            // If grade is like "10th", "12th", or just "1"
            const num = parseInt(student.grade);
            if (!isNaN(num)) year = num;
        }

        // Try profile data for more accurate "Current Year", "Year of Study", or "Semester"
        try {
            const profile = localStorage.getItem(`student_profile_${student.username}`);
            if (profile) {
                const data = JSON.parse(profile);

                // Check yearOfStudy first as per requirement
                if (data.yearOfStudy) {
                    const match = data.yearOfStudy.match(/(\d+)/); // Extract first number "3rd" -> 3
                    if (match) year = parseInt(match[0]);
                }
                else if (data.currentYear) year = data.currentYear;
                else if (data.semester) year = Math.ceil(data.semester / 2);

                if (data.section) section = data.section;
            }
        } catch (e) {
            // ignore
        }

        if (!year && !section) return 'N/A';

        // Format Year to "Ist", "IInd" style or return as is if not convertible
        const formatYear = (y) => {
            if (!y) return '';
            const num = parseInt(y);
            if (isNaN(num)) return y;
            if (num === 1) return 'Ist';
            if (num === 2) return 'IInd';
            if (num === 3) return 'IIIrd';
            if (num === 4) return 'IVth';
            return `${num}th`;
        };

        const yearStr = formatYear(year);

        if (yearStr && section) return `${yearStr} - ${section}`;
        if (yearStr) return yearStr;
        if (section) return `Section ${section}`;

        return 'N/A';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Student List</h2>
                    <p className="text-gray-500 mt-1">View all registered students. Data is read-only.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            className="pl-9"
                            placeholder="Search by Name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

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
                                        <Search className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <p className="text-lg font-medium text-gray-900">No students found</p>
                                    <p className="text-sm text-gray-500">Try adjusting your search terms.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </Table>
            </Card>
        </div>
    );
};
