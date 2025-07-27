import { hc } from "hono/client";
import type { AppType } from "server";
import type { Todo } from "shared";
import type { TodoApiClient } from "./types";
import { ApiError } from "./types";

export class HonoRpcClient implements TodoApiClient {
	private client: ReturnType<typeof hc<AppType>>;

	constructor(baseUrl = "/api") {
		this.client = hc<AppType>(baseUrl);
	}

	async getTodos(): Promise<Todo[]> {
		try {
			const response = await this.client.todos.$get();
			if (!response.ok) {
				throw new ApiError(
					`Failed to fetch todos: ${response.status}`,
					response.status
				);
			}
			return await response.json();
		} catch (error) {
			if (error instanceof ApiError) throw error;
			throw new ApiError("Network error", 0, error);
		}
	}

	async createTodo(title: string): Promise<Todo> {
		try {
			const response = await this.client.todos.$post({
				json: { title },
			});
			if (!response.ok) {
				throw new ApiError(
					`Failed to create todo: ${response.status}`,
					response.status
				);
			}
			return await response.json();
		} catch (error) {
			if (error instanceof ApiError) throw error;
			throw new ApiError("Network error", 0, error);
		}
	}

	async updateTodo(
		id: string,
		data: { title?: string; completed?: boolean }
	): Promise<Todo> {
		try {
			const response = await this.client.todos[":id"].$put({
				param: { id },
				json: data,
			});
			if (!response.ok) {
				throw new ApiError(
					`Failed to update todo: ${response.status}`,
					response.status
				);
			}
			return await response.json();
		} catch (error) {
			if (error instanceof ApiError) throw error;
			throw new ApiError("Network error", 0, error);
		}
	}

	async deleteTodo(id: string): Promise<void> {
		try {
			const response = await this.client.todos[":id"].$delete({
				param: { id },
			});
			if (!response.ok) {
				throw new ApiError(
					`Failed to delete todo: ${response.status}`,
					response.status
				);
			}
		} catch (error) {
			if (error instanceof ApiError) throw error;
			throw new ApiError("Network error", 0, error);
		}
	}
}
