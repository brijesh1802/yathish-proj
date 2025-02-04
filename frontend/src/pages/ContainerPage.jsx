// import { useParams } from "react-router-dom";
// import { useState, useEffect } from "react";

// export default function ContainerPage() {
//   const { id } = useParams(); // Get the ID from the URL
//   const storageKey = `todos-${id}`; // Use the ID to load todos specific to this list
//   const [todos, setTodos] = useState([]);
//   const [newTodo, setNewTodo] = useState(""); // State to handle the new task input
//   const [editIndex, setEditIndex] = useState(null); // State to track which task is being edited
//   const [editedTodo, setEditedTodo] = useState(""); // State for the edited task value

//   // Load saved tasks for this specific ID from localStorage when the component mounts
//   useEffect(() => {
//     console.log("Fetching Todos for ID:", id); // Debugging line
//     const savedTodos = JSON.parse(localStorage.getItem(storageKey)) || [];
//     setTodos(savedTodos);
//   }, [id]); // Re-fetch todos if the id changes

//   // Save tasks to localStorage whenever they change
//   useEffect(() => {
//     if (todos.length > 0) {
//       console.log("Saving Todos:", todos); // Debugging line
//       localStorage.setItem(storageKey, JSON.stringify(todos));
//     }
//   }, [todos, storageKey]);

//   const addTodo = () => {
//     if (newTodo.trim()) {
//       const updatedTodos = [...todos, newTodo];
//       setTodos(updatedTodos);
//       setNewTodo(""); // Clear the input field after adding
//     }
//   };

//   const startEdit = (index) => {
//     setEditIndex(index);
//     setEditedTodo(todos[index]);
//   };

//   const saveEdit = () => {
//     if (editedTodo.trim()) {
//       const updatedTodos = [...todos];
//       updatedTodos[editIndex] = editedTodo;
//       setTodos(updatedTodos);
//       setEditIndex(null);
//       setEditedTodo(""); // Clear editedTodo state after saving
//     }
//   };

//   const cancelEdit = () => {
//     setEditIndex(null);
//     setEditedTodo(""); // Clear editedTodo state if edit is canceled
//   };

//   const deleteTodo = (index) => {
//     const updatedTodos = todos.filter((_, i) => i !== index);
//     setTodos(updatedTodos);
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-100">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center">
//           <input
//             type="text"
//             value={newTodo}
//             onChange={(e) => setNewTodo(e.target.value)}
//             placeholder="Enter a new task"
//             className="p-2 mr-2 border rounded"
//           />
//           <button
//             onClick={addTodo}
//             className="px-4 py-2 text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600"
//           >
//             + Add Task
//           </button>
//         </div>
//       </div>

//       <ul className="p-6 bg-white rounded-lg shadow-md">
//         {todos.length === 0 ? (
//           <p className="text-gray-500">No tasks added yet.</p>
//         ) : (
//           todos.map((todo, index) => (
//             <li
//               key={index}
//               className="flex items-center justify-between py-3 border-b"
//             >
//               {editIndex === index ? (
//                 <div className="flex items-center space-x-3">
//                   <input
//                     type="text"
//                     value={editedTodo}
//                     onChange={(e) => setEditedTodo(e.target.value)}
//                     className="p-2 border rounded"
//                   />
//                   <button
//                     onClick={saveEdit}
//                     className="px-3 py-1 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={cancelEdit}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-between w-full">
//                   <span>{todo}</span>
//                   <div className="space-x-3">
//                     <button
//                       onClick={() => startEdit(index)}
//                       className="text-blue-500 hover:text-blue-700"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => deleteTodo(index)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </li>
//           ))
//         )}
//       </ul>
//     </div>
//   );
// }


import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ContainerPage() {
  const { id } = useParams(); // Category name from the URL
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editedTodo, setEditedTodo] = useState("");
  const token = localStorage.getItem("token");



  // Fetch category items from the server
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/items/get", {
          params: { categoryName: id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setTodos(response.data.items);
      } catch (error) {
        console.error("Error fetching items:", error.response?.data || error);
      }
    };
    fetchItems();
  }, [id]);

  // Add a new task
  const addTodo = async () => {
    if (newTodo.trim()) {
      try {
        await axios.post("http://localhost:5000/api/items/add", {
          categoryName: id,
          item: newTodo,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTodos([...todos, newTodo]);
        setNewTodo("");
      } catch (error) {
        console.error("Error adding item:", error.response?.data || error);
      }
    }
  };

  // Delete a task
  const deleteTodo = async (index) => {
    const itemToDelete = todos[index];
    try {
      await axios.delete("http://localhost:5000/api/items/remove", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          categoryName: id,
          item: itemToDelete,
        },
      });
      setTodos(todos.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting item:", error.response?.data || error);
    }
  };
  

  // Start editing a task
  const startEdit = (index) => {
    setEditIndex(index);
    setEditedTodo(todos[index]);
  };

  // Save the edited task
  const saveEdit = async () => {
    if (editedTodo.trim()) {
      try {
        await deleteTodo(editIndex); // Remove the old item
        await axios.post("http://localhost:5000/api/items/add", {
          categoryName: id,
          item: editedTodo,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const updatedTodos = [...todos];
        updatedTodos[editIndex] = editedTodo;
        setTodos(updatedTodos);
        setEditIndex(null);
        setEditedTodo("");
      } catch (error) {
        console.error("Error updating item:", error.response?.data || error);
      }
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditIndex(null);
    setEditedTodo("");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter a new task"
            className="p-2 mr-2 border rounded"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600"
          >
            + Add Task
          </button>
        </div>
      </div>

      <ul className="p-6 bg-white rounded-lg shadow-md">
        {todos.length === 0 ? (
          <p className="text-gray-500">No tasks added yet.</p>
        ) : (
          todos.map((todo, index) => (
            <li
              key={index}
              className="flex items-center justify-between py-3 border-b"
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
                    className="px-3 py-1 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600"
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
                <div className="flex items-center justify-between w-full">
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
