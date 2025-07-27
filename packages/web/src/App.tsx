import { useCallback, useEffect, useState } from "react";
import type { Todo } from "shared";
import { apiClient } from "./api";

function App() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [newTodoTitle, setNewTodoTitle] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// TODOリストを取得
	const fetchTodos = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const fetchedTodos = await apiClient.getTodos();
			setTodos(fetchedTodos);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setLoading(false);
		}
	}, []);

	// TODO作成
	const createTodo = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newTodoTitle.trim()) return;

		try {
			setError(null);
			const newTodo = await apiClient.createTodo(newTodoTitle);
			setTodos([...todos, newTodo]);
			setNewTodoTitle("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
		}
	};

	// TODO更新（完了状態の切り替え）
	const toggleTodo = async (id: string, completed: boolean) => {
		try {
			setError(null);
			const updatedTodo = await apiClient.updateTodo(id, { completed });
			setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
		}
	};

	// TODO削除
	const deleteTodo = async (id: string) => {
		try {
			setError(null);
			await apiClient.deleteTodo(id);
			setTodos(todos.filter((todo) => todo.id !== id));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
		}
	};

	// 初期ロード
	useEffect(() => {
		fetchTodos();
	}, [fetchTodos]);

	return (
		<div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
			<h1>TODO App - Hono Zod OpenAPI</h1>

			{error && (
				<div style={{ color: "red", marginBottom: "20px" }}>Error: {error}</div>
			)}

			{/* TODO作成フォーム */}
			<form onSubmit={createTodo} style={{ marginBottom: "20px" }}>
				<input
					type="text"
					value={newTodoTitle}
					onChange={(e) => setNewTodoTitle(e.target.value)}
					placeholder="新しいTODOを入力"
					style={{ padding: "8px", marginRight: "10px", width: "300px" }}
					disabled={loading}
				/>
				<button type="submit" disabled={loading || !newTodoTitle.trim()}>
					追加
				</button>
			</form>

			{/* TODOリスト */}
			{loading && todos.length === 0 ? (
				<div>読み込み中...</div>
			) : (
				<ul style={{ listStyle: "none", padding: 0 }}>
					{todos.map((todo) => (
						<li
							key={todo.id}
							style={{
								display: "flex",
								alignItems: "center",
								padding: "8px",
								marginBottom: "8px",
								border: "1px solid #ddd",
								borderRadius: "4px",
							}}
						>
							<input
								type="checkbox"
								checked={todo.completed}
								onChange={() => toggleTodo(todo.id, !todo.completed)}
								style={{ marginRight: "10px" }}
							/>
							<span
								style={{
									flex: 1,
									textDecoration: todo.completed ? "line-through" : "none",
									color: todo.completed ? "#666" : "#000",
								}}
							>
								{todo.title}
							</span>
							<button
								type="button"
								onClick={() => deleteTodo(todo.id)}
								style={{
									marginLeft: "10px",
									padding: "4px 8px",
									backgroundColor: "#ff6b6b",
									color: "white",
									border: "none",
									borderRadius: "4px",
									cursor: "pointer",
								}}
							>
								削除
							</button>
						</li>
					))}
				</ul>
			)}

			{todos.length === 0 && !loading && (
				<div style={{ color: "#666" }}>TODOがありません</div>
			)}
		</div>
	);
}

export default App;
