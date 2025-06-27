import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import baseUrl from '../../utils/baseUrl'; // adjust path accordingly
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
    const token = Cookies.get("token");

  // On mount, check authentication by calling backend
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.post(`${baseUrl}/auth/verifToken`,   { token },
          { withCredentials: true }
        );
        if (res.data.user) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Update context after login - no token handling here
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Logout by calling backend to clear cookie and clearing state
  const logout = async () => {
    try {
      await axios.post(`${baseUrl}/auth/logout`, {}, { withCredentials: true });
    } catch (e) {
      // ignore errors
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
