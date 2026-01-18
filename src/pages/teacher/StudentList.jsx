import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentList = () => {
    const { getAllUsers, refreshUsers } = useAuth(); // Use shared data source
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    // Ensure data is fresh when viewing the list
    React.useEffect(() => {
        if (refreshUsers) refreshUsers();
    }, []);

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
        let year = student.yearOfStudy;
        let section = student.section;

        // Fallback or specific parsers
        if (!year && student.semester) {
            year = Math.ceil(student.semester / 2);
        }

        // If simple number/string, use it. If needed to parse from old formats:
        if (typeof year === 'string') {
            const match = year.match(/(\d+)/);
            if (match) year = parseInt(match[0]);
        }

        // SECTION CHECK:
        // Some students might have section directly or nested? Schema has 'section' at top level?
        // Let's check studentModel... 
        // studentModel DOES NOT have 'section' in the schema I just wrote! 
        // It has 'department', 'yearOfStudy', 'semester', 'course', 'rollNumber'.
        // It DOES NOT have 'section'. 
        // Wait, 'section' was in the mocked data or Wizard?
        // WizardContainer: `section: '',` in formData state.
        // BUT studentModel schema update I did in Step 263... lines 25+.
        // Let's look... `course`, `department`, `yearOfStudy`, `semester`. NO `section`.
        // So `section` won't be saved to DB unless I add it to Schema.
        // However, user just wants "year/profile details". 
        // I will use 'department' as secondary info if section is missing.

        const dept = student.department;

        if (!year && !dept) return 'N/A';

        // Format Year to "Ist", "IInd" style
        const formatYear = (y) => {
            if (!y) return '';
            const num = parseInt(y);
            if (isNaN(num)) return y;
            if (num === 1) return 'I (1st)';
            if (num === 2) return 'II (2nd)';
            if (num === 3) return 'III (3rd)';
            if (num === 4) return 'IV (4th)';
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
