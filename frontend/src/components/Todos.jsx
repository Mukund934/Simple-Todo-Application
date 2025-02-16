const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Todos({ todos, token, onTodoUpdated }) {
  function markCompleted(id) {
    fetch(`${API_URL}/completed`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ id })
    })
      .then((res) => res.json())
      .then(() => {
        alert("Todo marked as completed");
        if (onTodoUpdated) {
          onTodoUpdated();
        }
      })
      .catch((error) => {
        console.error("Error updating todo:", error);
      });
  }

  return (
    <div>
      {todos.map((todo) => (
        <div className="todo-item" key={todo._id}>
          <h1>{todo.title}</h1>
          <h2>{todo.description}</h2>
          <button
            className={`todo-button ${todo.completed ? "completed-button" : "mark-button"}`}
            onClick={() => markCompleted(todo._id)}
          >
            {todo.completed ? "Completed" : "Mark as complete"}
          </button>
        </div>
      ))}
    </div>
  );
}

export { Todos };
