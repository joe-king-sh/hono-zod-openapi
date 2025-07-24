import { z } from "zod";

// Base Todo schema
export const TodoSchema = z.object({
	id: z.string(),
	title: z.string().min(1, "Title is required"),
	completed: z.boolean().default(false),
	createdAt: z.string().datetime(),
});

// GET /todos - Response
export const GetTodosResponseSchema = z.array(TodoSchema);

// POST /todos - Request & Response
export const PostTodosRequestSchema = z.object({
	title: z.string().min(1, "Title is required"),
});

export const PostTodosResponseSchema = TodoSchema;

// PUT /todos/:id - Request & Response
export const PutTodosRequestSchema = z.object({
	title: z.string().min(1, "Title is required").optional(),
	completed: z.boolean().optional(),
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
