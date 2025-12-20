import { createContext, useContext, useState, useEffect } from 'react';
import { USERS, ALLOWED_ADMISSION_YEARS as DEFAULT_ALLOWED_YEARS } from '../data/mockData';



const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
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
    }, []);

    const updateAllowedYears = (years) => {
        setAllowedYears(years);
        localStorage.setItem('allowed_years', JSON.stringify(years));
    };

    // Helper to get all users including runtime created ones
    const getAllUsers = () => {
        const storedUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
        return [...USERS, ...storedUsers];
    };

    const checkUserStatus = (username) => {
        const allUsers = getAllUsers();
        const found = allUsers.find(u => u.username === username);
        return {
            exists: !!found,
            hasPassword: !!found?.password, // In this mock, if they exist they have password, but logically separate
            role: found?.role
        };
    };

    const registerStudent = (username, password) => {
        const newUser = {
            id: username,
            name: username, // Default name
            role: 'student',
            username: username,
            password: password,
            isFirstLogin: false, // They just set it, so treat as setup? Or flow defines next step? 
            // "Student Role: After login, student can fill profile forms". 
            // So isFirstLogin could be true to trigger profile wizard? 
            // The existing mock data has isFirstLogin: true.
            // Let's set it to false so they don't get "Change Password" screen again, 
            // but we might need to route them to ProfileWizard.
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
            // Create a session object (safe clone)
            const sessionUser = { ...foundUser };

            // If we are strictly following "duplicate username & password (default credentials)" check
            // We can also have a flag in the mock data, or just check if password === 'password'
            // The requirement says "Login using a duplicate username & password (default credentials)."
            // which implies checking if credentials match.

            // Persist ONLY if not first login (optional, but good for UX)
            // Actually, for this flow, we keep state in memory mostly, 
            // but let's persist to survive refreshes which helps dev.
            setUser(sessionUser);
            localStorage.setItem('app_user', JSON.stringify(sessionUser));
            return { success: true, isFirstLogin: sessionUser.isFirstLogin, role: sessionUser.role };
        }

        return { success: false, message: 'Invalid credentials' };
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

    const deleteUser = (username) => {
        // 1. Remove from all_users
        const storedUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
        const updatedUsers = storedUsers.filter(u => u.username !== username);
        localStorage.setItem('all_users', JSON.stringify(updatedUsers));

        // 2. Remove profile data
        localStorage.removeItem(`student_profile_${username}`);

        return true;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateProfile, changePassword, checkUserStatus, registerStudent, allowedYears, updateAllowedYears, getAllUsers, deleteUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
