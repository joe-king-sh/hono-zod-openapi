import type { RouteHandler } from "@hono/zod-openapi";
import type {
	createTodoRoute,
	deleteTodoRoute,
	getTodosRoute,
	updateTodoRoute,
} from "./routes";
import { todoStorage } from "./storage";

export const getTodos: RouteHandler<typeof getTodosRoute> = (c) => {
	const todos = todoStorage.getAll();
	return c.json(todos, 200);
};

export const createTodo: RouteHandler<typeof createTodoRoute> = (c) => {
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

export const updateTodo: RouteHandler<typeof updateTodoRoute> = (c) => {
	const { id } = c.req.valid("param");
	const body = c.req.valid("json");

	const updated = todoStorage.update(id, body);

	if (!updated) {
		return c.json({ error: "Todo not found" }, 404);
	}

	return c.json(updated, 200);
};

export const deleteTodo: RouteHandler<typeof deleteTodoRoute> = (c) => {
	const { id } = c.req.valid("param");

	const deleted = todoStorage.delete(id);

	if (!deleted) {
		return c.json({ error: "Todo not found" }, 404);
	}

	return c.body(null, 204);
};
