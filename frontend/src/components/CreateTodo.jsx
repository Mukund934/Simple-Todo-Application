import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function CreateTodo({ token, onTodoCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleAddTodo() {
    fetch(`${API_URL}/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ title, description })
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Todo added");
        setTitle("");
        setDescription("");
        if (onTodoCreated) {
          onTodoCreated();
        }
      })
      .catch((error) => {
        console.error("Error adding todo:", error);
      });
  }

  return (
    <div>
      <input
        className="input-field"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="input-field"
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button className="button" onClick={handleAddTodo}>
        Add a todo
      </button>
    </div>
  );
}

export { CreateTodo };
