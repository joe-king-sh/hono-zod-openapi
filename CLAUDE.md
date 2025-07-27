# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript monorepo project demonstrating a type-safe API implementation using Hono, Zod, and OpenAPI. The project showcases modern web development practices with automatic API documentation generation and shared type definitions across packages.

### Repository Structure

```
hono-zod-openapi/
├── packages/
│   ├── server/      # Backend API server (Hono + Zod OpenAPI)
│   ├── shared/      # Shared schemas and types
│   └── web/         # Frontend React application (scaffolded, not implemented)
├── biome.json       # Code formatting and linting config
├── package.json     # Root package configuration
├── pnpm-lock.yaml   # Lock file
└── pnpm-workspace.yaml  # Monorepo workspace config
```

## Architecture

### Package Dependencies

```
web → shared ← server
```

- **server**: Depends on `shared` for schemas and types
- **web**: Will depend on `shared` for type-safe API integration
- **shared**: Independent package providing common definitions

### Technology Stack

#### Backend (server)
- **Hono** (v4.6.10) - Modern web framework optimized for edge computing
- **@hono/zod-openapi** (v0.18.2) - OpenAPI integration with Zod validation
- **@hono/node-server** (v1.17.1) - Node.js adapter
- **@hono/swagger-ui** (v0.5.2) - Swagger documentation UI
- **@scalar/hono-api-reference** (v0.9.12) - Alternative API documentation
- **Zod** (v3.24.1) - Runtime type validation

#### Frontend (web)
- **React** (v18.3.1) - UI library
- **React DOM** (v18.3.1) - React renderer for web
- **Vite** (v6.0.2) - Build tool and dev server
- **TypeScript** (v5.7.0) - Type safety

#### Development Tools
- **pnpm** - Fast, disk space efficient package manager
- **Biome** (v2.1.0) - Fast formatter and linter (replaces ESLint/Prettier)
- **tsx** (v4.19.2) - TypeScript execution for development

## Development Commands

### Initial Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Server runs on http://localhost:3000
```

### Root Level Commands
```bash
pnpm dev        # Start server in development mode
pnpm build      # Build all packages
pnpm test       # Run tests (not implemented yet)
pnpm lint       # Check linting issues with Biome
pnpm lint:fix   # Auto-fix linting issues
pnpm format     # Format code with Biome
pnpm check      # Run all Biome checks (lint + format)
pnpm check:fix  # Fix all Biome issues
```

### Package-Specific Commands
```bash
# Run commands for specific packages
pnpm --filter server dev
pnpm --filter server build
pnpm --filter server start    # Run built server

pnpm --filter shared build
pnpm --filter shared dev      # Watch mode

pnpm --filter web dev
pnpm --filter web build
pnpm --filter web preview
```

## API Structure

### Current Endpoints

The server implements a TODO API with the following endpoints:

- `GET /todos` - List all todos
- `POST /todos` - Create a new todo
- `PUT /todos/:id` - Update a todo
- `DELETE /todos/:id` - Delete a todo

### Documentation URLs

When the server is running:
- OpenAPI JSON: `http://localhost:3000/doc`
- Swagger UI: `http://localhost:3000/ui`
- Scalar Docs: `http://localhost:3000/scalar`

### Schema Structure

All schemas are defined in `packages/shared/src/schemas.ts` using Zod:

```typescript
TodoSchema {
  id: string (UUID format)
  title: string (required, min 1 char)
  completed: boolean (default: false)
  createdAt: string (ISO datetime)
}
```

Request/Response schemas:
- `GetTodosResponseSchema` - Array of TodoSchema
- `PostTodosRequestSchema` - { title: string }
- `PutTodosRequestSchema` - { title?: string, completed?: boolean }
- `TodoParamsSchema` - { id: string }

## Code Standards

### Biome Configuration

The project uses Biome for formatting and linting with these key settings:

- **Indentation**: Tabs (width: 2)
- **Line width**: 80 characters
- **Quotes**: Double quotes for strings
- **Semicolons**: Always required
- **Trailing commas**: ES5 style
- **Import organization**: Automatic
- **No non-null assertions**: Allowed (rule disabled)
- **Import types**: Required (error level)
- **Unused imports**: Error level

### TypeScript Configuration

Server TypeScript config:
- **Target**: ES2022
- **Module**: ESNext with bundler resolution
- **Strict mode**: Enabled
- **Path aliases**: `shared` maps to shared package
- **Allow TS extensions**: Enabled for development
- **No emit**: True (tsx handles compilation in dev)

## Implementation Guidelines

### Adding a New API Endpoint

1. **Define schemas** in `packages/shared/src/schemas.ts`
2. **Export types** in `packages/shared/src/types.ts`
3. **Create route** in `packages/server/src/[module]/routes.ts`
4. **Implement handler** in `packages/server/src/[module]/handlers.ts`
5. **Register router** in `packages/server/src/[module]/index.ts`
6. **Add to main app** in `packages/server/src/index.ts`

### Example: Adding a New Feature

```typescript
// 1. In shared/src/schemas.ts
export const FeatureSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  enabled: z.boolean().default(true)
});

// 2. In shared/src/types.ts
export type Feature = z.infer<typeof FeatureSchema>;

// 3. In server/src/features/routes.ts
import { createRoute } from "@hono/zod-openapi";

export const getFeatureRoute = createRoute({
  method: 'get',
  path: '/{id}',
  request: {
    params: z.object({ id: z.string() })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: FeatureSchema
        }
      },
      description: 'Feature details'
    },
    404: {
      description: 'Feature not found'
    }
  }
});

// 4. In server/src/features/handlers.ts
export const getFeature = (c: Context) => {
  const { id } = c.req.valid("param");
  // Implementation
};

// 5. In server/src/features/index.ts
import { OpenAPIHono } from "@hono/zod-openapi";
import { getFeatureRoute } from "./routes";
import { getFeature } from "./handlers";

export const featuresRouter = new OpenAPIHono();
featuresRouter.openapi(getFeatureRoute, getFeature);

// 6. In server/src/index.ts
app.route("/features", featuresRouter);
```

### Working with the Shared Package

When modifying the shared package:
1. Make changes in `packages/shared/src/`
2. Run `pnpm --filter shared build` to compile
3. The server will automatically use the updated types

### Server Implementation Details

The server uses:
- In-memory storage (`packages/server/src/todos/storage.ts`)
- OpenAPIHono for route definitions with automatic validation
- Type-safe handlers using Zod validation
- Automatic OpenAPI documentation generation

### Starting Web Development

The web package is scaffolded but not implemented. To start:

1. Create necessary directories and files:
   ```bash
   mkdir -p packages/web/src
   touch packages/web/src/main.tsx
   touch packages/web/src/App.tsx
   touch packages/web/index.html
   touch packages/web/vite.config.ts
   touch packages/web/tsconfig.json
   ```

2. Add `shared` as dependency:
   ```bash
   pnpm --filter web add shared@workspace:*
   ```

3. Configure Vite and TypeScript
4. Import types from `shared` package for type-safe API calls

## Common Tasks

### Adding a New Package

```bash
# Create new package directory
mkdir packages/new-package
cd packages/new-package

# Initialize package.json
pnpm init

# Add to pnpm-workspace.yaml
# Edit the file to include: - "packages/new-package"
```

### Updating Dependencies

```bash
# Update all packages
pnpm update

# Update specific package
pnpm --filter server add package-name

# Add shared dependency to another package
pnpm --filter server add shared@workspace:*
```

### Running Biome Checks

```bash
# Check specific package
pnpm --filter server check

# Fix all issues in entire repo
pnpm check:fix

# Format only
pnpm format

# Lint only
pnpm lint
```

### Building for Production

```bash
# Build all packages
pnpm build

# Build and run server
pnpm --filter server build
pnpm --filter server start
```

### Debugging

1. Server logs to console by default
2. Use `tsx watch` for auto-reload during development
3. Check `/doc` endpoint for API schema validation
4. Swagger UI at `/ui` for interactive API testing
5. Scalar docs at `/scalar` for modern API documentation

## Project Conventions

### File Naming
- Use kebab-case for file names (e.g., `todo-routes.ts`)
- Use `.ts` extension for all TypeScript files
- Group related files in directories

### Code Organization
- Keep route definitions separate from handlers
- Use barrel exports (`index.ts`) for clean imports
- Define all schemas in the shared package
- Use type imports where possible (`import type`)

### Error Handling
- Use Zod for input validation (automatic 400 responses)
- Return appropriate HTTP status codes
- Include descriptive error messages
- Let Hono handle validation errors automatically

### Git Workflow
- The main branch is `main`
- Use conventional commits (feat:, fix:, chore:, docs:, etc.)
- Keep commits focused and atomic
- Build and lint before committing

## Key Implementation Notes

- **Japanese Examples**: The project uses Japanese text in examples (e.g., "人参を買う", "ジャガイモを買う")
- **No Tests**: Tests are not currently implemented
- **Web Not Implemented**: The web package exists but has no source code
- **In-Memory Storage**: Server uses temporary in-memory storage (resets on restart)
- **Biome Only**: Uses Biome instead of ESLint/Prettier for better performance
- **Type-Safe Routes**: All routes are type-safe with automatic OpenAPI generation
- **Shared Types**: All API types are centralized in the shared package

## Quick Reference

### Server URLs
- API Base: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/ui`
- Scalar Docs: `http://localhost:3000/scalar`
- OpenAPI Spec: `http://localhost:3000/doc`

### Package Locations
- Server Source: `/packages/server/src/`
- Shared Source: `/packages/shared/src/`
- Web Source: `/packages/web/src/` (to be created)

### Key Files
- Root Config: `/biome.json`
- Workspace: `/pnpm-workspace.yaml`
- Schemas: `/packages/shared/src/schemas.ts`
- Types: `/packages/shared/src/types.ts`
- Server Entry: `/packages/server/src/index.ts`
- TODO Routes: `/packages/server/src/todos/routes.ts`
- TODO Handlers: `/packages/server/src/todos/handlers.ts`