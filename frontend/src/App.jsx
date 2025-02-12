import { useState, useEffect } from "react";
import { CreateTodo } from "./components/CreateTodo";
import { Todos } from "./components/Todos";
import { Login } from "./components/Login";

function App() {
  const [todos, setTodos] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Function to fetch todos from the backend
  const fetchTodos = () => {
    fetch("http://localhost:3000/todos", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos(data.todos);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  };

  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token]);

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div>
      <CreateTodo token={token} onTodoCreated={fetchTodos} />
      <Todos todos={todos} token={token} onTodoUpdated={fetchTodos} />
    </div>
  );
}

export default App;
