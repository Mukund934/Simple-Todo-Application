// write basic express boiler plate code
// write express.json() middleware

const express = require("express");
const { createTodo, updateTodo } = require("./types");
const { todo } = require("./db");
const app = express();

app.use(express.json());

// using zod types we will validate, so we will create new file types.js

app.post("/todo", async function (req, res) {
	const Payload = req.body;

	const parsedPayload = createTodo.safeParse(Payload);

	if (!parsedPayload.success) {
		res.status(411).json({
			msg: "You sent wrong inputs ",
		});
		return;
	}

	// put it in mongo db

	await todo.create({
		title: Payload.title,
		description: Payload.description,
		completed: false,
	});

	res.json({
		msg: "Todo created.",
	});
});

app.get("/todos", async function (req, res) {
	const todos = await todo.find({});
	console.log(todos);

	res.json({
		todos,
	});
});

app.put("/completed", async function (req, res) {
	const updatePayload = req.body;
	const parsedPayload = updateTodo.safeParse(updatePayload);

	if (!parsedPayload.success) {
		res.status(411).json({
			msg: "You sent the wrong inputs",
		});
		return;
	}

	await todo.update(
		{
			_id: res.body.id,
		},
		{
			completed: true,
		}
	);

	res.json({
		msg: "Todo marked as completed",
	});
});

app.use(function (err, req, res, next) {
	console.error(err.stack);

	res.status(500).json({
		msg: "There is some error.",
	});
});

app.listen(3000, function () {
	console.log("Server is running on port 3000");
});
