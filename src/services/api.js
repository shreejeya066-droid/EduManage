const API_BASE_URL = 'http://localhost:5000/api';

export const fetchStudents = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/students`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};

export const fetchAnalytics = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/students/analytics`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching analytics:', error);
        throw error;
    }
};

// Student API Calls
export const loginStudent = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/students/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');
        return data;
    } catch (error) { throw error; }
};

export const checkStudentStatus = async (rollNumber) => {
    try {
        const response = await fetch(`${API_BASE_URL}/students/check-status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rollNumber }),
        });
        const data = await response.json();
        // Return { exists: boolean, hasPassword: boolean }
        return data;
    } catch (error) { throw error; }
};

export const registerStudent = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/students/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');
        return data;
    } catch (error) { throw error; }
};

export const fetchStudentProfile = async (rollNumber) => {
    try {
        const response = await fetch(`${API_BASE_URL}/students/${rollNumber}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
        return data;
    } catch (error) { throw error; }
};

export const updateStudentProfile = async (rollNumber, profileData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/students/${rollNumber}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Update failed');
        return data;
    } catch (error) { throw error; }
};

// Teacher API Calls
export const checkTeacherStatus = async (username) => {
    try {
        const response = await fetch(`${API_BASE_URL}/teachers/check-status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: username }),
        });
        const data = await response.json();
        return data; // { exists, hasPassword }
    } catch (error) { throw error; }
};

export const setupTeacherPassword = async (username, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/teachers/setup-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: username, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Setup failed');
        return data;
    } catch (error) { throw error; }
};

export const registerTeacher = async (teacherData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/teachers/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(teacherData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }
        return data; // Returns the created teacher object
    } catch (error) {
        throw error;
    }
};

export const loginTeacher = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/teachers/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');
        return data;
    } catch (error) { throw error; }
};

export const fetchTeachers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/teachers`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching teachers:', error);
        throw error;
    }
};

export const updateTeacherProfile = async (id, profileData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Update failed');
        return data;
    } catch (error) { throw error; }
};

// Admin API Calls
export const loginAdmin = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');
        return data;
    } catch (error) { throw error; }
};

export const registerAdmin = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');
        return data;
    } catch (error) { throw error; }
};

export const updateAdminProfile = async (id, updates) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Update failed');
        return data;
    } catch (error) { throw error; }
};

// System Settings API Calls
export const getSetting = async (key) => {
    try {
        const response = await fetch(`${API_BASE_URL}/settings/${key}`);
        // If 404, we might perform a fallback here, but controller handles defaults for some keys
        // If controller returns default, response.ok is true
        if (!response.ok) {
            if (response.status === 404) return null; // Or default
            throw new Error('Failed to fetch setting');
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching setting ${key}:`, error);
        throw error;
    }
};

export const updateSetting = async (key, value) => {
    try {
        const response = await fetch(`${API_BASE_URL}/settings/${key}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Update failed');
        return data;
    } catch (error) { throw error; }
};

export const deleteStudent = async (rollNumber) => {
    try {
        const response = await fetch(`${API_BASE_URL}/students/${rollNumber}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Delete failed');
        return data;
    } catch (error) { throw error; }
};

export const deleteTeacher = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Delete failed');
        return data;
    } catch (error) { throw error; }
};

export const naturalLanguageQuery = async (queryText) => {
    try {
        const response = await fetch(`${API_BASE_URL}/students/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: queryText }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Query failed');
        return data;
    } catch (error) { throw error; }
};
