import type { Todo } from "shared";

// API操作の共通インターフェース
export interface TodoApiClient {
	getTodos(): Promise<Todo[]>;
	createTodo(title: string): Promise<Todo>;
	updateTodo(
		id: string,
		data: { title?: string; completed?: boolean }
	): Promise<Todo>;
	deleteTodo(id: string): Promise<void>;
}

// API エラー型
export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public response?: unknown
	) {
		super(message);
		this.name = "ApiError";
	}
}
