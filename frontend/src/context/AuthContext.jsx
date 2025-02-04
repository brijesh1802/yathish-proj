// import { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(() => {
//     // Get user from localStorage on initial load
//     return JSON.parse(localStorage.getItem("loggedInUser")) || null;
//   });

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
//     if (storedUser) {
//       setUser(storedUser);
//     }
//   }, []);

//   const login = (userData) => {
//     localStorage.setItem("loggedInUser", JSON.stringify(userData)); // Save user
//     setUser(userData);
//     navigate("/"); // Redirect to homepage
//   };

//   const logout = () => {
//     localStorage.removeItem("loggedInUser"); // Remove user
//     setUser(null);
//     navigate("/login"); // Redirect to login
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    return storedUser ? storedUser : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const loggedInUser = response.data.user;
        const authToken = response.data.token;

        // Store user data and token in localStorage
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        localStorage.setItem("token", authToken);

        // Update context
        setUser(loggedInUser);
        setToken(authToken);
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid email or password");
      throw error; // Rethrow error to handle it in the Login component
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
