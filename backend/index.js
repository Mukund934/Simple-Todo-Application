// Commit: Backend - Update registration and login endpoints to use async/await (.exec()) instead of callbacks for Mongoose

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createTodo, updateTodo } = require("./types");
const { todo, user } = require("./db");

const app = express();
const SECRET = "your_jwt_secret"; // Replace with a secure secret

app.use(express.json());
app.use(cors());

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.sendStatus(401);
  }
  jwt.verify(token, SECRET, function(err, userData) {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = userData;
    next();
  });
}

// Register new user using async/await (updated)
app.post("/register", async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ msg: "Username and password required" });
  }
  try {
    const existingUser = await user.findOne({ username: username }).exec();
    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new user({ username: username, password: hashedPassword });
    await newUser.save();
    res.json({ msg: "User registered." });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ msg: "Error processing registration" });
  }
});

// Login endpoint using async/await (updated)
app.post("/login", async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const foundUser = await user.findOne({ username: username }).exec();
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
    res.json({ token: token });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ msg: "Error processing login" });
  }
});

// Create Todo endpoint (protected)
app.post("/todo", authenticateToken, async function(req, res) {
  const payload = req.body;
  const parsedPayload = createTodo.safeParse(payload);
  if (!parsedPayload.success) {
    return res.status(411).json({ msg: "You sent wrong inputs" });
  }
  try {
    await todo.create({
      title: payload.title,
      description: payload.description,
      completed: false,
      userId: req.user.id
    });
    res.json({ msg: "Todo created." });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ msg: "Error creating todo" });
  }
});

// View Todos endpoint (protected)
app.get("/todos", authenticateToken, async function(req, res) {
  try {
    const todos = await todo.find({ userId: req.user.id }).exec();
    res.json({ todos: todos });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ msg: "Error fetching todos" });
  }
});

// Mark Todo as Completed endpoint (protected)
app.put("/completed", authenticateToken, async function(req, res) {
  const updatePayload = req.body;
  const parsedPayload = updateTodo.safeParse(updatePayload);
  if (!parsedPayload.success) {
    return res.status(411).json({ msg: "You sent the wrong inputs" });
  }
  try {
    await todo.updateOne(
      { _id: updatePayload.id, userId: req.user.id },
      { completed: true }
    );
    res.json({ msg: "Todo marked as completed" });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ msg: "Error updating todo" });
  }
});

// Global error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ msg: "There is some error." });
});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
