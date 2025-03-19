import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [credits, setCredits] = useState(0);
    const [loading, setLoading] = useState(true);
    const api = import.meta.env.VITE_BACKEND_URL;

    // ✅ Load User & Credits from API when app starts
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = Cookies.get("token");
                if (!token) return;

                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(`${api}/users/credits`, config);
                
                setUser(response.data.name);
                setCredits(response.data.credits);
            } catch (error) {
                console.error("Error loading user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // ✅ Login Function
    const login = async (credentials) => {
        try {
            const response = await axios.post(`${api}/users/login`, credentials);
            
            if (response.data.success === false) {
                return response.data;
            }

            const { token } = response.data;
            if (!token) throw new Error("Token not found");

            Cookies.set("token", token, { expires: 7, path: "/" });
            const {user} = response.data 
            
            setUser(user.name);
            setCredits(user.creditBalance);
            return response.data;
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    };

    // ✅ Logout Function
    const logout = () => {
        Cookies.remove("token");
        setUser(null);
        sessionStorage.clear();
        localStorage.clear();
        toast.success("Logout Successfully")
    };

    // ✅ Update Credits after Payment
    const updateCredits = (newCredits) => {
        setCredits(newCredits);
    };

    return (
        <AuthContext.Provider value={{ user, credits, loading, login, logout, updateCredits }}>
            {children}
        </AuthContext.Provider>
    );
};
