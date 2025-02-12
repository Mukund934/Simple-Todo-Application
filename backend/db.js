const mongoose = require("mongoose");

mongoose.connect(
	"mongodb+srv://admin1:SDZ3E9dKfzt5vYEc@cluster0.rxi0w.mongodb.net/todos"
);

const todoSchema = mongoose.Schema({
	title: String,
	description: String,
	completed: Boolean,
	userId: String,
});
const todo = mongoose.model("todos", todoSchema);

const userSchema = mongoose.Schema({
	username: { type: String, unique: true },
	password: String,
});
const user = mongoose.model("users", userSchema);

module.exports = {
	todo: todo,
	user: user,
};
