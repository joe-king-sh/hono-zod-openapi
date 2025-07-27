import { HonoRpcClient } from "./hono-rpc-client";
import type { TodoApiClient } from "./types";

// 使用するクライアントのタイプ
export type ClientType = "hono-rpc" | "fetch" | "axios";

// APIクライアントファクトリー
export function createApiClient(type: ClientType = "hono-rpc"): TodoApiClient {
	switch (type) {
		case "hono-rpc":
			return new HonoRpcClient();
		default:
			throw new Error(`Unknown client type: ${type}`);
	}
}

// デフォルトクライアント
export const apiClient = createApiClient("hono-rpc");

// 型とエラークラスのエクスポート
export type { TodoApiClient } from "./types";
export { ApiError } from "./types";
