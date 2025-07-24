import { OpenAPIHono } from "@hono/zod-openapi";
import { createTodo, deleteTodo, getTodos, updateTodo } from "./handlers";
import {
	createTodoRoute,
	deleteTodoRoute,
	getTodosRoute,
	updateTodoRoute,
} from "./routes";

export const todosRouter = new OpenAPIHono();

todosRouter.openapi(getTodosRoute, getTodos);
todosRouter.openapi(createTodoRoute, createTodo);
todosRouter.openapi(updateTodoRoute, updateTodo);
todosRouter.openapi(deleteTodoRoute, deleteTodo);
