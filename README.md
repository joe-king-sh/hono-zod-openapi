# Hono + Zod + OpenAPI サンプルプロジェクト

以下のブログ記事用のサンプルコードです。HonoとZodを使ったtype-safeなAPI開発の例を示しています。

- [DevelopersIO: Hono で作る REST API で 仕様と実装を同期しながらクライアントへスキーマ情報共有する方法の最適解をパターン別に検討してみた](https://dev.classmethod.jp/articles/hono-zod-openapi-schema-driven-api-development/)

## 構成

- **Server** (packages/server): Hono + Zod OpenAPIでのREST API
- **Web** (packages/web): Reactでのフロントエンドクライアント  
- **Shared** (packages/shared): 共通の型定義とスキーマ

## セットアップ

```bash
pnpm install
```

## 開発

サーバー起動:
```bash
pnpm dev
```

Webアプリ起動:
```bash
cd packages/web
pnpm dev
```

## API仕様

- サーバー: http://localhost:3000
- Swagger UI: http://localhost:3000/ui
- Scalar: http://localhost:3000/scalar
- OpenAPI spec: http://localhost:3000/doc

## 機能

- TODOの作成・取得・更新・削除
- Zodによるバリデーション
- OpenAPI仕様の自動生成
- 型安全なクライアント実装（Hono RPC or openapi-fetch）

## スクリプト

```bash
pnpm build      # 全体ビルド
pnpm lint       # コードチェック
pnpm format     # フォーマット
```