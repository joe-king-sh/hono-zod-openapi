import type { RouteHandler } from "@hono/zod-openapi";
import {
	GetTodosResponseSchema,
	PostTodosResponseSchema,
	PutTodosResponseSchema,
} from "shared";
import type {
	createTodoRoute,
	deleteTodoRoute,
	getTodosRoute,
	updateTodoRoute,
} from "./routes";
import { todoStorage } from "./storage";

export const getTodos: RouteHandler<typeof getTodosRoute> = (c) => {
	const todos = todoStorage.getAll();

	const result = GetTodosResponseSchema.safeParse(todos);
	if (!result.success) {
		console.error("Response validation error:", result.error);
		throw new Error("レスポンスデータのバリデーションに失敗しました");
	}

	return c.json(result.data, 200);
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

	const result = PostTodosResponseSchema.safeParse(created);
	if (!result.success) {
		console.error("Response validation error:", result.error);
		throw new Error("レスポンスデータのバリデーションに失敗しました");
	}

	return c.json(result.data, 201);
};

export const updateTodo: RouteHandler<typeof updateTodoRoute> = (c) => {
	const { id } = c.req.valid("param");
	const body = c.req.valid("json");

	const updated = todoStorage.update(id, body);

	if (!updated) {
		return c.json({ error: "Todo not found" }, 404);
	}

	const result = PutTodosResponseSchema.safeParse(updated);
	if (!result.success) {
		console.error("Response validation error:", result.error);
		throw new Error("レスポンスデータのバリデーションに失敗しました");
	}

	return c.json(result.data, 200);
};

export const deleteTodo: RouteHandler<typeof deleteTodoRoute> = (c) => {
	const { id } = c.req.valid("param");

	const deleted = todoStorage.delete(id);

	if (!deleted) {
		return c.json({ error: "Todo not found" }, 404);
	}

	return c.body(null, 204);
};
