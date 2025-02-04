import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ContainerPage() {
  const { id } = useParams(); // Get the ID from the URL
  const storageKey = `todos-${id}`; // Use the ID to load todos specific to this list
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState(""); // State to handle the new task input
  const [editIndex, setEditIndex] = useState(null); // State to track which task is being edited
  const [editedTodo, setEditedTodo] = useState(""); // State for the edited task value

  // Load saved tasks for this specific ID from localStorage when the component mounts
  useEffect(() => {
    console.log("Fetching Todos for ID:", id); // Debugging line
    const savedTodos = JSON.parse(localStorage.getItem(storageKey)) || [];
    setTodos(savedTodos);
  }, [id]); // Re-fetch todos if the id changes

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (todos.length > 0) {
      console.log("Saving Todos:", todos); // Debugging line
      localStorage.setItem(storageKey, JSON.stringify(todos));
    }
  }, [todos, storageKey]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      setNewTodo(""); // Clear the input field after adding
    }
  };

  const startEdit = (index) => {
    setEditIndex(index);
    setEditedTodo(todos[index]);
  };

  const saveEdit = () => {
    if (editedTodo.trim()) {
      const updatedTodos = [...todos];
      updatedTodos[editIndex] = editedTodo;
      setTodos(updatedTodos);
      setEditIndex(null);
      setEditedTodo(""); // Clear editedTodo state after saving
    }
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditedTodo(""); // Clear editedTodo state if edit is canceled
  };

  const deleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter a new task"
            className="p-2 border rounded mr-2"
          />
          <button
            onClick={addTodo}
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
          >
            + Add Task
          </button>
        </div>
      </div>

      <ul className="bg-white p-6 rounded-lg shadow-md">
        {todos.length === 0 ? (
          <p className="text-gray-500">No tasks added yet.</p>
        ) : (
          todos.map((todo, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b py-3"
            >
              {editIndex === index ? (
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={editedTodo}
                    onChange={(e) => setEditedTodo(e.target.value)}
                    className="p-2 border rounded"
                  />
                  <button
                    onClick={saveEdit}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center w-full">
                  <span>{todo}</span>
                  <div className="space-x-3">
                    <button
                      onClick={() => startEdit(index)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
