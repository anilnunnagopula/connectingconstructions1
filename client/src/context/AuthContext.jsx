// context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // user state will now directly reflect the object stored in localStorage/received from backend
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        const parsedUser = JSON.parse(storedUser);

        // Ensure parsedUser and parsedUser.token exist and it's a valid structure
        // The structure from backend/Login.jsx is: { _id, name, email, role, username, token }
        if (
          parsedUser &&
          parsedUser.token &&
          parsedUser._id &&
          parsedUser.role
        ) {
          setUser({
            _id: parsedUser._id, // Use _id as provided by backend/localStorage
            name: parsedUser.name,
            email: parsedUser.email,
            role: parsedUser.role, // Use 'role' as a string, as provided by backend
            username: parsedUser.username,
            token: parsedUser.token,
          });
          setIsAuthenticated(true);
        } else {
          // If user data exists but is incomplete/invalid, clear it
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
    // userData is expected to be the object received from backend login:
    // { _id, name, email, role, username, token }
    localStorage.setItem("user", JSON.stringify(userData));

    // Directly set the user object from userData, which should match the backend response
    setUser({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      username: userData.username,
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

  // Helper to get user role (now a single string)
  // This replaces getUserRoles and hasRole for simplicity as role is a single string
  const getUserRole = () => user?.role || null;

  // Value provided to consumers of this context
  const value = {
    user, // This user object will now consistently contain _id, name, email, role (string), username, token
    isAuthenticated,
    isAuthLoading,
    login,
    logout,
    getUserRole, // Provide the new helper
    // hasRole is no longer needed as role is a single string, directly check user.role === 'supplier' etc.
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
