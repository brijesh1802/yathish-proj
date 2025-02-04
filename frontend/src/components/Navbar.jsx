import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="p-4 bg-blue-500 text-white flex justify-between">
      <h1 className="text-lg font-bold">MyApp</h1>

      <div>
        {user ? (
          <>
            <span className="mr-4">Welcome, {user.username}!</span>
            <button onClick={logout} className="bg-red-500 px-4 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">
              Login
            </Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
