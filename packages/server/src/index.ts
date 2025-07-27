import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { todosRouter } from "./todos";

export const app = new OpenAPIHono();

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

// Swagger UI
app.get("/ui", swaggerUI({ url: "/doc" }));

// Scalar
app.get("/scalar", Scalar({ url: "/doc" }));

const port = 3000;

serve({
	fetch: app.fetch,
	port,
});

console.log(`Server is running on port ${port}`);
