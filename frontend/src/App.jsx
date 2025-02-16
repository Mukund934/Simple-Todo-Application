import { useState, useEffect } from "react";
import { CreateTodo } from "./components/CreateTodo";
import { Todos } from "./components/Todos";
import { Login } from "./components/Login";
import "./App.css";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
function App() {
  const [todos, setTodos] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const fetchTodos = () => {
    if (!token) return;
    fetch(`${API_URL}/todos`, {
      headers: { Authorization: "Bearer " + token }
    })
      .then((res) => res.json())
      .then((data) => setTodos(data.todos))
      .catch((error) => console.error("Error fetching todos:", error));
  };
  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };
  if (!token) {
    return <Login setToken={setToken} />;
  }
  return (
    <div className="container">
      <header className="header">
        <h1>Simple Todo Application</h1>
      </header>
      <button className="button logout-button" onClick={handleLogout}>
        Logout
      </button>
      <div className="form-container">
        <CreateTodo token={token} onTodoCreated={fetchTodos} />
      </div>
      <div className="todo-list">
        <Todos todos={todos} token={token} onTodoUpdated={fetchTodos} />
      </div>
    </div>
  );
}
export default App;
