import type { Context } from "hono";
import { todoStorage } from "./storage";

export const getTodos = (c: Context) => {
	const todos = todoStorage.getAll();
	return c.json(todos);
};

export const createTodo = (c: Context) => {
	const body = c.req.valid("json");
	const id = crypto.randomUUID();
	const todo = {
		id,
		title: body.title,
		completed: false,
		createdAt: new Date().toISOString(),
	};

	const created = todoStorage.create(todo);
	return c.json(created, 201);
};

export const updateTodo = (c: Context) => {
	const { id } = c.req.valid("param");
	const body = c.req.valid("json");

	const updated = todoStorage.update(id, body);

	if (!updated) {
		return c.json({ error: "Todo not found" }, 404);
	}

	return c.json(updated);
};

export const deleteTodo = (c: Context) => {
	const { id } = c.req.valid("param");

	const deleted = todoStorage.delete(id);

	if (!deleted) {
		return c.json({ error: "Todo not found" }, 404);
	}

	return c.body(null, 204);
};
