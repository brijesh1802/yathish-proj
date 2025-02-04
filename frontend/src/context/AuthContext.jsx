import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    // Get user from localStorage on initial load
    return JSON.parse(localStorage.getItem("loggedInUser")) || null;
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("loggedInUser", JSON.stringify(userData)); // Save user
    setUser(userData);
    navigate("/"); // Redirect to homepage
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser"); // Remove user
    setUser(null);
    navigate("/login"); // Redirect to login
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
