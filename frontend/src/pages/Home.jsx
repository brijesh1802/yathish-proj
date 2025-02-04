// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const HomePage = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [toDoLists, setToDoLists] = useState([]);
//   const [newListName, setNewListName] = useState(""); // New state for the input field

//   useEffect(() => {
//     const loggedInUser = JSON.parse(localStorage.getItem("user"));
//     if (loggedInUser) {
//       setUser(loggedInUser.name);
//     }

//     const storedLists = JSON.parse(localStorage.getItem("toDoLists")) || [];
//     setToDoLists(storedLists);
//   }, []);

//   const addContainer = () => {
//     if (newListName.trim()) {
//       const newList = { id: Date.now(), title: newListName };
//       const updatedLists = [...toDoLists, newList];
//       setToDoLists(updatedLists);
//       localStorage.setItem("toDoLists", JSON.stringify(updatedLists));
//       setNewListName(""); // Clear input field after adding
//     } else {
//       alert("Please enter a valid name for the container!");
//     }
//   };

//   const deleteContainer = (id) => {
//     const updatedLists = toDoLists.filter((list) => list.id !== id);
//     setToDoLists(updatedLists);
//     localStorage.setItem("toDoLists", JSON.stringify(updatedLists));
//   };

//   if (!user) {
//     return (
//       <h1 className="mt-10 text-2xl font-semibold text-center">
//         Hello User, Please Register & Login
//       </h1>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center min-h-screen p-10">
//       <h2 className="mb-4 text-2xl font-bold">Welcome, {user}!</h2>

//       {/* Input for container name */}
//       <div className="flex items-center mb-6">
//         <input
//           type="text"
//           value={newListName}
//           onChange={(e) => setNewListName(e.target.value)}
//           placeholder="Enter list name"
//           className="p-2 mr-2 border rounded"
//         />
//         <button
//           onClick={addContainer}
//           className="px-4 py-2 text-white bg-green-500 rounded shadow"
//         >
//           + Add Container
//         </button>
//       </div>

//       <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
//         {toDoLists.map((list) => (
//           <div
//             key={list.id}
//             onClick={() => navigate(`/todo/${list.id}`)}
//             className="relative p-4 bg-white rounded-lg shadow-md cursor-pointer w-60 hover:bg-blue-500 hover:text-white"
//           >
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 deleteContainer(list.id);
//               }}
//               className="absolute font-bold text-red-500 top-2 right-2"
//             >
//               X
//             </button>
//             <h3 className="text-lg font-semibold">{list.title}</h3>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);  // State for categories
  const [newCategoryName, setNewCategoryName] = useState(""); // State for new category input
  const [error, setError] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (loggedInUser && token) {
      setUser(loggedInUser.name);
      fetchCategories(token);  // Fetch categories for the logged-in user
    } else {
      setUser(null);
    }
  }, []);

  // Fetch categories from the backend
  const fetchCategories = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data.categories);  // Update state with fetched categories
    } catch (error) {
      setError(error.response ? error.response.data.message : "Failed to fetch categories.");
      console.error(error);
    }
  };

  // Add a new category
  const addCategory = async () => {
    const token = localStorage.getItem("token");
    if (newCategoryName.trim()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/categories/add",
          { categoryName: newCategoryName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNewCategoryName(""); // Clear input field after adding
        fetchCategories(token);  // Re-fetch categories to include the new one
      } catch (error) {
        setError(error.response ? error.response.data.message : "Failed to add category.");
        console.error(error);
      }
    } else {
      setError("Please provide a category name.");
    }
  };

  // Delete a category
  const deleteCategory = async (categoryName) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete("http://localhost:5000/api/categories/remove", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { categoryName },
      });
      fetchCategories(token);  // Re-fetch categories after deletion
    } catch (error) {
      setError(error.response ? error.response.data.message : "Failed to delete category.");
      console.error(error);
    }
  };

  if (!user) {
    return (
      <h1 className="mt-10 text-2xl font-semibold text-center">
        Hello User, Please Register & Login
      </h1>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-10">
      <h2 className="mb-4 text-2xl font-bold">Welcome, {user}!</h2>

      {/* Add Category Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Add a New Category:</h3>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex items-center gap-4 mb-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name"
            className="p-2 border rounded"
          />
          <button
            onClick={addCategory}
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Your Categories:</h3>
        <div className="flex flex-wrap gap-4">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.name}
                className="relative p-4 bg-blue-200 rounded-lg shadow-md cursor-pointer hover:bg-blue-500 hover:text-white"
                onClick={() => navigate(`/category/${category.name}`)}  // Navigate to the category page
              >
                <h4 className="font-semibold">{category.name}</h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation();  // Prevent category navigation when clicking delete
                    deleteCategory(category.name);
                  }}
                  className="absolute text-red-500 top-2 right-2 hover:text-red-700"
                >
                  X
                </button>
              </div>
            ))
          ) : (
            <p>No categories found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
