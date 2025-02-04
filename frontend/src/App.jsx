import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./pages/Home";
import { Navigate } from "react-router-dom";
import ContainerPage from "./pages/ContainerPage";
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />

          {/* Define Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/todo/:id" element={<ContainerPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
