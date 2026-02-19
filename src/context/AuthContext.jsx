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
    const [user, setUser] = useState(null);

    const isAuthenticated = () => {
        return user !== null;
    };

    const login = (username, password, role = "regular") => {
        const mockToken = `mock_jwt_token_${Date.now()}`;

        const userData = {
            username: username,
            role: role,
            token: mockToken
        };

        setUser(userData);

        localStorage.setItem("authToken", mockToken);

        return userData;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("authToken");
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
