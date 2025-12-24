export const USERS = [
    {
        id: 'ADMIN_001',
        name: 'System Admin',
        role: 'admin',
        username: 'admin',
        password: 'password', // Default
        isFirstLogin: true,
    },
    {
        id: 'TEACHER_001',
        name: 'Sarah Wilson',
        role: 'teacher',
        username: 'teacher',
        password: 'password',
        department: 'Computer Science',
        isFirstLogin: false,
    },
    {
        id: 'TEACHER_002',
        name: 'John Doe',
        role: 'teacher',
        username: 'math_teacher',
        password: 'password',
        department: 'Mathematics',
        isFirstLogin: false,
    },
    {
        id: 'TEACHER_003',
        name: 'Emily Davis',
        role: 'teacher',
        username: 'physics_teacher',
        password: 'password',
        department: 'Physics',
        isFirstLogin: false,
    },
    {
        id: 'STUDENT_001',
        name: 'Michael Chen',
        role: 'student',
        username: 'student',
        password: 'password',
        department: 'Computer Science',
        year: '2023',
        isFirstLogin: false,
    }
];

export const ALLOWED_ADMISSION_YEARS = ['19BIT', '20BIT', '21BIT', '22BIT', '23BIT', '25BIT'];

// Mock Analytics Data for Teachers
export const ANALYTICS_DATA = {
    performance: [
        { name: 'Alice', Math: 85, Physics: 78, English: 90 },
        { name: 'Bob', Math: 60, Physics: 65, English: 70 },
        { name: 'Charlie', Math: 92, Physics: 88, English: 85 },
    ],
    attendanceDistribution: [
        { name: 'High (>90%)', value: 30 },
        { name: 'Medium (75-90%)', value: 50 },
        { name: 'Low (<75%)', value: 20 },
    ],
};
