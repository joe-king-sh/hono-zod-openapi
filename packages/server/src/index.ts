import { serve } from "@hono/node-server";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { todosRouter } from "./todos";

const app = new OpenAPIHono();

const route = createRoute({
	method: "get",
	path: "/hello",
	responses: {
		200: {
			content: {
				"application/json": {
					schema: z.object({
						message: z.string(),
					}),
				},
			},
			description: "Hello message",
		},
	},
});

app.openapi(route, (c) => {
	return c.json({
		message: "Hello World!",
	});
});

app.route("/todos", todosRouter);

app.doc("/doc", {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "TODO API with Hono + Zod OpenAPI",
		description:
			"A simple TODO API demonstrating Hono with Zod OpenAPI integration",
	},
});

const port = 3000;

serve({
	fetch: app.fetch,
	port,
});

console.log(`Server is running on port ${port}`);
