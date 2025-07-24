import type { z } from "zod";
import type {
	DeleteTodosParamsSchema,
	GetTodosResponseSchema,
	PostTodosRequestSchema,
	PostTodosResponseSchema,
	PutTodosRequestSchema,
	PutTodosResponseSchema,
	TodoParamsSchema,
	TodoSchema,
} from "./schemas";

// Base types
export type Todo = z.infer<typeof TodoSchema>;

// API Request/Response types
export type GetTodosResponse = z.infer<typeof GetTodosResponseSchema>;

export type PostTodosRequest = z.infer<typeof PostTodosRequestSchema>;
export type PostTodosResponse = z.infer<typeof PostTodosResponseSchema>;

export type PutTodosRequest = z.infer<typeof PutTodosRequestSchema>;
export type PutTodosResponse = z.infer<typeof PutTodosResponseSchema>;

export type DeleteTodosParams = z.infer<typeof DeleteTodosParamsSchema>;
export type TodoParams = z.infer<typeof TodoParamsSchema>;
