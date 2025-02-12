import { useState } from "react";

function CreateTodo({ token, onTodoCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleAddTodo() {
    fetch("http://localhost:3000/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ title, description }),
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
        style={{ padding: 10, margin: 10 }}
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <input
        style={{ padding: 10, margin: 10 }}
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button style={{ padding: 10, margin: 10 }} onClick={handleAddTodo}>
        Add a todo
      </button>
    </div>
  );
}

export { CreateTodo };
