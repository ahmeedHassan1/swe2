"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        
        if (res.status === 403 || res.status === 401) {
             throw new Error("Invalid email or password. Please try again.");
        }

        try {
           const errorData = JSON.parse(text);
           throw new Error(errorData.message || "Login failed");
        } catch (e) {
           throw new Error("Server error. Please try again later.");
        }
      }

      const data = await res.json();
      
      const { token, role, name, userId } = data; // JSON key is userId

      localStorage.setItem("token", token);
      
      let userData = { email, role, name, id: userId };

      // Fetch Employee Details if role is EMPLOYEE (or even ADMIN if they are also an employee)
      if (userId) {
          try {
             // We need to use the token we just got
             const empRes = await fetch(`/api/employees/by-user/${userId}`, {
                headers: { "Authorization": `Bearer ${token}` }
             });
             if (empRes.ok) {
                 const empData = await empRes.json();
                 // Merge employeeId (String) and employeeTableId (Long)
                 userData = { 
                    ...userData, 
                    employeeId: empData.employeeId, // EMP123
                    employeeTableId: empData.id     // Primary Key
                 };
             }
          } catch (e) {
             console.warn("Failed to fetch employee profile", e);
          }
      }
      
      localStorage.setItem("user", JSON.stringify(userData));
      
      setUser(userData);
      router.push("/dashboard");
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
