const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createTodo, updateTodo } = require("./types");
const { todo, user } = require("./db");

const app = express();
const SECRET = "04237560923";

app.use(express.json());
app.use(cors());

// Middleware to verify JWT
function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return res.sendStatus(401);
	}
	jwt.verify(token, SECRET, function (err, userData) {
		if (err) {
			return res.sendStatus(403);
		}
		req.user = userData;
		next();
	});
}

// Register new user
app.post("/register", function (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	if (!username || !password) {
		return res.status(400).json({ msg: "Username and password required" });
	}
	user.findOne({ username: username }, function (err, existingUser) {
		if (err) {
			return res.status(500).json({ msg: "Error checking user" });
		}
		if (existingUser) {
			return res.status(409).json({ msg: "User already exists" });
		}
		bcrypt.hash(password, 10, function (err, hashedPassword) {
			if (err) {
				return res.status(500).json({ msg: "Error hashing password" });
			}
			const newUser = new user({
				username: username,
				password: hashedPassword,
			});
			newUser.save(function (err) {
				if (err) {
					return res.status(500).json({ msg: "Error saving user" });
				}
				res.json({ msg: "User registered." });
			});
		});
	});
});

// Login endpoint
app.post("/login", function (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	user.findOne({ username: username }, function (err, foundUser) {
		if (err) {
			return res.status(500).json({ msg: "Error finding user" });
		}
		if (!foundUser) {
			return res.status(401).json({ msg: "Invalid credentials" });
		}
		bcrypt.compare(password, foundUser.password, function (err, valid) {
			if (err || !valid) {
				return res.status(401).json({ msg: "Invalid credentials" });
			}
			const token = jwt.sign(
				{ id: foundUser._id, username: foundUser.username },
				SECRET,
				{ expiresIn: "1h" }
			);
			res.json({ token: token });
		});
	});
});

// Create Todo endpoint (protected)
app.post("/todo", authenticateToken, function (req, res) {
	const payload = req.body;
	const parsedPayload = createTodo.safeParse(payload);
	if (!parsedPayload.success) {
		return res.status(411).json({ msg: "You sent wrong inputs" });
	}
	todo.create(
		{
			title: payload.title,
			description: payload.description,
			completed: false,
			userId: req.user.id,
		},
		function (err) {
			if (err) {
				return res.status(500).json({ msg: "Error creating todo" });
			}
			res.json({ msg: "Todo created." });
		}
	);
});

// View Todos endpoint (protected)
app.get("/todos", authenticateToken, function (req, res) {
	todo.find({ userId: req.user.id }, function (err, todos) {
		if (err) {
			return res.status(500).json({ msg: "Error fetching todos" });
		}
		res.json({ todos: todos });
	});
});

// Mark Todo as Completed endpoint (protected)
app.put("/completed", authenticateToken, function (req, res) {
	const updatePayload = req.body;
	const parsedPayload = updateTodo.safeParse(updatePayload);
	if (!parsedPayload.success) {
		return res.status(411).json({ msg: "You sent the wrong inputs" });
	}
	todo.updateOne(
		{ _id: updatePayload.id, userId: req.user.id },
		{ completed: true },
		function (err) {
			if (err) {
				return res.status(500).json({ msg: "Error updating todo" });
			}
			res.json({ msg: "Todo marked as completed" });
		}
	);
});

// Global error handler
app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).json({ msg: "There is some error." });
});

app.listen(3000, function () {
	console.log("Server is running on port 3000");
});
