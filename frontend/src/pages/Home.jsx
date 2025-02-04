import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (loggedInUser && token) {
      setUser(loggedInUser.name);
      fetchCategories(token);
    } else {
      setUser(null);
    }
  }, []);

  const fetchCategories = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data.categories);
    } catch (error) {
      setError(error.response ? error.response.data.message : "Failed to fetch categories.");
      console.error(error);
    }
  };

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
        setNewCategoryName("");
        fetchCategories(token);
      } catch (error) {
        setError(error.response ? error.response.data.message : "Failed to add category.");
        console.error(error);
      }
    } else {
      setError("Please provide a category name.");
    }
  };

  const deleteCategory = async (categoryName) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete("http://localhost:5000/api/categories/remove", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { categoryName },
      });
      fetchCategories(token);
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

      <div className="mb-6">
        <h3 className="text-xl font-semibold">Your Categories:</h3>
        <div className="flex flex-wrap gap-4">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.name}
                className="relative p-4 bg-blue-200 rounded-lg shadow-md cursor-pointer hover:bg-blue-500 hover:text-white"
                onClick={() => navigate(`/category/${category.name}`)}
              >
                <h4 className="font-semibold">{category.name}</h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
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
