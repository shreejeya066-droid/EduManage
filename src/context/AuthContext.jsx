import { createContext, useContext, useState, useEffect } from 'react';
import { ALLOWED_ADMISSION_YEARS as DEFAULT_ALLOWED_YEARS } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allowedYears, setAllowedYears] = useState(DEFAULT_ALLOWED_YEARS);
    const [allUsers, setAllUsers] = useState([]);

    // Initial Load
    useEffect(() => {
        const storedUser = localStorage.getItem('app_user');
        if (storedUser) setUser(JSON.parse(storedUser));

        // Fetch Settings from DB
        fetchSettingsAsync();

        // Fetch Users (for Admin/Teacher views that rely on context cache)
        fetchAllUsers();

        setLoading(false);
    }, []);

    const fetchAllUsers = async () => {
        try {
            const { fetchStudents, fetchTeachers } = await import('../services/api');
            const [students, teachers] = await Promise.all([
                fetchStudents().catch(() => []),
                fetchTeachers().catch(() => [])
            ]);

            // Normalize data structures
            const sList = students.map(s => ({
                ...s,
                username: s.rollNumber,
                role: 'student',
                name: s.firstName ? `${s.firstName} ${s.lastName}` : s.rollNumber
            }));

            const tList = teachers.map(t => ({
                ...t,
                role: 'teacher'
            }));

            setAllUsers([...sList, ...tList]);
            // Cache for sync access if needed (optional)
            localStorage.setItem('all_users_cache', JSON.stringify([...sList, ...tList]));
        } catch (error) {
            console.error("Failed to fetch users for context", error);
        }
    };

    const fetchSettingsAsync = async () => {
        try {
            const { getSetting } = await import('../services/api');
            const years = await getSetting('allowed_years');
            if (years) {
                setAllowedYears(years);
                localStorage.setItem('allowed_years', JSON.stringify(years));
            } else {
                // Fallback
                const storedYears = localStorage.getItem('allowed_years');
                if (storedYears) setAllowedYears(JSON.parse(storedYears));
            }
        } catch (error) {
            // Fallback
            const storedYears = localStorage.getItem('allowed_years');
            if (storedYears) setAllowedYears(JSON.parse(storedYears));
        }
    };

    const updateAllowedYears = async (years) => {
        try {
            const { updateSetting } = await import('../services/api');
            // Optimistic Update
            setAllowedYears(years);
            localStorage.setItem('allowed_years', JSON.stringify(years));

            await updateSetting('allowed_years', years);
        } catch (error) {
            console.error("Failed to update settings", error);
        }
    };

    // Safe JSON parse helper
    const safeParse = (key, fallback) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : fallback;
        } catch (e) {
            return fallback;
        }
    };

    // --- User Management helpers ---
    const getAllUsers = () => {
        // Return in-memory state which is populated async
        // Fallback to cache if state is empty (e.g. valid refresh)
        if (allUsers.length === 0) {
            const cached = safeParse('all_users_cache', []);
            if (cached.length > 0) return cached;
        }
        return allUsers;
    };

    // checkUserStatus Removed - components should rely on login response or explicit check API
    const checkUserStatus = () => ({ exists: true }); // Dummy for avoiding crash in unmigrated components

    // --- ASYNC METHODS (MONGODB INTEGRATION) ---

    // 1. Student Login
    const loginStudentAsync = async (rollNumber, password) => {
        try {
            const { loginStudent } = await import('../services/api');
            const data = await loginStudent({ rollNumber, password });
            const sessionUser = { ...data, role: 'student' };
            setUser(sessionUser);
            localStorage.setItem('app_user', JSON.stringify(sessionUser));
            return { success: true, role: 'student', isFirstLogin: data.isFirstLogin };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // 2. Student Register (Create Password)
    const registerStudentAsync = async (rollNumber, password) => {
        try {
            const { registerStudent } = await import('../services/api');
            const data = await registerStudent({ rollNumber, password });
            const sessionUser = { ...data, role: 'student' };
            setUser(sessionUser);
            localStorage.setItem('app_user', JSON.stringify(sessionUser));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // 3. Update Student Profile
    const updateStudentProfileAsync = async (profileData) => {
        if (!user || !user.rollNumber) return { success: false, message: 'No student logged in' };
        try {
            const { updateStudentProfile } = await import('../services/api');
            const updatedUser = await updateStudentProfile(user.rollNumber, profileData);
            const sessionUser = { ...user, ...updatedUser };
            setUser(sessionUser);
            localStorage.setItem('app_user', JSON.stringify(sessionUser));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // 4. Admin Async Methods
    const loginAdminAsync = async (username, password) => {
        try {
            const { loginAdmin } = await import('../services/api');
            const data = await loginAdmin({ username, password });
            const sessionUser = { ...data, role: 'admin' };
            setUser(sessionUser);
            localStorage.setItem('app_user', JSON.stringify(sessionUser));
            return { success: true, role: 'admin' };
        } catch (error) {
            // Fallback to legacy login for now if DB fails or user not found in DB (migration phase)
            // But prefer DB.
            return { success: false, message: error.message };
        }
    };

    const registerAdminAsync = async (username, email, password) => {
        try {
            const { registerAdmin } = await import('../services/api');
            const data = await registerAdmin({ username, email, password });
            const sessionUser = { ...data, role: 'admin' };
            setUser(sessionUser);
            localStorage.setItem('app_user', JSON.stringify(sessionUser));
            return { success: true, role: 'admin' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const updateAdminProfileAsync = async (updates) => {
        if (!user || user.role !== 'admin') return { success: false, message: 'Not authorized' };
        try {
            const { updateAdminProfile } = await import('../services/api');
            const updatedUser = await updateAdminProfile(user._id, updates);
            // Note: user._id must exist. If legacy user, this might fail.

            const sessionUser = { ...user, ...updatedUser };
            setUser(sessionUser);
            localStorage.setItem('app_user', JSON.stringify(sessionUser));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };


    // --- Legacy Sync Methods (Deprecated) ---
    // --- Legacy Sync Methods (Deprecated) ---
    const login = async (username, password) => {
        // Redirect to async login
        return loginAdminAsync(username, password);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('app_user');
    };

    // --- Async Backend Integration (Teachers) ---
    const registerTeacherAsync = async (teacherData) => {
        try {
            const { registerTeacher } = await import('../services/api');
            const data = await registerTeacher(teacherData);
            const sessionUser = { ...data, role: 'teacher' };
            setUser(sessionUser);
            localStorage.setItem('app_user', JSON.stringify(sessionUser));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const loginTeacherAsync = async (email, password) => {
        try {
            const { loginTeacher } = await import('../services/api');
            const data = await loginTeacher({ email, password });
            // Fallback: If backend doesn't send flag, check against default password
            const isFirstLogin = data.isFirstLogin !== undefined ? data.isFirstLogin : (password === 'password123');
            const sessionUser = { ...data, role: 'teacher' };
            setUser(sessionUser);
            localStorage.setItem('app_user', JSON.stringify(sessionUser));
            return { success: true, role: 'teacher', isFirstLogin, isProfileComplete: data.isProfileComplete };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Placeholder Stubs for Sync methods to avoid crashes if UI still calls them
    const setupPassword = (username, password) => registerStudentAsync(username, password);
    const completeProfile = (data) => updateStudentProfileAsync(data);
    const requestProfileUpdate = () => console.log('Not implemented for DB yet');
    const getProfileRequests = () => [];
    const approveProfileRequest = () => { };
    const rejectProfileRequest = () => { };
    const registerStudent = () => { };
    const updateProfile = () => { };

    // Password Recovery Stubs
    const verifyEmail = () => ({ exists: false });
    const sendOTP = () => { };
    const verifyOTP = () => { };
    const resetPassword = () => { };
    const deleteUser = () => { };
    const getPendingRequest = () => { };

    // Admin Password Change Mock (for Profile)
    const changePassword = async (newPassword) => {
        if (user && user.role === 'admin' && user._id) {
            const res = await updateAdminProfileAsync({ password: newPassword });
            return res.success;
        }
        // Fallback for legacy
        return true;
    };


    return (
        <AuthContext.Provider value={{
            user, login, logout, loading,
            // Legacy / Admin
            checkUserStatus, getAllUsers, allowedYears, updateAllowedYears,
            // Async (DB) Student
            loginStudentAsync, registerStudentAsync, updateStudentProfileAsync,
            // Async (DB) Teacher
            registerTeacherAsync, loginTeacherAsync, setupTeacherPasswordAsync: async (username, password) => {
                try {
                    const { setupTeacherPassword } = await import('../services/api');
                    await setupTeacherPassword(username, password);
                    return { success: true };
                } catch (error) {
                    return { success: false, message: error.message };
                }
            },
            updateTeacherProfileAsync: async (profileData) => {
                // Ensure user is teacher and has ID
                if (!user || user.role !== 'teacher') return { success: false, message: 'Not authorized' };
                try {
                    const { updateTeacherProfile } = await import('../services/api');
                    // Check if user has _id or id
                    const id = user._id || user.id;
                    if (!id) return { success: false, message: 'User ID missing' };

                    const updatedUser = await updateTeacherProfile(id, profileData);
                    const sessionUser = { ...user, ...updatedUser };
                    setUser(sessionUser);
                    localStorage.setItem('app_user', JSON.stringify(sessionUser));
                    return { success: true };
                } catch (error) {
                    return { success: false, message: error.message };
                }
            },
            // Async (DB) Admin
            loginAdminAsync, registerAdminAsync, updateAdminProfileAsync, changePassword,
            refreshUsers: fetchAllUsers,

            // Compatibility / Deprecated Stubs
            setupPassword, completeProfile, registerStudent, updateProfile,
            requestProfileUpdate, getProfileRequests, approveProfileRequest, rejectProfileRequest, getPendingRequest,
            verifyEmail, sendOTP, verifyOTP, resetPassword, deleteUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
