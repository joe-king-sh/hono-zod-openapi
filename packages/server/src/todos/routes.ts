import { createRoute } from "@hono/zod-openapi";
import {
	GetTodosResponseSchema,
	PostTodosRequestSchema,
	PostTodosResponseSchema,
	PutTodosRequestSchema,
	PutTodosResponseSchema,
	TodoParamsSchema,
} from "shared";

export const getTodosRoute = createRoute({
	method: "get",
	path: "/",
	responses: {
		200: {
			content: {
				"application/json": {
					schema: GetTodosResponseSchema,
				},
			},
			description: "List of todos",
		},
	},
});

export const createTodoRoute = createRoute({
	method: "post",
	path: "/",
	request: {
		body: {
			content: {
				"application/json": {
					schema: PostTodosRequestSchema,
				},
			},
		},
	},
	responses: {
		201: {
			content: {
				"application/json": {
					schema: PostTodosResponseSchema,
				},
			},
			description: "Created todo",
		},
		400: {
			description: "Invalid request body",
		},
	},
});

export const updateTodoRoute = createRoute({
	method: "put",
	path: "/{id}",
	request: {
		params: TodoParamsSchema,
		body: {
			content: {
				"application/json": {
					schema: PutTodosRequestSchema,
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: PutTodosResponseSchema,
				},
			},
			description: "Updated todo",
		},
		404: {
			description: "Todo not found",
		},
		400: {
			description: "Invalid request body",
		},
	},
});

export const deleteTodoRoute = createRoute({
	method: "delete",
	path: "/{id}",
	request: {
		params: TodoParamsSchema,
	},
	responses: {
		204: {
			description: "Todo deleted successfully",
		},
		404: {
			description: "Todo not found",
		},
	},
});
