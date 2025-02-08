// {
//     Todo{
//         title: string,
//         description: string,
//         completed: boolean
//     }
// }

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin1:SDZ3E9dKfzt5vYEc@cluster0.rxi0w.mongodb.net/todos");
const todoSchema = mongoose.Schema({
	title: String,
	description: String,
	completed: Boolean,
});

const todo = mongoose.model("todos", todoSchema);

module.exports = {
    todo
}

