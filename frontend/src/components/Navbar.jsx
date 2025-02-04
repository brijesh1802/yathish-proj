import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between p-4 text-white bg-blue-500">
      <h1 className="text-lg font-bold">MyApp</h1>

      <div>
        {user ? (
          <>
            <span className="mr-4">Welcome, {user.name}!</span>
            <button onClick={logout} className="px-4 py-1 bg-red-500 rounded">
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
