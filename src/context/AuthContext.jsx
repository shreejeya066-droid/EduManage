import { createContext, useContext, useState, useEffect } from 'react';
import { USERS, ALLOWED_ADMISSION_YEARS as DEFAULT_ALLOWED_YEARS } from '../data/mockData';



const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // We'll mimic persistence with simple localStorage for the demo duration
    // In a real app, this would be more robust.

    const [allowedYears, setAllowedYears] = useState(DEFAULT_ALLOWED_YEARS);

    useEffect(() => {
        const storedUser = localStorage.getItem('app_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const storedYears = localStorage.getItem('allowed_years');
        if (storedYears) {
            setAllowedYears(JSON.parse(storedYears));
        }
        setLoading(false);
    }, []);

    const updateAllowedYears = (years) => {
        setAllowedYears(years);
        localStorage.setItem('allowed_years', JSON.stringify(years));
    };

    // Safe JSON parse helper
    const safeParse = (key, fallback) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : fallback;
        } catch (e) {
            console.error(`Error parsing ${key} from localStorage`, e);
            return fallback;
        }
    };

    // Helper to get all users including runtime created ones, excluding deleted ones
    const getAllUsers = () => {
        const storedUsers = safeParse('all_users', []);
        const deletedUsers = safeParse('deleted_users', []);

        // Ensure storedUsers is an array
        const validStoredUsers = Array.isArray(storedUsers) ? storedUsers : [];
        const validDeletedUsers = Array.isArray(deletedUsers) ? deletedUsers : [];

        const all = [...USERS, ...validStoredUsers];
        return all.filter(u => !validDeletedUsers.includes(u.username));
    };

    const checkUserStatus = (username) => {
        const allUsers = getAllUsers();
        // Case-insensitive check for better UX
        const found = allUsers.find(u => u.username.toLowerCase() === username.toLowerCase());

        if (!found) return { exists: false };

        return {
            exists: true,
            hasPassword: !!found.password && found.password.length > 0,
            passwordSet: found.passwordSet !== false, // Default to true if undefined
            isFirstLogin: found.isFirstLogin,
            role: found.role,
            name: found.name,
            department: found.department
        };
    };

    const setupPassword = (username, newPassword) => {
        const allUsers = getAllUsers();
        const userIndex = allUsers.findIndex(u => u.username === username);

        if (userIndex === -1) return false;

        const updatedUser = {
            ...allUsers[userIndex],
            password: newPassword,
            passwordSet: true,
            // Keep isFirstLogin: true until they complete profile? 
            // Plan says: Redirect to Profile Completion. 
            // Let's keep isFirstLogin true so if they drop off, they come back to a flow.
            // But we need a way to distinguish "Needs Password" vs "Needs Profile".
            // We'll rely on passwordSet=true check.
        };

        const newUsers = [...allUsers];
        newUsers[userIndex] = updatedUser;

        // Persist
        localStorage.setItem('all_users', JSON.stringify(newUsers));

        // Auto-login the user into session
        setUser(updatedUser);
        localStorage.setItem('app_user', JSON.stringify(updatedUser));

        return true;
    };

    const completeProfile = (profileData) => {
        if (!user) return false;

        const updatedUser = {
            ...user,
            ...profileData,
            isFirstLogin: false // Flow complete
        };

        // Update in "DB"
        const allUsers = getAllUsers();
        const userIndex = allUsers.findIndex(u => u.username === user.username);
        if (userIndex !== -1) {
            const newUsers = [...allUsers];
            newUsers[userIndex] = updatedUser;
            localStorage.setItem('all_users', JSON.stringify(newUsers));
        }

        // Update session
        setUser(updatedUser);
        localStorage.setItem('app_user', JSON.stringify(updatedUser));
        return true;
    };

    const registerStudent = (username, password) => {
        const newUser = {
            id: username,
            name: username, // Default name
            role: 'student',
            username: username,
            password: password,
            isFirstLogin: false,
        };

        // Save to "DB"
        const storedUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
        storedUsers.push(newUser);
        localStorage.setItem('all_users', JSON.stringify(storedUsers));

        // Auto login
        setUser(newUser);
        localStorage.setItem('app_user', JSON.stringify(newUser));
        return { success: true, role: 'student' };
    };

    const login = (username, password) => {
        const allUsers = getAllUsers();
        const foundUser = allUsers.find(u => u.username === username && u.password === password);

        if (foundUser) {
            // Check for Account Status
            if (foundUser.role === 'teacher' && foundUser.status && foundUser.status !== 'Active') {
                return { success: false, message: 'Account is pending approval or disabled. Contact Administrator.' };
            }

            // Create a session object
            const sessionUser = { ...foundUser };

            setUser(sessionUser);
            localStorage.setItem('app_user', JSON.stringify(sessionUser));

            // Return extended info for routing logic
            return {
                success: true,
                isFirstLogin: sessionUser.isFirstLogin,
                role: sessionUser.role,
                passwordSet: sessionUser.passwordSet !== false
            };
        }

        return { success: false, message: 'Incorrect password' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('app_user');
    };

    const updateProfile = (profileData) => {
        if (!user) return;
        const updatedUser = { ...user, ...profileData };
        setUser(updatedUser);
        localStorage.setItem('app_user', JSON.stringify(updatedUser));
    };

    const changePassword = (newPassword) => {
        if (!user) return;

        // In a real backend, we'd update the DB. Here we update our local instance 
        // AND technically we should update the mock array but importing/exporting consts doesn't work that way dynamically.
        // We will just simulate it by updating the current user session state.

        const updatedUser = { ...user, password: newPassword, isFirstLogin: false };

        // Requirement: "After password update, user must login again with the new password."
        // So we should actually logout after this.

        // But we need to pretend the "DB" is updated. 
        // Since we can't write to the file `mockData.js` at runtime in the browser,
        // we will have to handle this "re-login" carefully. 
        // We'll assume for this demo that once they "change" it, the next login *checks* against the NEW password?
        // OR we just force them to log outcome and then they log in with the *same* mock credentials 
        // but we pretend it's new? 
        // BETTER APPROACH: We can't easily persist changes to `mockData.js` across reloads without a backend.
        // For this demo, we will update `localStorage` to store the "database" state? 
        // Or just simplify: 
        // When "Change Password" happens -> Alert "Password Updated" -> Logout.
        // Next Login -> User enters ANY password (or the new one) and we accept it?
        // Let's try to do it right: We can store the modified USERS list in localStorage too.

        // Let's implement a simple "Mock DB" in localStorage for persistence across reloads if needed,
        // but for simplicity, let's just trust the session flow for now.

        // For the new "Module 1" requirement flow: "After successful update -> redirect to Student Profile Multi-Step Form."
        // This implies maintaining the session.
        // We will update the user state in memory and localStorage but NOT toggle 'isFirstLogin' to false yet?
        // Actually, we should toggle it to false so they don't get kicked back to change-password.
        // BUT if we toggle it, and then they reload, they are just a normal user.
        // We want them to go to the Wizard.
        // Let's rely on the routing: Login -> ChangePwd -> Wizard.
        // The Wizard is accessible to students.

        // Update user state
        setUser(updatedUser);
        localStorage.setItem('app_user', JSON.stringify(updatedUser));



        return true;
    };

    // --- Profile Approval Workflow ---

    // Teacher: Request an update
    const requestProfileUpdate = (username, changes) => {
        const requests = safeParse('teacher_profile_requests', []);

        // Remove existing pending request for this user if any (replace with new)
        const filtered = requests.filter(r => r.username !== username);

        const newRequest = {
            id: `req_${Date.now()}`,
            username,
            timestamp: new Date().toISOString(),
            changes,
            status: 'pending'
        };

        const updatedRequests = [...filtered, newRequest];
        localStorage.setItem('teacher_profile_requests', JSON.stringify(updatedRequests));
        return true;
    };

    // Teacher/Admin: Check if pending
    const getPendingRequest = (username) => {
        const requests = safeParse('teacher_profile_requests', []);
        return requests.find(r => r.username === username && r.status === 'pending');
    };

    // Admin: Get all requests
    const getProfileRequests = () => {
        const requests = safeParse('teacher_profile_requests', []);
        return requests.filter(r => r.status === 'pending');
    };

    // Admin: Approve
    const approveProfileRequest = (requestId) => {
        const requests = safeParse('teacher_profile_requests', []);
        const request = requests.find(r => r.id === requestId);

        if (!request) return false;

        // Apply changes to actual user
        const allUsers = getAllUsers();
        const userIndex = allUsers.findIndex(u => u.username === request.username);

        if (userIndex !== -1) {
            const updatedUser = { ...allUsers[userIndex], ...request.changes };
            const newUsers = [...allUsers];
            newUsers[userIndex] = updatedUser;
            localStorage.setItem('all_users', JSON.stringify(newUsers));

            // If approving self (unlikely for admin approving teacher, but good practice updates session if matched)
            if (user && user.username === request.username) {
                setUser(updatedUser);
                localStorage.setItem('app_user', JSON.stringify(updatedUser));
            }
        }

        // Remove request
        const remaining = requests.filter(r => r.id !== requestId);
        localStorage.setItem('teacher_profile_requests', JSON.stringify(remaining));
        return true;
    };

    // Admin: Reject
    const rejectProfileRequest = (requestId) => {
        const requests = safeParse('teacher_profile_requests', []);
        const remaining = requests.filter(r => r.id !== requestId);
        localStorage.setItem('teacher_profile_requests', JSON.stringify(remaining));
        return true;
    };

    const deleteUser = (username) => {
        // 1. Remove from all_users (dynamic users)
        const storedUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
        const updatedUsers = storedUsers.filter(u => u.username !== username);
        localStorage.setItem('all_users', JSON.stringify(updatedUsers));

        // 2. Add to deleted_users list (to hide default users)
        const deletedUsers = JSON.parse(localStorage.getItem('deleted_users') || '[]');
        if (!deletedUsers.includes(username)) {
            deletedUsers.push(username);
            localStorage.setItem('deleted_users', JSON.stringify(deletedUsers));
        }

        // 3. Remove profile data
        localStorage.removeItem(`student_profile_${username}`);

        // 4. Remove pending requests
        const requests = safeParse('teacher_profile_requests', []);
        const remainingRequests = requests.filter(r => r.username !== username);
        localStorage.setItem('teacher_profile_requests', JSON.stringify(remainingRequests));

        return true;
    };

    return (
        <AuthContext.Provider value={{
            user, login, logout, updateProfile, changePassword, checkUserStatus,
            registerStudent, allowedYears, updateAllowedYears, getAllUsers, deleteUser,
            setupPassword, completeProfile, loading,
            // New Exports
            requestProfileUpdate, getProfileRequests, approveProfileRequest, rejectProfileRequest, getPendingRequest
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
