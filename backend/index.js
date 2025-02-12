require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { createTodo, updateTodo } = require("./types");
const { todo, user } = require("./db");

const app = express();
const SECRET = process.env.JWT_SECRET || "02347502349"; // Use env variable if provided
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Middleware to verify JWT
function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return res.sendStatus(401);
	}
	jwt.verify(token, SECRET, (err, userData) => {
		if (err) {
			return res.sendStatus(403);
		}
		req.user = userData;
		next();
	});
}

app.post("/register", async (req, res) => {
	console.log("Register endpoint hit");
	const { username, password } = req.body;
	if (!username || !password) {
		return res.status(400).json({ msg: "Username and password required" });
	}
	try {
		const existingUser = await user.findOne({ username }).exec();
		if (existingUser) {
			return res.status(409).json({ msg: "User already exists" });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new user({ username, password: hashedPassword });
		await newUser.save();
		res.json({ msg: "User registered." });
	} catch (err) {
		console.error(err.stack);
		res.status(500).json({ msg: "Error processing registration" });
	}
});

app.post("/login", async (req, res) => {
	console.log("Login endpoint hit");
	const { username, password } = req.body;
	try {
		const foundUser = await user.findOne({ username }).exec();
		if (!foundUser) {
			return res.status(401).json({ msg: "Invalid credentials" });
		}
		const valid = await bcrypt.compare(password, foundUser.password);
		if (!valid) {
			return res.status(401).json({ msg: "Invalid credentials" });
		}
		const token = jwt.sign(
			{ id: foundUser._id, username: foundUser.username },
			SECRET,
			{ expiresIn: "1h" }
		);
		res.json({ token });
	} catch (err) {
		console.error(err.stack);
		res.status(500).json({ msg: "Error processing login" });
	}
});

app.post("/todo", authenticateToken, async (req, res) => {
	console.log("Create Todo endpoint hit");
	const payload = req.body;
	const parsedPayload = createTodo.safeParse(payload);
	if (!parsedPayload.success) {
		return res
			.status(400)
			.json({ msg: "Invalid input", error: parsedPayload.error.errors });
	}
	try {
		await todo.create({
			title: payload.title,
			description: payload.description,
			completed: false,
			userId: req.user.id,
		});
		res.json({ msg: "Todo created." });
	} catch (err) {
		console.error(err.stack);
		res.status(500).json({ msg: "Error creating todo" });
	}
});

app.get("/todos", authenticateToken, async (req, res) => {
	console.log("View Todos endpoint hit");
	try {
		const todos = await todo.find({ userId: req.user.id }).exec();
		res.json({ todos });
	} catch (err) {
		console.error(err.stack);
		res.status(500).json({ msg: "Error fetching todos" });
	}
});

app.put("/completed", authenticateToken, async (req, res) => {
	console.log("Mark Todo as Completed endpoint hit");
	const updatePayload = req.body;
	const parsedPayload = updateTodo.safeParse(updatePayload);
	if (!parsedPayload.success) {
		return res
			.status(400)
			.json({ msg: "Invalid input", error: parsedPayload.error.errors });
	}
	try {
		const result = await todo.updateOne(
			{ _id: updatePayload.id, userId: req.user.id },
			{ completed: true }
		);
		if (result.nModified === 0) {
			return res
				.status(404)
				.json({ msg: "Todo not found or already completed" });
		}
		res.json({ msg: "Todo marked as completed" });
	} catch (err) {
		console.error(err.stack);
		res.status(500).json({ msg: "Error updating todo" });
	}
});

// Global error handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ msg: "There is some error." });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
