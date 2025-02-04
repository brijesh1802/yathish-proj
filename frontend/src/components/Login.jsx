// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { Link } from "react-router-dom";
// const Login = () => {
//   const { login } = useAuth();
//   const [formData, setFormData] = useState({ email: "", password: "" });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Get registered user data from localStorage
//     const storedUser = JSON.parse(localStorage.getItem("registeredUser"));

//     if (
//       storedUser &&
//       storedUser.email === formData.email &&
//       storedUser.password === formData.password
//     ) {
//       login(storedUser); // Store user in context
//     } else {
//       alert("Invalid email or password");
//     }
//   };

//   return (
//     <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-lg shadow-md w-80"
//       >
//         <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//           className="w-full p-2 border rounded mb-2"
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//           className="w-full p-2 border rounded mb-2"
//         />

//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white p-2 rounded-md"
//         >
//           Login
//         </button>

//         <p className="text-sm text-center mt-4">
//           Dont have a account?{" "}
//           <Link to="/register" className="text-blue-500 hover:underline">
//             Register
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Use AuthContext
import axios from "axios"; // Import axios for API requests

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Auth context to store logged-in user data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      // Call the login function from context, passing email and password
      await login(formData.email, formData.password);

      // If successful, navigate to home page
      navigate("/home");
    } catch (error) {
      setLoading(false);
      alert("Login failed! Please try again");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-xl font-semibold text-center mb-4">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;

