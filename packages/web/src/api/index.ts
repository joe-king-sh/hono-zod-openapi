import { HonoRpcClient } from "./hono-rpc-client";
import { OpenApiFetchClient } from "./openapi-fetch-client";
import type { TodoApiClient } from "./types";

// 使用するクライアントのタイプ
export type ClientType = "hono-rpc" | "openapi-fetch";

// APIクライアントファクトリー
export function createApiClient(type: ClientType = "hono-rpc"): TodoApiClient {
	switch (type) {
		case "hono-rpc":
			return new HonoRpcClient();
		case "openapi-fetch":
			return new OpenApiFetchClient();
		default:
			throw new Error(`Unknown client type: ${type}`);
	}
}

// デフォルトクライアント
export const apiClient = createApiClient("openapi-fetch");

// 型とエラークラスのエクスポート
export type { TodoApiClient } from "./types";
export { ApiError } from "./types";
