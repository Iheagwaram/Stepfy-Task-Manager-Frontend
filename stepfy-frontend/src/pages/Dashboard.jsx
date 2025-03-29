import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const resUser = await axios.get(`${API_BASE_URL}/tasks`, 
            { headers: { "x-auth-token": token } 
        });

        setUser(resUser.data.user);

        const resTasks = await axios.get(`${API_BASE_URL}/tasks`, { 
            headers: { "x-auth-token": token } 
        });

        setTasks(resTasks.data);
      } catch (err) {
        console.error("Failed to fetch data", err.response.data);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserAndTasks();
  }, [navigate]);

  // Add a new task
  const handleAddTask = async () => {
    const token = localStorage.getItem("token");
    if (!taskTitle.trim()) return;

    try {
      const res = await axios.post(
        `${API_BASE_URL}/tasks`,
        { title: taskTitle, category: taskCategory },
        { headers: { "x-auth-token": token } }
      );

      setTasks([...tasks, res.data]);
      setTaskTitle("");
      setTaskCategory("");
    } catch (err) {
      console.error("Failed to add task", err.response.data);
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`, {
        headers: { "x-auth-token": token },
      });

      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Failed to delete task", err.response.data);
    }
  };

  // Edit a task (show input fields)
  const handleEditTask = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditCategory(task.category);
  };

  // Save the edited task
  const handleSaveTask = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.put(
        `${API_BASE_URL}/tasks/${id}`,
        { title: editTitle, category: editCategory },
        { headers: { "x-auth-token": token } }
      );

      setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
      setEditingTaskId(null);
    } catch (err) {
      console.error("Failed to update task", err.response.data);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        {user && (
          <>
            <h2 className="text-2xl font-bold">Welcome, {user.firstName} {user.lastName}!</h2>
            <p className="text-gray-600 mb-4">Your email: {user.email}</p>
            <button
              onClick={handleLogout}
              className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        )}

        {/* Task Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Category (optional)"
            value={taskCategory}
            onChange={(e) => setTaskCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <button
            onClick={handleAddTask}
            className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Add Task
          </button>
        </div>

        {/* Task List */}
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="flex justify-between items-center bg-gray-200 p-2 rounded"
            >
              {editingTaskId === task._id ? (
                // Edit Mode
                <div className="flex-grow">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-2 py-1 border rounded mb-1"
                  />
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  />
                </div>
              ) : (
                // View Mode
                <div>
                  <p className="font-semibold">{task.title}</p>
                  <p className="text-sm text-gray-600">{task.category || "No Category"}</p>
                </div>
              )}

              <div className="flex space-x-2">
                {editingTaskId === task._id ? (
                  <>
                    <button
                      onClick={() => handleSaveTask(task._id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditTask(task)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
