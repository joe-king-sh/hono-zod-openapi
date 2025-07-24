import type { Todo } from "shared";

class TodoStorage {
	private todos: Map<string, Todo> = new Map();

	getAll(): Todo[] {
		return Array.from(this.todos.values());
	}

	getById(id: string): Todo | undefined {
		return this.todos.get(id);
	}

	create(todo: Todo): Todo {
		this.todos.set(todo.id, todo);
		return todo;
	}

	update(id: string, updates: Partial<Todo>): Todo | null {
		const existing = this.todos.get(id);
		if (!existing) return null;

		const updated = { ...existing, ...updates };
		this.todos.set(id, updated);
		return updated;
	}

	delete(id: string): boolean {
		return this.todos.delete(id);
	}
}

export const todoStorage = new TodoStorage();
