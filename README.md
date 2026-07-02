<div align="center">
  <a href="https://nodebase-26.vercel.app/">
    <img src="public/logos/logo.svg" alt="Nodebase Logo" width="120" height="120">
  </a>

  # Nodebase - AI-Powered Workflow Automation

  [![Website](https://img.shields.io/badge/Website-Visit%20App-blue?style=for-the-badge&logo=vercel)](https://nodebase-26.vercel.app/)
</div>

Nodebase is a powerful, low-code workflow automation platform designed to integrate seamlessly with AI models and various developer tools. It allows users to create complex automation flows using a node-based visual editor, connecting triggers, actions, AI agents, and third-party services.

## 🌟 Core Concepts

### Intelligent Workflow Orchestration
Nodebase isn't just a linear task runner. It features a sophisticated **AI Agent Node** that can orchestrate other nodes.
- **Dynamic Execution**: Connect "AI Chat Model" or "Database" nodes to an AI Agent, and the Agent will dynamically decide when and how to call them.
- **Context Awareness**: The AI Agent maintains context and can chain multiple tool calls to solve complex problems.

### Execution Engine
- **Inngest-Powered**: Uses durable execution to handle long-running workflows and retries automatically.
- **Topological Sorting**: Automatically determines the correct execution order based on node dependencies.
- **Hybrid Execution**: Supports both standard sequential flows and AI-orchestrated dynamic flows in the same graph.
- **Realtime Updates**: Execution status and logs are streamed live to the editor via Inngest Realtime and Socket.io.

## 🧩 Available Nodes

### ⚡ Triggers
- **Manual**: Trigger workflows on-demand.
- **Webhook**: Receive payloads from any external service.
- **Schedule**: Cron-based recurring workflows.
- **Google Forms**: Trigger on new form responses.
- **Stripe**: Trigger on payments or other Stripe events.

### 🤖 AI & Models
- **Chat Models**: OpenAI, Anthropic (Claude), Gemini, OpenRouter — powered by the Vercel AI SDK.
- **AI Agent**: A meta-node that orchestrates tools and other models.
- **MCP Tools**: First-class support for **Model Context Protocol** servers.

### 🔌 Integrations
- **Communication**: Discord, Slack, Telegram.
- **Databases**: PostgreSQL (Query & Mutate), MongoDB (CRUD).
- **Utilities**: HTTP Request (REST), JSON manipulation.

## 🏗️ Architecture Highlights

### Extensibility
The system is designed for extensibility. Adding a new node type involves:
1. **Definition**: Add the node type to `schema.prisma`.
2. **Registry**: Register the executor in `src/features/executions/lib/executor-registry.ts`.
3. **UI**: Create a component in `src/features/editor/components/nodes`.

### Subscription Limits
The codebase includes built-in "Free Tier" enforcement (100 executions/month) managed via **Polar.sh**. This is checked at runtime in `src/inngest/functions.ts` before every workflow run.

### Observability
Error monitoring and performance tracing are wired up with **Sentry** (`sentry.server.config.ts`, `sentry.edge.config.ts`).

## 🛠️ Tech Stack

- **Framework**: ![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat&logo=next.js&logoColor=white)
- **Language**: ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
- **Styling**: ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) ![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=flat&logo=radix-ui&logoColor=white)
- **Node Editor Canvas**: ![React Flow](https://img.shields.io/badge/React_Flow-FF0072?style=flat&logo=react&logoColor=white) (`@xyflow/react`)
- **AI Integration**: ![Vercel AI SDK](https://img.shields.io/badge/AI_SDK-000000?style=flat&logo=vercel&logoColor=white) (`@ai-sdk/anthropic`, `@ai-sdk/openai`, `@ai-sdk/google`)
- **API Layer**: ![tRPC](https://img.shields.io/badge/tRPC-2596BE?style=flat&logo=trpc&logoColor=white)
- **Database**: ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
- **State Management**: ![Jotai](https://img.shields.io/badge/Jotai-000000?style=flat&logo=jotai&logoColor=white) ![React Query](https://img.shields.io/badge/React_Query-FF4154?style=flat&logo=react-query&logoColor=white)
- **Background Jobs**: ![Inngest](https://img.shields.io/badge/Inngest-333333?style=flat&logo=inngest&logoColor=white)
- **Realtime**: ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)
- **Authentication**: ![Better Auth](https://img.shields.io/badge/Better_Auth-000000?style=flat&logo=better-auth&logoColor=white)
- **Payments**: ![Polar.sh](https://img.shields.io/badge/Polar.sh-000000?style=flat&logo=polar&logoColor=white)
- **Error Monitoring**: ![Sentry](https://img.shields.io/badge/Sentry-362D59?style=flat&logo=sentry&logoColor=white)
- **Motion**: ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white)
- **Linting/Formatting**: ![Biome](https://img.shields.io/badge/Biome-60A5FA?style=flat&logo=biome&logoColor=white)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (or pnpm/yarn)
- **PostgreSQL** database

## 🔧 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Gaurav11oo/nodebase
cd nodebase
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory and add the following variables. You can use the reference below:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nodebase"

# Authentication (Better Auth)
BETTER_AUTH_SECRET="your-generated-secret"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth Providers
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Payments (Polar.sh)
POLAR_ACCESS_TOKEN="your-polar-access-token"
POLAR_SUCCESS_URL="http://localhost:3000/dashboard"

# Security
ENCRYPTION_KEY="your-32-char-random-key"

# Error Monitoring (Sentry)
SENTRY_DSN="your-sentry-dsn"

# App Configuration
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

```

### 4. Database Setup

Run the Prisma migration to create the database schema:

```bash
npx prisma migrate dev
```

### 5. Start the Development Server

You need to run both the Next.js dev server and the Inngest dev server.

```bash
# Term 1: Start Next.js App
npm run dev

# Term 2: Start Inngest Dev Server
npm run inngest:dev
```

Alternatively, since `mprocs` is bundled as a dependency, you can run all services with:

```bash
npm run dev:all
```

The app will be available at `http://localhost:3000`.
The Inngest dashboard will be available at `http://localhost:8288`.

## 📂 Project Structure

```
├── config/                 # App-level configuration
├── prisma/                 # Database schema
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router pages and API routes
│   │   ├── (auth)/         # Authentication pages
│   │   ├── (dashboard)/    # Main dashboard application
│   │   └── api/            # Backend API endpoints
│   ├── components/         # Reusable UI components
│   ├── features/           # Feature-based modules
│   │   ├── auth/           # Authentication logic
│   │   ├── credentials/    # Credentials management
│   │   ├── editor/         # Workflow editor components (React Flow canvas)
│   │   ├── executions/     # Workflow execution logic
│   │   ├── triggers/       # Trigger definitions (Webhook, Schedule, etc.)
│   │   └── workflows/      # Workflow CRUD and management
│   ├── lib/                # Shared utilities (DB, Auth, Encryption)
│   ├── trpc/               # tRPC setup
│   └── inngest/            # Inngest functions and client
├── prisma.config.ts        # Prisma configuration
├── sentry.server.config.ts # Sentry server config
├── sentry.edge.config.ts   # Sentry edge config
├── mprocs.yaml             # Multi-process dev runner config
├── ngrok.yml                # Ngrok tunnel config for local webhook testing
├── AGENTS.md                # Notes/instructions for AI coding agents
└── CLAUDE.md                 # Claude-specific project context
```

## 📜 Scripts

- `npm run dev`: Starts the Next.js development server (Turbopack).
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run inngest:dev`: Starts the Inngest local development server.
- `npm run lint`: Checks for linting errors using Biome.
- `npm run format`: Formats code using Biome.
- `npm run ngrok:dev`: Exposes local server via Ngrok for webhook testing.
- `npm run dev:all`: Runs the Next.js app, Inngest dev server, and other processes together via `mprocs`.

## 👤 Developer
[Gaurav11oo](https://github.com/Gaurav11oo)

> Based on the original Nodebase project. See the [repository](https://github.com/Gaurav11oo/nodebase) for the latest source and the [live deployment](https://nodebase-26.vercel.app) for a hosted demo.
