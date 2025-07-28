import createClient from "openapi-fetch";
import type { Todo } from "shared";
import type { paths } from "../generated/api-types";
import type { TodoApiClient } from "./types";
import { ApiError } from "./types";

export class OpenApiFetchClient implements TodoApiClient {
	private client: ReturnType<typeof createClient<paths>>;

	constructor(baseUrl: string = "/api") {
		this.client = createClient<paths>({ baseUrl });
	}

	async getTodos(): Promise<Todo[]> {
		try {
			const { data, error } = await this.client.GET("/todos");

			if (error) {
				throw new ApiError(`Failed to get todos: ${error}`, 500, error);
			}

			return data || [];
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}
			throw new ApiError("Failed to get todos", 500, error);
		}
	}

	async createTodo(title: string): Promise<Todo> {
		try {
			const { data, error } = await this.client.POST("/todos", {
				body: { title },
			});

			if (error) {
				throw new ApiError(`Failed to create todo: ${error}`, 400, error);
			}

			if (!data) {
				throw new ApiError("No data returned from create todo", 500);
			}

			return data;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}
			throw new ApiError("Failed to create todo", 500, error);
		}
	}

	async updateTodo(
		id: string,
		updateData: { title?: string; completed?: boolean }
	): Promise<Todo> {
		try {
			const { data, error } = await this.client.PUT("/todos/{id}", {
				params: { path: { id } },
				body: updateData,
			});

			if (error) {
				throw new ApiError(`Failed to update todo: ${error}`, 400, error);
			}

			if (!data) {
				throw new ApiError("No data returned from update todo", 500);
			}

			return data;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}
			throw new ApiError("Failed to update todo", 500, error);
		}
	}

	async deleteTodo(id: string): Promise<void> {
		try {
			const { error } = await this.client.DELETE("/todos/{id}", {
				params: { path: { id } },
			});

			if (error) {
				throw new ApiError(`Failed to delete todo: ${error}`, 400, error);
			}
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}
			throw new ApiError("Failed to delete todo", 500, error);
		}
	}
}
