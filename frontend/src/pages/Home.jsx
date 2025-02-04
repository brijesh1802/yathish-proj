import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [toDoLists, setToDoLists] = useState([]);
  const [newListName, setNewListName] = useState(""); // New state for the input field

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("registeredUser"));
    if (loggedInUser) {
      setUser(loggedInUser.username);
    }

    const storedLists = JSON.parse(localStorage.getItem("toDoLists")) || [];
    setToDoLists(storedLists);
  }, []);

  const addContainer = () => {
    if (newListName.trim()) {
      const newList = { id: Date.now(), title: newListName };
      const updatedLists = [...toDoLists, newList];
      setToDoLists(updatedLists);
      localStorage.setItem("toDoLists", JSON.stringify(updatedLists));
      setNewListName(""); // Clear input field after adding
    } else {
      alert("Please enter a valid name for the container!");
    }
  };

  const deleteContainer = (id) => {
    const updatedLists = toDoLists.filter((list) => list.id !== id);
    setToDoLists(updatedLists);
    localStorage.setItem("toDoLists", JSON.stringify(updatedLists));
  };

  if (!user) {
    return (
      <h1 className="text-center mt-10 text-2xl font-semibold">
        Hello User, Please Register & Login
      </h1>
    );
  }

  return (
    <div className="min-h-screen p-10 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user}!</h2>

      {/* Input for container name */}
      <div className="flex items-center mb-6">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Enter list name"
          className="p-2 border rounded mr-2"
        />
        <button
          onClick={addContainer}
          className="bg-green-500 text-white px-4 py-2 rounded shadow"
        >
          + Add Container
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {toDoLists.map((list) => (
          <div
            key={list.id}
            onClick={() => navigate(`/todo/${list.id}`)}
            className="w-60 p-4 bg-white rounded-lg shadow-md relative cursor-pointer hover:bg-blue-500 hover:text-white"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteContainer(list.id);
              }}
              className="absolute top-2 right-2 text-red-500 font-bold"
            >
              X
            </button>
            <h3 className="text-lg font-semibold">{list.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
