const { z } = require("zod");

const createTodo = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
});

const updateTodo = z.object({
	id: z.string().min(1, "Todo ID is required"),
});

module.exports = { createTodo, updateTodo };
