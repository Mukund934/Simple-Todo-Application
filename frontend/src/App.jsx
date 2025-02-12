
import { useState, useEffect } from "react";
import { CreateTodo } from "./components/CreateTodo";
import { Todos } from "./components/Todos";
import { Login } from "./components/Login";

function App() {
  const [todos, setTodos] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(function() {
    if (token) {
      fetch("http://localhost:3000/todos", {
        headers: { Authorization: "Bearer " + token }
      })
      .then(function(res) {
        return res.json();
      })
      .then(function(data) {
        setTodos(data.todos);
      })
      .catch(function(error) {
        console.error("Error fetching todos:", error);
      });
    }
  }, [token]);

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div>
      <CreateTodo token={token} />
      <Todos todos={todos} token={token} />
    </div>
  );
}

export default App;
