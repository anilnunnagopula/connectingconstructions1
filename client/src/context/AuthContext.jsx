// context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user object from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Ensure parsedUser and parsedUser.token exist
        if (parsedUser && parsedUser.token) {
          // Correctly set the user object, including roles and currentSelectedRole
          setUser({
            id: parsedUser.userId, // Assuming userId is Firebase UID or MongoDB _id
            name: parsedUser.name,
            email: parsedUser.email,
            roles: parsedUser.roles || [], // Ensure roles is an array, even if missing
            currentSelectedRole: parsedUser.currentSelectedRole || null, // Ensure this is set
            token: parsedUser.token,
          });
          setIsAuthenticated(true);
        } else {
          // If user data exists but no token, clear it
          localStorage.removeItem("user");
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem("user"); // Clear potentially corrupted data
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsAuthLoading(false); // Auth check is complete
    }
  }, []);

  // Login function to be called from Login.jsx
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    // When setting user in context, ensure it matches the structure expected by consumers
    setUser({
      id: userData.userId, // Assuming userId is Firebase UID or MongoDB _id
      name: userData.name,
      email: userData.email,
      roles: userData.roles || [],
      currentSelectedRole: userData.currentSelectedRole || null,
      token: userData.token,
    });
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login"); // Redirect to login page on logout
  };

  // Helper to get user roles
  const getUserRoles = () => user?.roles || [];

  // Helper to check if user has a specific role
  const hasRole = (role) => getUserRoles().includes(role);

  // Value provided to consumers of this context
  const value = {
    user, // This user object will now correctly contain roles and currentSelectedRole
    isAuthenticated,
    isAuthLoading,
    login,
    logout,
    getUserRoles,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for easy consumption of AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
