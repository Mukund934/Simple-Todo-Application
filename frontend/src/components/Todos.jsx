function Todos(props) {
	function markCompleted(id) {
		fetch("http://localhost:3000/completed", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + props.token,
			},
			body: JSON.stringify({ id: id }),
		})
			.then(function (res) {
				return res.json();
			})
			.then(function (data) {
				alert("Todo marked as completed");
			})
			.catch(function (error) {
				console.error("Error updating todo:", error);
			});
	}

	return (
		<div>
			{props.todos.map(function (todo) {
				return (
					<div key={todo.id}>
						<h1>{todo.title}</h1>
						<h2>{todo.description}</h2>
						<button
							onClick={function () {
								markCompleted(todo.id);
							}}
						>
							{todo.completed ? "Completed" : "Mark as complete"}
						</button>
					</div>
				);
			})}
		</div>
	);
}

export { Todos };
