import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "autonomous-research-agent",
    slug: "autonomous-research-agent-mcp",
    title: "Autonomous Research Agent with Model Context Protocol (MCP)",
    shortDesc: "Build an autonomous AI agent in TypeScript that crawls research papers, takes notes via MCP tools, and synthesizes executive briefings.",
    description: "In this blueprint, you will build a complete autonomous agent utilizing Anthropic's Model Context Protocol. The agent connects to a custom local SQLite MCP server, fetches scientific papers via arXiv API, uses iterative self-reflection to verify citations, and exports formatted Markdown reports.",
    level: "Advanced",
    timeToBuild: "4-6 hours",
    category: "AI & Agents",
    stack: ["TypeScript", "Claude 3.5 Sonnet / DeepSeek", "@modelcontextprotocol/sdk", "SQLite", "Node.js"],
    architectureOverview: "Client (Agent Loop) ↔ JSON-RPC Transport ↔ MCP Server (Tools: search_arxiv, save_note, query_notes, compile_briefing) ↔ Local SQLite DB",
    prerequisites: [
      "Node.js v20+ installed",
      "Anthropic or OpenAI API key",
      "Basic understanding of async/await in TypeScript"
    ],
    features: [
      "Full JSON-RPC MCP server implementation with custom schemas",
      "Dynamic tool execution with input parameter validation using Zod",
      "Persistent note storage and cross-reference queries via SQLite",
      "Streaming reasoning loop with thinking token capture",
      "Automatic citation verification and source attribution"
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Initialize TypeScript Project & Install MCP SDK",
        description: "Set up the project directory, install the official Model Context Protocol TypeScript SDK, and configure tsconfig.json.",
        codeSnippet: {
          filename: "package.json",
          language: "json",
          code: `{
  "name": "mcp-research-agent",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.5.0",
    "@anthropic-ai/sdk": "^0.36.0",
    "better-sqlite3": "^11.8.1",
    "zod": "^3.24.2"
  }
}`
        },
        proTip: "Make sure 'type': 'module' is declared in package.json to use modern ES modules without bundling issues."
      },
      {
        stepNumber: 2,
        title: "Build the Custom MCP SQLite Server",
        description: "Create the MCP server exposing tools for storing extracted takeaways, tagging entities, and running full-text search.",
        codeSnippet: {
          filename: "server.ts",
          language: "typescript",
          code: `import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import Database from "better-sqlite3";

const db = new Database("research.db");
db.exec(\`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    paper_title TEXT,
    insight TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
\`);

const server = new Server({ name: "research-vault", version: "1.0.0" }, {
  capabilities: { tools: {} }
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "save_insight",
      description: "Saves an extracted research insight into the local vault",
      inputSchema: {
        type: "object",
        properties: {
          paper_title: { type: "string" },
          insight: { type: "string" }
        },
        required: ["paper_title", "insight"]
      }
    }
  ]
}));

const transport = new StdioServerTransport();
await server.connect(transport);`
        }
      },
      {
        stepNumber: 3,
        title: "Implement the Autonomous Agent Planning Loop",
        description: "Write the ReAct reasoning loop that queries arXiv, evaluates abstracts, stores notes via the MCP server, and generates the final synthesis report.",
        codeSnippet: {
          filename: "agent.ts",
          language: "typescript",
          code: `import Anthropic from "@anthropic-ai/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const client = new Client({ name: "research-orchestrator", version: "1.0.0" }, {});
const transport = new StdioClientTransport({
  command: "node",
  args: ["dist/server.js"]
});

await client.connect(transport);
const tools = await client.listTools();
console.log("Connected to MCP tools:", tools.tools.map(t => t.name));`
        }
      }
    ]
  },
  {
    id: "rag-document-intelligence",
    slug: "high-performance-rag-api",
    title: "High-Performance RAG Document Intelligence API",
    shortDesc: "Build a production RAG service with Next.js Route Handlers, Supabase pgvector, hybrid search, and streaming answers.",
    description: "Learn how to build a scalable document ingestion and retrieval service. Upload PDF/DOCX manuals, chunk intelligently with Markdown boundaries, index into pgvector HNSW, and stream grounded answers with exact source chunk highlights.",
    level: "Intermediate",
    timeToBuild: "3-4 hours",
    category: "Full-Stack",
    stack: ["Next.js 15", "Supabase Postgres", "pgvector", "OpenAI text-embedding-3-small", "Tailwind CSS"],
    architectureOverview: "PDF Upload ↔ Semantic Chunker ↔ Embeddings API ↔ Postgres HNSW Index ↔ Hybrid Reciprocal Rank Fusion ↔ Streaming LLM Response",
    prerequisites: [
      "Supabase account (free tier)",
      "OpenAI API key",
      "Next.js App Router experience"
    ],
    features: [
      "Multi-tenant file isolation with Supabase Row-Level Security (RLS)",
      "High-recall hybrid search combining Postgres tsvector + vector cosine similarity",
      "Chunk preview highlighting matched quotes in source documents",
      "Streaming SSE responses with zero latency bottlenecks",
      "Exportable conversation history and feedback telemetry"
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Provision Postgres & Enable the pgvector Extension",
        description: "Configure your database schema with document chunks, HNSW index, and hybrid search helper functions.",
        codeSnippet: {
          filename: "schema.sql",
          language: "sql",
          code: `CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL,
  content TEXT NOT NULL,
  fts tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED,
  embedding vector(1536) NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX ON document_chunks USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ON document_chunks USING gin (fts);`
        }
      },
      {
        stepNumber: 2,
        title: "Implement Semantic Chunking and Ingestion Route",
        description: "Parse incoming documents and compute vector embeddings in batches using Next.js Route Handlers.",
        codeSnippet: {
          filename: "src/app/api/ingest/route.ts",
          language: "typescript",
          code: `import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  const { documentId, chunks } = await req.json();
  
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: chunks,
  });

  const records = chunks.map((chunk: string, i: number) => ({
    document_id: documentId,
    content: chunk,
    embedding: embeddingResponse.data[i].embedding
  }));

  // Store into Supabase via client
  return NextResponse.json({ success: true, count: records.length });
}`
        }
      }
    ]
  },
  {
    id: "realtime-saas-analytics",
    slug: "realtime-saas-analytics-dashboard",
    title: "Realtime Multi-tenant SaaS Analytics Dashboard",
    shortDesc: "Ship a blazing-fast telemetry dashboard using Next.js 16 Server Components, Server-Sent Events, and Tailwind v4.",
    description: "Construct a complete production SaaS dashboard with live event streams, role-based tenant routing, animated chart components, and sub-100ms cold start performance.",
    level: "Beginner",
    timeToBuild: "2-3 hours",
    category: "Full-Stack",
    stack: ["Next.js", "React 19", "Tailwind CSS v4", "Lucide React", "Framer Motion"],
    architectureOverview: "Edge Cache CDN ↔ Partial Prerendered Shell ↔ SSE Realtime Event Stream ↔ Animated SVG Sparklines",
    prerequisites: [
      "Basic React component state",
      "Tailwind CSS fundamentals"
    ],
    features: [
      "Instant loading state with Partial Prerendering (PPR) skeletons",
      "Live event ticker streaming synthetic server health metrics",
      "Spotlight card interactions with GPU-accelerated motion",
      "Mobile responsive navigation with command palette"
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Create the Metric Card Component with Sparkline",
        description: "Build an accessible, animated KPI card that renders smoothly on both desktop and mobile devices.",
        codeSnippet: {
          filename: "src/components/MetricCard.tsx",
          language: "typescript",
          code: `export function MetricCard({ title, value, change, trend }: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        <span className={\`text-xs font-semibold px-2 py-0.5 rounded-full \${trend === "up" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}\`}>
          {change}
        </span>
      </div>
    </div>
  );
}`
        }
      }
    ]
  },
  {
    id: "ai-code-reviewer-bot",
    slug: "ai-code-reviewer-github-bot",
    title: "AI-Powered Code Reviewer GitHub Bot",
    shortDesc: "Automate code quality, security vulnerability audits, and breaking change detection on GitHub Pull Requests.",
    description: "Build a GitHub Webhook handler that intercepts Pull Requests, computes unified diffs, runs static analysis, and invokes an LLM to post contextual inline comments on specific line numbers.",
    level: "Intermediate",
    timeToBuild: "3-5 hours",
    category: "Dev Tools",
    stack: ["TypeScript", "Octokit (GitHub REST & Webhooks)", "Next.js Route Handlers", "Claude 3.5 Sonnet"],
    architectureOverview: "GitHub PR Event ↔ Webhook Signature Verification ↔ Diff Parser ↔ LLM Review Engine ↔ GitHub Pull Request Review Comments API",
    prerequisites: [
      "GitHub account with repo admin permissions",
      "Anthropic or OpenAI API key"
    ],
    features: [
      "HMAC-SHA256 GitHub Webhook payload verification",
      "Git diff chunk parser isolating added and modified lines",
      "Structured JSON critique formatting with line-level suggestions",
      "Auto-labeling of PRs based on detected risk scores"
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Configure GitHub App & Webhook Secret",
        description: "Register a GitHub App with 'Pull Requests: Read & Write' permissions and configure your webhook endpoint.",
        proTip: "Use `smee.io` or `ngrok` during local development to proxy GitHub webhooks straight to your localhost."
      }
    ]
  }
];
