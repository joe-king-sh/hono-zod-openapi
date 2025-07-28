const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SERVER_URL = "http://localhost:3000";
const SCHEMA_URL = `${SERVER_URL}/doc`;
const OUTPUT_DIR = path.join(__dirname, "..", "src", "generated");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "api-types.ts");

async function generateApiTypes() {
	console.log("🚀 Generating API types from OpenAPI schema...");

	try {
		// サーバーが起動しているかチェック
		console.log("📡 Checking if server is running...");
		try {
			execSync(`curl -f ${SCHEMA_URL}`, { stdio: "pipe" });
		} catch (error) {
			console.error(
				"❌ Server is not running or schema endpoint is not available"
			);
			console.error("Please start the server with: pnpm --filter server dev");
			process.exit(1);
		}

		// OpenAPIスキーマをダウンロード
		console.log("📥 Downloading OpenAPI schema...");
		const schemaResponse = execSync(`curl -s ${SCHEMA_URL}`, {
			encoding: "utf8",
		});

		// スキーマが有効なJSONかチェック
		try {
			JSON.parse(schemaResponse);
		} catch (error) {
			console.error("❌ Invalid JSON schema received from server");
			console.error("Schema response:", schemaResponse);
			process.exit(1);
		}

		// 一時的にスキーマファイルを保存
		const tempSchemaFile = path.join(OUTPUT_DIR, "temp-schema.json");
		fs.writeFileSync(tempSchemaFile, schemaResponse);

		// openapi-typescriptで型定義を生成
		console.log("🔧 Generating TypeScript types...");
		execSync(`npx openapi-typescript ${tempSchemaFile} -o ${OUTPUT_FILE}`, {
			stdio: "inherit",
			cwd: path.join(__dirname, ".."),
		});

		// 一時ファイルを削除
		fs.unlinkSync(tempSchemaFile);

		console.log("✅ API types generated successfully!");
		console.log(`📁 Output: ${OUTPUT_FILE}`);
	} catch (error) {
		console.error("❌ Failed to generate API types:", error.message);
		process.exit(1);
	}
}

generateApiTypes();
