import axios from "axios";
import { createContext, useEffect, useState } from "react";

axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    const login = async (inputs) => {
        const res = await axios.post("/api/login", inputs);
        setCurrentUser(res.data.userInfo);
    };

    const logout = async (inputs) => {
        await axios.post("/api/logout");
        setCurrentUser(null);
    };

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
