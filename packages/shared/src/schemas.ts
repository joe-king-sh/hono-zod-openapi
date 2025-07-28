import { z } from "@hono/zod-openapi";

export const TodoSchema1 = z.object({
	id: z.string().openapi({
		example: "10cb81aa-8807-46b8-809a-28aa7bede594",
	}),
	title: z.string().min(1, "タイトルは必須です").openapi({
		example: "人参を買う",
	}),
	completed: z.boolean().default(false).openapi({
		example: false,
	}),
	createdAt: z.string().datetime().openapi({
		example: "2021-01-01T00:00:00.000Z",
	}),
});

export const TodoSchema2 = z.object({
	id: z.string().openapi({
		example: "10cb81aa-8807-46b8-809a-28aa7bede594",
	}),
	title: z.string().min(1, "タイトルは必須です").openapi({
		example: "人参を買う",
	}),
	completed: z.boolean().default(false).openapi({
		example: false,
	}),
	createdAt: z.string().datetime().openapi({
		example: "2021-01-01T00:00:00.000Z",
	}),
	createdBy: z.string().openapi({
		example: "10cb81aa-8807-46b8-809a-28aa7bede594",
	}),
});

export const TodoSchema = z.union([TodoSchema1, TodoSchema2]);

// GET /todos - Response
export const GetTodosResponseSchema = z.array(TodoSchema);

// POST /todos - Request & Response
export const PostTodosRequestSchema = z.object({
	title: z.string().min(1, "Title is required").openapi({
		example: "ジャガイモを買う",
	}),
});

export const PostTodosResponseSchema = TodoSchema;

// PUT /todos/:id - Request & Response
export const PutTodosRequestSchema = z.object({
	title: z.string().min(1, "Title is required").optional().openapi({
		example: "ジャガイモを買う",
	}),
	completed: z.boolean().optional().openapi({
		example: true,
	}),
});

export const PutTodosResponseSchema = TodoSchema;

// DELETE /todos/:id - Request params
export const DeleteTodosParamsSchema = z.object({
	id: z.string(),
});

// Common params schema
export const TodoParamsSchema = z.object({
	id: z.string(),
});
