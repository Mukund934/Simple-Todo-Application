import { useState } from "react";

export function CreateTodo(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleAddTodo() {
    fetch("http://localhost:3000/todos", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        description: description,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async function (res) {
        const json = await res.json();
        alert("Todo added");
      })
      .catch(function (error) {
        console.error("Error adding todo:", error);
      });
  }

  return (
    <div>
      <input
        style={{ padding: 10, margin: 10 }}
        type="text"
        placeholder="title"
        value={title}
        onChange={function (e) {
          setTitle(e.target.value);
        }}
      />
      <br />
      <input
        style={{ padding: 10, margin: 10 }}
        type="text"
        placeholder="description"
        value={description}
        onChange={function (e) {
          setDescription(e.target.value);
        }}
      />
      <button
        style={{ padding: 10, margin: 10 }}
        onClick={handleAddTodo}
      >
        Add a todo
      </button>
    </div>
  );
}
