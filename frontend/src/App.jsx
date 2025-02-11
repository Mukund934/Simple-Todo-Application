import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { CreateTodo } from "./components/CreateTodo";
import { Todos } from "./components/Todos";

function App() {
  const [todos, setTodos] = useState([]);

  // Use useEffect to fetch todos when the component mounts
  useEffect(function () {
    fetch("http://localhost:3000/todos")
      .then(async function (res) {
        const json = await res.json();
        setTodos(json.todos);
      })
      .catch(function (error) {
        console.error("Error fetching todos:", error);
      });
  }, []);

  return (
    <div>
      <CreateTodo />
      <Todos todos={todos} />
    </div>
  );
}

export default App;
