import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    const isAuthenticated = () => {
        return user !== null;
    };

    const login = (username, password, role = "regular") => {
        const userData = {
            username: username,
            role: role
        };

        setUser(userData);

        localStorage.setItem("user", JSON.stringify(userData));

        return userData;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    const isAdmin = () => {
        return user?.role === "admin";
    };

    const value = {
        user,
        isAuthenticated,
        login,
        logout,
        isAdmin
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
