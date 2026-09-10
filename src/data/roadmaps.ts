import { Roadmap } from "@/types";

export const roadmaps: Roadmap[] = [
  {
    id: "ai-engineer-2026",
    slug: "full-stack-ai-engineer",
    title: "Full-Stack AI Engineer (2026 Roadmap)",
    shortDesc: "Master prompt engineering, RAG pipelines, autonomous agents, Model Context Protocol (MCP), and production LLM evaluation.",
    description: "The complete, modern curriculum for developers transitioning into AI Engineering. Covers everything from embeddings and vector stores to multi-agent swarms, local models, and production observability.",
    level: "Intermediate",
    durationWeeks: 12,
    badge: "Most Popular",
    accentColor: "from-cyan-500 to-blue-600",
    iconName: "Bot",
    prerequisites: ["TypeScript or Python fundamentals", "Basic HTTP & REST knowledge", "Git & GitHub basics"],
    targetRoles: ["AI Engineer", "Full-Stack Engineer (AI focus)", "AI Solutions Architect"],
    milestones: [
      {
        id: "ai-m1",
        stepNumber: 1,
        title: "LLM Fundamentals & Prompt Engineering Patterns",
        description: "Understand tokens, context windows, temperature, top-p, few-shot prompting, chain-of-thought, and system instructions.",
        duration: "1-2 weeks",
        topics: [
          "Tokenization & Context Limits (BPE, tiktoken)",
          "Structured JSON Outputs & Schema Enforcement",
          "Few-Shot & Chain-of-Thought Prompting",
          "System Instructions & Persona Framing",
          "Function Calling & Tool Use Schemas"
        ],
        resources: [
          { title: "Anthropic Prompt Engineering Guide", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering", type: "Docs" },
          { title: "OpenAI Cookbook - Structured Outputs", url: "https://cookbook.openai.com/", type: "Repo" }
        ],
        recommendedProject: "Build an interactive CLI tool that generates validated TypeScript types from messy raw SQL queries.",
        projectBlueprint: {
          title: "Schema-Enforced SQL to TypeScript Generator CLI",
          objective: "Build an AI-powered developer CLI using structured LLM outputs that parses messy SQL schemas and generates strict, production-ready TypeScript interfaces.",
          stack: ["Node.js", "TypeScript", "Anthropic Claude SDK", "Zod", "Commander.js"],
          architecture: "CLI Command ──> Read SQL Files ──> Claude 3.5 Sonnet (JSON Schema Tool) ──> Zod Validation ──> Formatted TypeScript Types",
          features: [
            "Guaranteed JSON outputs using Zod schema constraints",
            "Automatic foreign-key relationship resolution to nested types",
            "Generates JSDoc comments detailing table column constraints",
            "Zero hallucinations via strict grammar enforcement"
          ],
          starterSnippet: {
            filename: "src/generator.ts",
            language: "typescript",
            code: `import { Anthropic } from "@anthropic-ai/sdk";
import { z } from "zod";

const anthropic = new Anthropic();

const SchemaDefinition = z.object({
  interfaces: z.array(
    z.object({
      name: z.string(),
      fields: z.array(z.object({ name: z.string(), type: z.string(), optional: z.boolean() }))
    })
  )
});

export async function generateTypes(sqlSchema: string) {
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-latest",
    max_tokens: 2048,
    system: "You are a compiler that converts SQL DDL schemas into strict TypeScript interfaces.",
    messages: [{ role: "user", content: \`Convert this schema:\\n\${sqlSchema}\` }],
  });
  return response.content[0];
}`
          }
        }
      },
      {
        id: "ai-m2",
        stepNumber: 2,
        title: "Embeddings, Vector Search & Modern RAG",
        description: "Move past naive chunking into production Retrieval-Augmented Generation with hybrid search, re-ranking, and pgvector.",
        duration: "2-3 weeks",
        topics: [
          "Vector Embeddings (text-embedding-3, nomic-embed)",
          "Semantic vs Keyword Search (BM25 + Cosine Similarity)",
          "Postgres + pgvector with HNSW Indexing",
          "Chunking Strategies (Recursive Character, Semantic, Markdown-aware)",
          "Cross-Encoder Re-Ranking with Cohere / FlashRank"
        ],
        resources: [
          { title: "pgvector Official Documentation", url: "https://github.com/pgvector/pgvector", type: "Repo" },
          { title: "RAG Triad & Evaluation Guide", url: "https://docs.llamaindex.ai", type: "Docs" }
        ],
        recommendedProject: "Build a 'Chat with your Git Repo' app that answers architecture questions with exact file & line citations.",
        projectBlueprint: {
          title: "High-Performance RAG Document Intelligence API",
          objective: "Build a production-grade RAG pipeline using Supabase pgvector with HNSW indexing, hybrid BM25 keyword search, and cross-encoder reranking.",
          stack: ["Next.js 16", "Postgres (pgvector)", "Drizzle ORM", "FlashRank", "TypeScript"],
          architecture: "User Query ──> Query Embedder ──> Hybrid Search (HNSW + GIN Full-Text) ──> Reciprocal Rank Fusion ──> Cross-Encoder Reranker ──> Streaming LLM Response",
          features: [
            "Sub-15ms vector similarity queries using HNSW indexing",
            "Hybrid BM25 keyword fallback to catch exact code identifiers",
            "Local cross-encoder reranking that reduces token costs by 70%",
            "Server-Sent Events (SSE) streaming with live source citations"
          ],
          starterSnippet: {
            filename: "lib/rag-search.ts",
            language: "typescript",
            code: `import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function hybridSearch(queryVector: number[], queryText: string, limit = 5) {
  return await db.execute(sql\`
    WITH vector_matches AS (
      SELECT id, content, 1 - (embedding <=> \${JSON.stringify(queryVector)}::vector) AS score
      FROM document_chunks
      ORDER BY embedding <=> \${JSON.stringify(queryVector)}::vector
      LIMIT 20
    ),
    text_matches AS (
      SELECT id, content, ts_rank(tsv_content, plainto_tsquery('english', \${queryText})) AS score
      FROM document_chunks
      WHERE tsv_content @@ plainto_tsquery('english', \${queryText})
      LIMIT 20
    )
    SELECT COALESCE(v.id, t.id) as id, COALESCE(v.content, t.content) as content
    FROM vector_matches v
    FULL OUTER JOIN text_matches t ON v.id = t.id
    LIMIT \${limit};
  \`);
}`
          }
        }
      },
      {
        id: "ai-m3",
        stepNumber: 3,
        title: "Model Context Protocol (MCP) & Agentic Workflows",
        description: "Build autonomous agents that utilize standard MCP servers, multi-step planning, self-correction, and tool routing.",
        duration: "3 weeks",
        topics: [
          "Model Context Protocol (MCP) Architecture",
          "Building MCP Stdio & SSE Servers in TypeScript",
          "Agent Loops (ReAct, Plan-and-Solve, Reflexion)",
          "State Management & Memory (Short-term scratchpads vs Long-term Vector DB)",
          "Human-in-the-loop safeguards & permission boundaries"
        ],
        resources: [
          { title: "Model Context Protocol Specification", url: "https://modelcontextprotocol.io", type: "Docs" },
          { title: "Anthropic MCP TypeScript SDK", url: "https://github.com/modelcontextprotocol/typescript-sdk", type: "Repo" }
        ],
        recommendedProject: "Build an autonomous GitHub PR triage agent using MCP that clones repos, runs tests, and posts review summaries.",
        projectBlueprint: {
          title: "Autonomous Research Agent with MCP Tools",
          objective: "Build an autonomous agent runtime in TypeScript that discovers MCP tools, executes dynamic API calls, and synthesizes structured insights.",
          stack: ["TypeScript", "Anthropic Claude 3.5", "MCP TypeScript SDK", "SQLite"],
          architecture: "Goal Input ──> ReAct Loop (Thought ──> Action ──> Tool Execution ──> Observation) ──> Step Limit Safeguards ──> Structured Summary",
          features: [
            "Dynamic tool schema discovery via standard MCP stdio protocol",
            "ReAct deterministic prompt loop with retry and error recovery",
            "Hard step counter to prevent infinite execution loops",
            "Audit log of all tool calls and observations recorded in SQLite"
          ],
          starterSnippet: {
            filename: "agent/react-loop.ts",
            language: "typescript",
            code: `export async function executeAgentStep(history: any[], tools: any[]) {
  const completion = await anthropic.messages.create({
    model: "claude-3-5-sonnet-latest",
    max_tokens: 1024,
    messages: history,
    tools: tools.map(t => ({ name: t.name, description: t.description, input_schema: t.schema }))
  });

  const toolUse = completion.content.find((block: any) => block.type === "tool_use");
  if (!toolUse) {
    return { isFinished: true, output: (completion.content[0] as any).text };
  }

  return { isFinished: false, toolCall: { name: (toolUse as any).name, input: (toolUse as any).input } };
}`
          }
        }
      },
      {
        id: "ai-m4",
        stepNumber: 4,
        title: "Local Models, Quantization & Open Weights",
        description: "Run and serve DeepSeek, Llama 3, and Qwen locally. Understand GGUF, vLLM, and low-cost on-prem inference.",
        duration: "2 weeks",
        topics: [
          "Running models via Ollama and vLLM",
          "Quantization formats (GGUF, AWQ, FP8)",
          "Structured generation with outlines and grammar masks",
          "Reasoning models (DeepSeek-R1) and thinking token management"
        ],
        resources: [
          { title: "Ollama Official Docs", url: "https://ollama.ai", type: "Docs" },
          { title: "vLLM High-Throughput Serving Engine", url: "https://docs.vllm.ai", type: "Repo" }
        ],
        recommendedProject: "Deploy an offline private code completion server that hooks directly into VS Code or Cursor."
      },
      {
        id: "ai-m5",
        stepNumber: 5,
        title: "LLM Evaluation, Observability & Production Hardening",
        description: "Set up automated test suites for prompts, cost telemetry, latency budgets, and guardrails against jailbreaks.",
        duration: "2 weeks",
        topics: [
          "LLM Evals: Faithfulness, Answer Relevance, Context Recall",
          "Tracing & Telemetry with Langfuse and OpenLLMetry",
          "Latency budgets, semantic caching, and streaming UX",
          "Prompt injection mitigation & output guardrails"
        ],
        resources: [
          { title: "Langfuse Open Source LLM Engineering", url: "https://langfuse.com", type: "Docs" }
        ],
        recommendedProject: "Add a full automated regression eval pipeline in GitHub Actions for your RAG system."
      }
    ]
  },
  {
    id: "nextjs-fullstack-mastery",
    slug: "nextjs-modern-fullstack",
    title: "Next.js 16 & Modern Full-Stack Mastery",
    shortDesc: "The definitive path to shipping blazing-fast apps: React 19 Server Components, Turbopack, Tailwind v4, and edge infrastructure.",
    description: "From React 19 concurrent features and Server Actions to caching strategies, Partial Prerendering (PPR), and production deployment on Vercel and VPS.",
    level: "Beginner",
    durationWeeks: 8,
    badge: "Essential",
    accentColor: "from-purple-500 to-indigo-600",
    iconName: "Globe",
    prerequisites: ["HTML/CSS & JavaScript fundamentals", "Basic React knowledge (hooks, components)"],
    targetRoles: ["Frontend Engineer", "Full-Stack Web Developer", "Next.js Specialist"],
    milestones: [
      {
        id: "next-m1",
        stepNumber: 1,
        title: "React 19 & Next.js App Router Architecture",
        description: "Master the mental model shift from client-rendered SPA to React Server Components (RSC) and streaming.",
        duration: "2 weeks",
        topics: [
          "Server Components vs Client Components boundaries",
          "Streaming with Suspense & loading.tsx patterns",
          "Nested Layouts, Route Groups, and Parallel Routes",
          "Tailwind CSS v4 Oxide setup & theme variables"
        ],
        resources: [
          { title: "Next.js Official Documentation", url: "https://nextjs.org/docs", type: "Docs" }
        ],
        recommendedProject: "Build a responsive tech radar directory with nested category filters and zero client-side layout shifts.",
        projectBlueprint: {
          title: "Streaming Tech Directory with React Server Components",
          objective: "Construct an ultra-fast developer resource radar utilizing React 19 Server Components, async data fetching, and Suspense fallback skeletons.",
          stack: ["Next.js 16", "React 19", "Tailwind CSS v4", "TypeScript"],
          architecture: "Server Request ──> Fetch Data in RSC (Zero Client JS) ──> Stream Shell Instantly ──> Suspense Stream Body ──> Instant Hydration",
          features: [
            "0kb client JavaScript footprint for static content cards",
            "Streaming UI boundaries using loading.tsx skeletons",
            "URL-synced search and category filtering via Nuqs search params"
          ],
          starterSnippet: {
            filename: "app/radar/page.tsx",
            language: "typescript",
            code: `import { Suspense } from "react";
import { RadarGrid } from "@/components/RadarGrid";
import { RadarSkeleton } from "@/components/RadarSkeleton";

export default async function RadarPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Real-Time Tech Radar</h1>
      <Suspense key={q} fallback={<RadarSkeleton />}>
        <RadarGrid query={q} />
      </Suspense>
    </main>
  );
}`
          }
        }
      },
      {
        id: "next-m2",
        stepNumber: 2,
        title: "Server Actions, Mutations & Optimistic UI",
        description: "Eliminate boilerplate REST endpoints by invoking server code directly from forms and buttons with type safety.",
        duration: "2 weeks",
        topics: [
          "Server Actions with Zod validation",
          "useActionState and useOptimistic hooks",
          "Revalidating tags (\`revalidateTag\`) and paths",
          "Error boundaries and accessible form handling"
        ],
        resources: [
          { title: "React 19 Hooks Guide", url: "https://react.dev/reference/react", type: "Docs" }
        ],
        recommendedProject: "Build a collaborative kanban board with optimistic drag-and-drop state."
      },
      {
        id: "next-m3",
        stepNumber: 3,
        title: "Database, Auth & State with Supabase / Neon",
        description: "Connect to managed Postgres with Drizzle or Prisma ORM, setup session auth, and enforce row-level security.",
        duration: "2 weeks",
        topics: [
          "Postgres with Drizzle ORM schemas & migrations",
          "Authentication flows (Supabase Auth / Clerk)",
          "Protected routes via Middleware",
          "Row-Level Security (RLS) policies"
        ],
        resources: [
          { title: "Drizzle ORM Documentation", url: "https://orm.drizzle.team", type: "Docs" }
        ],
        recommendedProject: "Build a subscription SaaS portal with user authentication, database models, and stripe checkout."
      },
      {
        id: "next-m4",
        stepNumber: 4,
        title: "Performance Optimization & Production Hardening",
        description: "Lighthouse 100/100, Partial Prerendering (PPR), Core Web Vitals audits, and self-hosting with Docker.",
        duration: "2 weeks",
        topics: [
          "Next.js Image and Font optimizations",
          "Partial Prerendering (PPR) dynamic holes",
          "Core Web Vitals profiling (LCP, INP, CLS)",
          "Deploying to Vercel and standalone Docker containers"
        ],
        resources: [
          { title: "Web.dev Core Web Vitals Guide", url: "https://web.dev/vitals", type: "Docs" }
        ],
        recommendedProject: "Ship a production-ready application achieving >95 performance scores across all Lighthouse metrics."
      }
    ]
  },
  {
    id: "agentic-systems-architect",
    slug: "agentic-systems-architect",
    title: "Agentic Systems & MCP Architect",
    shortDesc: "Design robust multi-agent swarms, resilient memory layers, tool protocols, and self-healing autonomous workflows.",
    description: "Deep-dive into production agent engineering: orchestrating multi-agent collaboration, deterministic guardrails, structured memory systems, and scalable tool calling.",
    level: "Advanced",
    durationWeeks: 10,
    badge: "Hot Skill",
    accentColor: "from-amber-500 to-rose-600",
    iconName: "Cpu",
    prerequisites: ["AI Engineering fundamentals", "Async programming in Python or TypeScript", "Docker & microservices basics"],
    targetRoles: ["Agentic Systems Architect", "Principal AI Engineer", "Automation Lead"],
    milestones: [
      {
        id: "agent-m1",
        stepNumber: 1,
        title: "Deterministic vs Probabilistic Agent Design",
        description: "Learn how to tame non-determinism with finite state machines, structured schemas, and fallback trees.",
        duration: "2 weeks",
        topics: [
          "State Machines for Agents (XState / LangGraph)",
          "Structured Output Validation with Retries",
          "Idempotency in Agent Tool Calls",
          "Failure Recovery & Backtracking Logic"
        ],
        resources: [
          { title: "LangGraph Architecture Concepts", url: "https://langchain-ai.github.io/langgraph/", type: "Docs" }
        ],
        recommendedProject: "Build a multi-step database migration agent that runs test queries, checks rollbacks, and self-corrects syntax errors."
      },
      {
        id: "agent-m2",
        stepNumber: 2,
        title: "Advanced MCP Server Development & Orchestration",
        description: "Design enterprise-grade MCP servers with caching, rate limiting, authentication, and dynamic resource subscriptions.",
        duration: "3 weeks",
        topics: [
          "MCP stdio vs SSE transports at scale",
          "Resource streaming & live file change notifications",
          "Security sandboxes & ephemeral Docker workers",
          "Connecting multiple MCP servers to a central orchestrator"
        ],
        resources: [
          { title: "Anthropic MCP Specification", url: "https://modelcontextprotocol.io", type: "Docs" }
        ],
        recommendedProject: "Create an MCP server suite that lets an agent securely access AWS CloudWatch, GitHub, and Jira.",
        projectBlueprint: {
          title: "Production GitHub & CloudWatch MCP Server Suite",
          objective: "Build a secure Model Context Protocol server exposing read/write tool primitives for DevOps triage to autonomous coding assistants.",
          stack: ["TypeScript", "@modelcontextprotocol/sdk", "Octokit", "AWS SDK v3", "Zod"],
          architecture: "AI Assistant Client (Claude/Cursor) ──(stdio/SSE)──> MCP Gateway Server ──> Rate Limiter ──> AWS / GitHub APIs",
          features: [
            "Strict read-only safety toggles for sensitive cloud regions",
            "Automatic rate-limit backoff with exponential jitter",
            "Formatted markdown tool response payloads with interactive links"
          ],
          starterSnippet: {
            filename: "src/server.ts",
            language: "typescript",
            code: `import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const server = new Server({ name: "devops-mcp-server", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "fetch_recent_errors",
      description: "Queries AWS CloudWatch for the last 50 fatal 500 error logs.",
      inputSchema: { type: "object", properties: { logGroup: { type: "string" } }, required: ["logGroup"] }
    }
  ]
}));

const transport = new StdioServerTransport();
await server.connect(transport);`
          }
        }
      },
      {
        id: "agent-m3",
        stepNumber: 3,
        title: "Multi-Agent Collaboration & Swarm Consensus",
        description: "Coordinate specialized agents (Researcher, Coder, Reviewer, Tester) with structured handoffs and voting protocols.",
        duration: "3 weeks",
        topics: [
          "Hierarchical vs Peer-to-Peer Agent topologies",
          "Message passing & context deduplication",
          "Consensus voting for high-stakes decisions",
          "Cost containment & recursion loop guards"
        ],
        resources: [
          { title: "OpenAI Swarm Framework & Patterns", url: "https://github.com/openai/swarm", type: "Repo" }
        ],
        recommendedProject: "Build a software engineering squad of 3 autonomous agents that takes a user story and outputs a tested PR."
      },
      {
        id: "agent-m4",
        stepNumber: 4,
        title: "Agent Evaluation, Observability & Security Red Teaming",
        description: "Benchmark your agent's success rate on SWE-bench style evals, detect infinite loops, and prevent indirect prompt injection.",
        duration: "2 weeks",
        topics: [
          "SWE-bench & WebArena evaluation harnesses",
          "Indirect prompt injection defenses",
          "Detailed execution traces with LangSmith / Langfuse",
          "Cost per successful task optimization"
        ],
        resources: [
          { title: "SWE-bench Official Benchmark", url: "https://www.swebench.com", type: "Docs" }
        ],
        recommendedProject: "Build a continuous evaluation test suite that scores your agent's reliability on 50 real-world bug tickets."
      }
    ]
  },
  {
    id: "cloud-native-devops",
    slug: "cloud-native-production-hardening",
    title: "Cloud-Native DevOps & Production Hardening",
    shortDesc: "From GitHub Actions CI/CD and Docker multi-stage builds to Kubernetes, Terraform, and zero-downtime deploys.",
    description: "Build the resilient foundation every modern application needs to survive high traffic, hardware failures, and security audits.",
    level: "Intermediate",
    durationWeeks: 8,
    badge: "Production Ready",
    accentColor: "from-emerald-500 to-teal-600",
    iconName: "ShieldCheck",
    prerequisites: ["Linux CLI basics", "Familiarity with container concepts", "Basic Git workflows"],
    targetRoles: ["DevOps Engineer", "Site Reliability Engineer (SRE)", "Cloud Architect"],
    milestones: [
      {
        id: "ops-m1",
        stepNumber: 1,
        title: "Docker Multi-Stage Builds & Container Security",
        description: "Write ultra-lightweight, secure container images for Node.js, Python, and Go applications.",
        duration: "2 weeks",
        topics: [
          "Multi-stage Dockerfiles & layer caching",
          "Non-root users & distroless base images",
          "Vulnerability scanning with Trivy",
          "Docker Compose for local development stacks"
        ],
        resources: [
          { title: "Docker Best Practices Guide", url: "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/", type: "Docs" }
        ],
        recommendedProject: "Reduce a 1.2GB fullstack web application container down to under 80MB using multi-stage alpine builds."
      },
      {
        id: "ops-m2",
        stepNumber: 2,
        title: "GitHub Actions CI/CD Pipeline Engineering",
        description: "Automate linting, unit tests, integration suites, preview environments, and zero-downtime releases.",
        duration: "2 weeks",
        topics: [
          "Matrix testing across OS & Node versions",
          "Reusable workflows and custom action composition",
          "Secrets management & OIDC authentication with AWS/GCP",
          "Automatic Vercel preview deploys on Pull Requests"
        ],
        resources: [
          { title: "GitHub Actions Documentation", url: "https://docs.github.com/en/actions", type: "Docs" }
        ],
        recommendedProject: "Build an automated CI/CD pipeline that blocks PRs failing coverage thresholds and deploys canary builds."
      },
      {
        id: "ops-m3",
        stepNumber: 3,
        title: "Observability: Sentry, OpenTelemetry & Prometheus",
        description: "Instrument your distributed system so you know about crashes before your users tweet about them.",
        duration: "2 weeks",
        topics: [
          "Error tracking & source map integration with Sentry",
          "Distributed tracing with OpenTelemetry",
          "Prometheus metrics & Grafana dashboards",
          "Alerting rules & on-call escalation"
        ],
        resources: [
          { title: "OpenTelemetry Quickstart", url: "https://opentelemetry.io/docs/", type: "Docs" }
        ],
        recommendedProject: "Instrument a Next.js + Postgres application with Sentry error boundaries and custom performance traces."
      },
      {
        id: "ops-m4",
        stepNumber: 4,
        title: "Infrastructure as Code & Cloud Hardening",
        description: "Provision reproducible cloud infrastructure using Terraform, secure VPCs, and automated database backups.",
        duration: "2 weeks",
        topics: [
          "Terraform state & modular infrastructure definitions",
          "Managed Postgres backups & point-in-time recovery",
          "Cloudflare DNS, SSL & DDoS protection rules",
          "Production readiness audit checklist"
        ],
        resources: [
          { title: "HashiCorp Terraform Tutorials", url: "https://developer.hashicorp.com/terraform", type: "Docs" }
        ],
        recommendedProject: "Provision a complete AWS production environment (VPC, ECS cluster, RDS Postgres) using Terraform code."
      }
    ]
  },
  {
    id: "system-design-backend-architect",
    slug: "system-design-backend-architect",
    title: "High-Scale Backend & Distributed Systems",
    shortDesc: "Design event-driven architectures, distributed caching, partition sharding, Kafka pipelines, and fault-tolerant microservices.",
    description: "Master the principles of scalable systems handling millions of concurrent requests: CAP theorem, consistent hashing, Raft consensus, idempotency keys, and zero-loss message streaming.",
    level: "Advanced",
    durationWeeks: 12,
    badge: "Staff Engineer Level",
    accentColor: "from-blue-600 to-violet-700",
    iconName: "Server",
    prerequisites: ["Strong Backend/API experience (Node.js, Go, or Java)", "Relational Database fundamentals", "Basic networking (TCP/IP, HTTP)"],
    targetRoles: ["Staff Backend Engineer", "Distributed Systems Engineer", "System Architect"],
    milestones: [
      {
        id: "dist-m1",
        stepNumber: 1,
        title: "Distributed Caching & Concurrency Control",
        description: "Master cache stampede prevention, cache-aside vs write-through, Redis distributed locks (Redlock), and optimistic locking.",
        duration: "2 weeks",
        topics: [
          "Cache-Aside, Write-Through & Write-Behind patterns",
          "Preventing Cache Stampede with Singleflight & Probabilistic Early Expiration (XFetch)",
          "Redis Distributed Locking with Lua scripts",
          "Optimistic Concurrency Control (OCC) with version columns in Postgres"
        ],
        resources: [
          { title: "Redis Distributed Locks Documentation", url: "https://redis.io/docs/manual/patterns/distributed-locks/", type: "Docs" },
          { title: "Designing Data-Intensive Applications", url: "https://dataintensive.net/", type: "Article" }
        ],
        recommendedProject: "Build a high-concurrency ticket booking engine that prevents overselling during flash sales with zero race conditions.",
        projectBlueprint: {
          title: "Zero-Oversell High-Throughput Ticket Booking API",
          objective: "Implement a ticket inventory reservation engine handling 10,000 req/sec with atomic Redis inventory decrement and Postgres ACID finalization.",
          stack: ["Node.js", "TypeScript", "Redis (IORedis)", "Postgres", "Docker"],
          architecture: "Client Request ──> API Gateway ──> Redis Atomic Lua Script (Decrement & Hold) ──> Async BullMQ Worker ──> Postgres Order Table",
          features: [
            "Atomic Lua reservation script running inside Redis in <1ms",
            "Automatic 10-minute hold expiration releasing unpurchased seats",
            "Idempotent payment webhook verification using Redis key leases",
            "Benchmarked with k6 to sustain 15,000 req/sec without deadlocks"
          ],
          starterSnippet: {
            filename: "src/inventory-lock.lua",
            language: "lua",
            code: `-- Atomic ticket reservation script
local eventKey = KEYS[1]
local userHoldKey = KEYS[2]
local seatsRequested = tonumber(ARGV[1])

local available = tonumber(redis.call('HGET', eventKey, 'available_seats') or 0)
if available >= seatsRequested then
    redis.call('HINCRBY', eventKey, 'available_seats', -seatsRequested)
    redis.call('SET', userHoldKey, seatsRequested, 'EX', 600)
    return 1
else
    return 0
end`
          }
        }
      },
      {
        id: "dist-m2",
        stepNumber: 2,
        title: "Event-Driven Architecture & Message Queues",
        description: "Build asynchronous, decoupled architectures using Apache Kafka, RabbitMQ, and AWS SQS with dead-letter handling.",
        duration: "3 weeks",
        topics: [
          "Kafka Partitions, Consumer Groups, and Offset Commits",
          "At-Least-Once vs Exactly-Once Semantics",
          "Transactional Outbox Pattern with Debezium & CDC",
          "Dead-Letter Queues (DLQ) & Poison Pill message isolation"
        ],
        resources: [
          { title: "Confluent Kafka Architecture Guide", url: "https://developer.confluent.io/learn/kafka-internals/", type: "Docs" }
        ],
        recommendedProject: "Implement the Transactional Outbox Pattern to guarantee 100% reliable event dispatch even during database outages."
      },
      {
        id: "dist-m3",
        stepNumber: 3,
        title: "Database Sharding, Partitioning & Consistent Hashing",
        description: "Scale databases horizontally beyond single-node limits using range, hash, and list sharding with virtual nodes.",
        duration: "3 weeks",
        topics: [
          "Vertical vs Horizontal Partitioning in PostgreSQL",
          "Consistent Hashing Ring algorithm with Virtual Nodes",
          "Cross-shard queries and Two-Phase Commit (2PC) trade-offs",
          "Vitess and Citus distributed database topologies"
        ],
        resources: [
          { title: "PostgreSQL Table Partitioning Docs", url: "https://www.postgresql.org/docs/current/ddl-partitioning.html", type: "Docs" }
        ],
        recommendedProject: "Build an in-memory Consistent Hashing router in TypeScript that redistributes keys with minimal cache disruption when nodes join/leave."
      },
      {
        id: "dist-m4",
        stepNumber: 4,
        title: "Resilience, Circuit Breakers & Rate Limiting",
        description: "Protect downstream services using token buckets, leaky buckets, bulkhead isolation, and automated circuit tripping.",
        duration: "2 weeks",
        topics: [
          "Token Bucket & Sliding Window Log rate limiting algorithms",
          "Circuit Breaker state machines (Closed, Open, Half-Open)",
          "Bulkhead isolation & connection pool sizing",
          "Chaos Engineering: injecting network partitions with Chaos Mesh"
        ],
        resources: [
          { title: "Microsoft Cloud Design Patterns: Circuit Breaker", url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker", type: "Docs" }
        ],
        recommendedProject: "Build an API Gateway middleware with sliding window rate limiting and automated circuit breaker fallback."
      },
      {
        id: "dist-m5",
        stepNumber: 5,
        title: "Consensus Algorithms & Distributed Transactions",
        description: "Demystify Raft, Paxos, Vector Clocks, and Saga Orchestration for cross-microservice workflows.",
        duration: "2 weeks",
        topics: [
          "The Raft Consensus Algorithm (Leader Election, Log Replication)",
          "Saga Pattern: Choreography vs Orchestration with Temporal.io",
          "Idempotency keys and compensating transactions",
          "Distributed tracing across async boundaries (W3C Trace Context)"
        ],
        resources: [
          { title: "The Secret Lives of Data (Raft Visualization)", url: "http://thesecretlivesofdata.com/raft/", type: "Docs" },
          { title: "Temporal.io Workflow Concepts", url: "https://docs.temporal.io/workflows", type: "Docs" }
        ],
        recommendedProject: "Build an e-commerce order checkout Saga with Temporal.io that orchestrates payment, inventory reservation, and shipment."
      }
    ]
  },
  {
    id: "cloud-solutions-architect-aws",
    slug: "cloud-solutions-architect-aws",
    title: "AWS Cloud Solutions Architect (SAA-C03 & SAP-C02)",
    shortDesc: "Master enterprise cloud architecture: multi-tier VPCs, IAM least-privilege, ECS/EKS microservices, DynamoDB Single-Table Design, and FinOps.",
    description: "Designed for engineers targeting AWS Certified Solutions Architect (Associate & Professional). Learn how to build highly available, fault-tolerant, cost-optimized cloud backbones.",
    level: "Intermediate",
    durationWeeks: 10,
    badge: "High ROI Career",
    accentColor: "from-amber-500 to-orange-600",
    iconName: "Cloud",
    prerequisites: ["Basic Linux/networking knowledge", "Familiarity with web application hosting"],
    targetRoles: ["Cloud Solutions Architect", "AWS Infrastructure Engineer", "Senior DevOps Engineer"],
    milestones: [
      {
        id: "aws-m1",
        stepNumber: 1,
        title: "Enterprise Networking: VPC, Subnets & Transit Gateway",
        description: "Architect secure multi-tier networking with public/private subnets, NAT Gateways, VPC Peering, and Route 53 DNS.",
        duration: "2 weeks",
        topics: [
          "CIDR subnet planning across Multiple Availability Zones (AZ)",
          "NAT Gateways, Internet Gateways & Egress-Only Gateways",
          "VPC Endpoints (PrivateLink) to prevent internet data exfiltration",
          "Route 53 latency-based routing & failover health checks"
        ],
        resources: [
          { title: "AWS VPC Architecture Whitepaper", url: "https://docs.aws.amazon.com/whitepapers/latest/aws-vpc-connectivity-options/", type: "Docs" }
        ],
        recommendedProject: "Write Terraform code to deploy a multi-AZ VPC with public subnets for ALBs and isolated private subnets for DB clusters.",
        projectBlueprint: {
          title: "Multi-AZ Production VPC with Terraform",
          objective: "Deploy a compliant 3-tier AWS network topology across 2 Availability Zones featuring public, private app, and database subnets with NAT redundancy.",
          stack: ["Terraform", "AWS CLI", "AWS VPC", "Route 53"],
          architecture: "Internet ──> ALB in Public Subnets ──> ECS Tasks in Private App Subnets ──> RDS Aurora in Isolated DB Subnets",
          features: [
            "Redundant NAT Gateways across us-east-1a and us-east-1b",
            "S3 Gateway Endpoint saving >$150/mo in NAT data transfer fees",
            "Flow Logs enabled to CloudWatch for automated intrusion alerts"
          ],
          starterSnippet: {
            filename: "vpc.tf",
            language: "hcl",
            code: `module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "prod-core-vpc"
  cidr = "10.0.0.0/16"

  azs              = ["us-east-1a", "us-east-1b"]
  public_subnets   = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets  = ["10.0.10.0/24", "10.0.11.0/24"]
  database_subnets = ["10.0.20.0/24", "10.0.21.0/24"]

  enable_nat_gateway     = true
  single_nat_gateway     = false
  one_nat_gateway_per_az = true
  enable_s3_endpoint     = true
}`
          }
        }
      },
      {
        id: "aws-m2",
        stepNumber: 2,
        title: "Identity & Access Management (IAM) & Security Hardening",
        description: "Enforce zero-trust with IAM roles, permission boundaries, SCPs, AWS KMS encryption, and AWS Secrets Manager.",
        duration: "2 weeks",
        topics: [
          "IAM Policies: Identity-based vs Resource-based vs Permission Boundaries",
          "Cross-account role assumption using AWS STS and External IDs",
          "Customer Managed Keys (CMK) in AWS KMS with envelope encryption",
          "Automated secret rotation with AWS Secrets Manager and Lambda"
        ],
        resources: [
          { title: "AWS IAM Best Practices", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html", type: "Docs" }
        ],
        recommendedProject: "Implement an automated secret rotation pipeline for PostgreSQL database credentials with zero app downtime."
      },
      {
        id: "aws-m3",
        stepNumber: 3,
        title: "Compute: ECS Fargate, Lambda & Event-Driven Architecture",
        description: "Choose the right compute engine: serverless containers (ECS Fargate), EventBridge buses, and API Gateway.",
        duration: "2 weeks",
        topics: [
          "ECS Fargate Task Definitions, Service Auto-scaling & ALB integration",
          "AWS Lambda cold starts, provisioned concurrency & VPC attachment",
          "Amazon EventBridge rule routing & dead-letter queue recovery",
          "AWS Step Functions for resilient multi-stage serverless workflows"
        ],
        resources: [
          { title: "AWS Serverless Land Architecture Patterns", url: "https://serverlessland.com/patterns", type: "Docs" }
        ],
        recommendedProject: "Build an event-driven media transcoding pipeline with S3 event triggers, Lambda, and EventBridge notifications."
      },
      {
        id: "aws-m4",
        stepNumber: 4,
        title: "Storage & Databases: Aurora, DynamoDB & S3 Lifecycle",
        description: "Master Amazon Aurora Global Databases, S3 intelligent tiering, and DynamoDB Single-Table Design patterns.",
        duration: "2 weeks",
        topics: [
          "Aurora Serverless v2, read replicas, and fast failover",
          "DynamoDB Single-Table Design (Partition Keys, Sort Keys & GSIs)",
          "S3 Lifecycle policies, Object Lock (WORM), and Replication",
          "ElastiCache Redis clusters with multi-AZ failover"
        ],
        resources: [
          { title: "Alex DeBrie's DynamoDB Guide", url: "https://www.alexdebrie.com/", type: "Article" }
        ],
        recommendedProject: "Design and implement an e-commerce data model in DynamoDB using Single-Table Design with composite primary keys."
      },
      {
        id: "aws-m5",
        stepNumber: 5,
        title: "Disaster Recovery, High Availability & Cloud FinOps",
        description: "Design Pilot Light, Warm Standby, and Multi-Region Active-Active DR strategies while slashing AWS cloud bills.",
        duration: "2 weeks",
        topics: [
          "RPO (Recovery Point Objective) & RTO (Recovery Time Objective) trade-offs",
          "Cross-Region disaster recovery architectures (Backup & Restore vs Active-Active)",
          "AWS Cost Explorer, Savings Plans, and Compute Reserved Instances",
          "AWS Well-Architected Framework review methodology"
        ],
        resources: [
          { title: "AWS Well-Architected Reliability Pillar", url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/", type: "Docs" }
        ],
        recommendedProject: "Conduct a mock Well-Architected Review on a production workload and output a prioritized remediation roadmap."
      }
    ]
  },
  {
    id: "database-internals-sql-mastery",
    slug: "database-internals-sql-mastery",
    title: "Database Internals & Advanced SQL Mastery",
    shortDesc: "Demystify storage engines (B+ Trees & LSM), write-ahead logs (WAL), MVCC, execution plans, window functions, and query optimization.",
    description: "Go beyond basic SELECT queries to understand how databases store bytes on disk, schedule locks, optimize relational algebra, and maintain ACID guarantees under high write loads.",
    level: "Intermediate",
    durationWeeks: 8,
    badge: "Core Engineering",
    accentColor: "from-cyan-600 to-teal-700",
    iconName: "Database",
    prerequisites: ["Basic SQL queries (SELECT, JOIN, GROUP BY)", "Fundamental data structures (Trees, Hash Tables)"],
    targetRoles: ["Database Administrator (DBA)", "Data Platform Engineer", "Senior Backend Engineer"],
    milestones: [
      {
        id: "db-m1",
        stepNumber: 1,
        title: "Disk Storage Engines: B+ Trees vs LSM Trees",
        description: "Learn how data pages, buffer pools, B+ Trees (Postgres/MySQL), and Log-Structured Merge Trees (RocksDB/Cassandra) work.",
        duration: "2 weeks",
        topics: [
          "Page Layout & Slotted Pages on Disk",
          "B+ Tree balancing, node splits, and fan-out calculation",
          "LSM Trees: MemTable, Write-Ahead Log (WAL), and SSTables",
          "Compaction strategies: Size-tiered vs Leveled Compaction"
        ],
        resources: [
          { title: "Database Internals Book by Alex Petrov", url: "https://www.databass.dev/", type: "Docs" },
          { title: "PostgreSQL Internals (Free Book)", url: "https://postgrespro.com/community/books/internals", type: "Docs" }
        ],
        recommendedProject: "Write a minimal in-memory append-only key-value store with Write-Ahead Logging (WAL) in TypeScript or Go.",
        projectBlueprint: {
          title: "Toy Storage Engine with Write-Ahead Log & Segment Compaction",
          objective: "Implement a crash-resilient key-value storage engine that persists writes to an append-only WAL before applying to an in-memory hash index.",
          stack: ["Node.js", "TypeScript", "Node FS (Streams)", "Binary Buffers"],
          architecture: "Write Key-Value ──> Append to WAL File (Disk) ──> Update In-Memory Index ──> Async Background Compaction",
          features: [
            "Crash recovery: replays WAL on startup to restore in-memory state",
            "Zero data loss on sudden power-off using fsync primitives",
            "Automatic segment compaction merging duplicate key updates"
          ],
          starterSnippet: {
            filename: "src/wal-engine.ts",
            language: "typescript",
            code: `import fs from "fs";

export class SimpleStorageEngine {
  private memTable = new Map<string, string>();
  private walStream: fs.WriteStream;

  constructor(private logPath: string) {
    this.recover();
    this.walStream = fs.createWriteStream(logPath, { flags: "a" });
  }

  private recover() {
    if (!fs.existsSync(this.logPath)) return;
    const lines = fs.readFileSync(this.logPath, "utf-8").split("\\n");
    for (const line of lines) {
      if (!line) continue;
      const [key, value] = line.split("=");
      this.memTable.set(key, value);
    }
  }

  public set(key: string, value: string) {
    this.walStream.write(\`\${key}=\${value}\\n\`);
    this.memTable.set(key, value);
  }

  public get(key: string): string | undefined {
    return this.memTable.get(key);
  }
}`
          }
        }
      },
      {
        id: "db-m2",
        stepNumber: 2,
        title: "Concurrency, MVCC & Transaction Isolation Levels",
        description: "Deep-dive into Multi-Version Concurrency Control (MVCC), deadlocks, VACUUM, and ACID isolation anomalies.",
        duration: "2 weeks",
        topics: [
          "Dirty Reads, Non-Repeatable Reads, Phantom Reads & Write Skew",
          "Postgres MVCC: xmin, xmax, and tuple header inspection",
          "Table Bloat & the PostgreSQL Autovacuum process",
          "Row-level vs Table-level locking modes (FOR UPDATE, FOR SHARE)"
        ],
        resources: [
          { title: "PostgreSQL Concurrency Control Docs", url: "https://www.postgresql.org/docs/current/mvcc.html", type: "Docs" }
        ],
        recommendedProject: "Simulate and write tests that reproduce the famous 'Write Skew' anomaly under Read Committed isolation and fix it with Serializable."
      },
      {
        id: "db-m3",
        stepNumber: 3,
        title: "Query Optimizer, EXPLAIN ANALYZE & Index Tuning",
        description: "Read query execution plans like a senior engineer. Optimize Seq Scans, Index Scans, Bitmap Scans, and Hash Joins.",
        duration: "2 weeks",
        topics: [
          "Reading EXPLAIN (ANALYZE, BUFFERS) outputs",
          "B-tree, GIN (Generalized Inverted Index), and GiST indexing",
          "Partial & Expression Indexes for cost optimization",
          "Index-Only Scans and the Visibility Map"
        ],
        resources: [
          { title: "Use The Index, Luke! SQL Indexing Guide", url: "https://use-the-index-luke.com/", type: "Docs" },
          { title: "Explain.dalibo.com Execution Visualizer", url: "https://explain.dalibo.com/", type: "Article" }
        ],
        recommendedProject: "Take a slow 10-second multi-join analytical query across 2 million rows and optimize it to execute in <12ms."
      },
      {
        id: "db-m4",
        stepNumber: 4,
        title: "Advanced SQL: Window Functions, CTEs & Analytics",
        description: "Master complex analytical queries using ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, and Recursive Common Table Expressions.",
        duration: "2 weeks",
        topics: [
          "Window Functions with PARTITION BY and ORDER BY framing",
          "Recursive CTEs for hierarchical tree traversal (Org charts, Bill of Materials)",
          "Pivoting rows to columns with FILTER clauses and CASE statements",
          "Lateral Joins for per-row subquery computation"
        ],
        resources: [
          { title: "Modern SQL Window Functions Tutorial", url: "https://modern-sql.com/feature/over", type: "Docs" }
        ],
        recommendedProject: "Build an interactive organizational hierarchy visualizer powered by a single recursive CTE query."
      }
    ]
  },
  {
    id: "rag-vector-data-engineering",
    slug: "production-rag-vector-engineering",
    title: "Production RAG & Vector Data Engineering",
    shortDesc: "Build enterprise search systems: dense embeddings, HNSW vs IVF indexing, BM25 hybrid fusion, semantic caching, and chunk optimization.",
    description: "Move beyond toy vector tutorials to production retrieval pipelines: handling millions of vectors, fine-tuning embeddings, chunk boundary preservation, and automated RAG triaging.",
    level: "Advanced",
    durationWeeks: 8,
    badge: "AI Infrastructure",
    accentColor: "from-pink-500 to-rose-600",
    iconName: "Search",
    prerequisites: ["Python or TypeScript proficiency", "Basic linear algebra (dot product, cosine distance)", "Familiarity with SQL"],
    targetRoles: ["RAG Specialist", "AI Search Engineer", "Vector Infrastructure Lead"],
    milestones: [
      {
        id: "rag-m1",
        stepNumber: 1,
        title: "Document Parsing & Semantic Chunking Pipelines",
        description: "Extract clean tokens from complex PDFs, tables, markdown, and codebases without breaking context across split lines.",
        duration: "2 weeks",
        topics: [
          "Recursive Character vs Sentence vs Semantic Window chunking",
          "Table parsing & OCR extraction strategies (Unstructured, LlamaParse)",
          "Parent-Document Retrieval & Small-to-Big Chunk mapping",
          "Metadata extraction for filtered vector queries"
        ],
        resources: [
          { title: "LlamaIndex Chunking Strategies Guide", url: "https://docs.llamaindex.ai/en/stable/module_guides/loading/documents_and_nodes/usage_documents/", type: "Docs" }
        ],
        recommendedProject: "Build a document processing worker that ingests technical PDFs and extracts tabular numbers with 100% preservation."
      },
      {
        id: "rag-m2",
        stepNumber: 2,
        title: "Vector Indexing Algorithms: HNSW, IVF & PQ",
        description: "Understand the mathematical algorithms powering pgvector, Qdrant, Milvus, and Pinecone: Hierarchical Navigable Small World graphs.",
        duration: "2 weeks",
        topics: [
          "Curse of Dimensionality in Vector Spaces",
          "HNSW graphs: M parameter, efConstruction, and search latency trade-offs",
          "IVF (Inverted File) clustering and Product Quantization (PQ)",
          "Memory footprint calculations for 10M+ 1536-dimensional vectors"
        ],
        resources: [
          { title: "Pinecone Vector Indexing Deep Dive", url: "https://www.pinecone.io/learn/series/faiss/vector-indexes/", type: "Article" }
        ],
        recommendedProject: "Benchmark pgvector HNSW vs IVFFlat index build times, recall rates, and query latency on a 500,000 vector dataset."
      },
      {
        id: "rag-m3",
        stepNumber: 3,
        title: "Hybrid Search & Reciprocal Rank Fusion (RRF)",
        description: "Combine the best of lexical search (BM25 keyword matches) with dense semantic embeddings to eliminate blind spots.",
        duration: "2 weeks",
        topics: [
          "Lexical BM25 inverted index scoring",
          "Reciprocal Rank Fusion (RRF) mathematical formula",
          "Metadata pre-filtering vs post-filtering performance",
          "Cross-Encoder Rerankers (bge-reranker-large, Cohere Rerank v3)"
        ],
        resources: [
          { title: "Elasticsearch Hybrid Search & RRF Tutorial", url: "https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html", type: "Docs" }
        ],
        recommendedProject: "Build a code search engine that can find exact method names ('findUserById') and natural language intents ('retrieve authenticated account')."
      },
      {
        id: "rag-m4",
        stepNumber: 4,
        title: "Semantic Caching & RAG Triad Evaluation",
        description: "Cut LLM costs by 60% with GPTCache / Redis semantic caches and automate evaluation with Ragas & TruLens.",
        duration: "2 weeks",
        topics: [
          "Semantic Caching with cosine similarity thresholding",
          "Ragas metrics: Faithfulness, Answer Relevance, Context Precision",
          "Golden Dataset synthesis using LLMs",
          "Continuous eval regression test suites in CI/CD"
        ],
        resources: [
          { title: "Ragas Framework Documentation", url: "https://docs.ragas.io/en/stable/", type: "Docs" }
        ],
        recommendedProject: "Implement a Redis-backed semantic cache proxy that intercepts identical and semantically similar queries before hitting OpenAI."
      }
    ]
  },
  {
    id: "senior-frontend-performance-ui",
    slug: "modern-frontend-performance-ui",
    title: "Senior Frontend Engineer & Web Performance",
    shortDesc: "Master the browser rendering engine, Core Web Vitals (INP/LCP), memory leak profiling, Web Workers, and scalable design systems.",
    description: "Move past component libraries to deep web engineering: understanding the DOM painting pipeline, optimizing long tasks, reducing JavaScript execution time, and architecting resilient design systems.",
    level: "Intermediate",
    durationWeeks: 8,
    badge: "High Demand",
    accentColor: "from-indigo-500 to-cyan-500",
    iconName: "Globe",
    prerequisites: ["Deep JavaScript/TypeScript knowledge", "Modern React or Vue experience", "CSS layout mastery (Grid, Flexbox)"],
    targetRoles: ["Senior Frontend Engineer", "Web Performance Lead", "Design Systems Engineer"],
    milestones: [
      {
        id: "fe-m1",
        stepNumber: 1,
        title: "Browser Rendering Engine: Critical Rendering Path",
        description: "Understand how Chrome transforms HTML/CSS bytes into pixels: DOM, CSSOM, Render Tree, Layout, and Composite.",
        duration: "2 weeks",
        topics: [
          "Critical Rendering Path & Render-blocking resources",
          "Layout Thrashing & Forced Synchronous Reflows",
          "GPU Compositing layers (\`will-change\`, \`transform: translateZ\`)",
          "Resource Hints: \`preload\`, \`prefetch\`, \`preconnect\`, and \`modulepreload\`"
        ],
        resources: [
          { title: "Google Web Fundamentals: Rendering Performance", url: "https://web.dev/rendering-performance/", type: "Docs" }
        ],
        recommendedProject: "Profile an intentional janky 60fps web animation, eliminate layout thrashing, and stabilize it at a flat 120fps."
      },
      {
        id: "fe-m2",
        stepNumber: 2,
        title: "Core Web Vitals Mastery: INP, LCP & CLS",
        description: "Diagnose and optimize Interaction to Next Paint (INP), Largest Contentful Paint (LCP), and Cumulative Layout Shift (CLS).",
        duration: "2 weeks",
        topics: [
          "Optimizing INP: Yielding to main thread with \`scheduler.yield()\` and \`requestIdleCallback\`",
          "LCP discovery: fetchpriority='high' and hero image optimization",
          "Eliminating CLS: aspect-ratio boxes, font fallbacks, and layout reservations",
          "Real User Monitoring (RUM) reporting via \`web-vitals\` library"
        ],
        resources: [
          { title: "Optimize Interaction to Next Paint (INP)", url: "https://web.dev/optimize-inp/", type: "Docs" }
        ],
        recommendedProject: "Build an open-source Core Web Vitals diagnostic dashboard that tracks real user interaction metrics and highlights slow long tasks."
      },
      {
        id: "fe-m3",
        stepNumber: 3,
        title: "Memory Profiling & Memory Leak Elimination",
        description: "Master Chrome DevTools Memory Inspector, Heap Snapshots, Allocation Timelines, and detached DOM nodes.",
        duration: "2 weeks",
        topics: [
          "Garbage Collection (V8 Orinoco, Generational GC)",
          "Common leak patterns: uncleared intervals, dangling closures, event listeners",
          "Detached DOM tree detection in Heap Snapshots",
          "WeakMap, WeakSet, and FinalizationRegistry in modern JavaScript"
        ],
        resources: [
          { title: "Chrome DevTools Memory Problems Guide", url: "https://developer.chrome.com/docs/devtools/memory-problems/", type: "Docs" }
        ],
        recommendedProject: "Locate and fix a simulated memory leak in a real-time charting dashboard that crashes the browser tab after 5 minutes."
      },
      {
        id: "fe-m4",
        stepNumber: 4,
        title: "Enterprise Design Systems & Headless UI Architecture",
        description: "Architect accessible, themeable component libraries using Radix UI, Tailwind CSS, and strict WCAG AA/AAA compliance.",
        duration: "2 weeks",
        topics: [
          "Compound Component patterns in React 19",
          "WAI-ARIA design patterns, focus rings, and keyboard navigation",
          "CSS token architecture with CSS Variables & modern color spaces (OKLCH)",
          "Automated visual regression testing with Playwright & Storybook"
        ],
        resources: [
          { title: "WAI-ARIA Authoring Practices Guide", url: "https://www.w3.org/WAI/ARIA/apg/", type: "Docs" }
        ],
        recommendedProject: "Build an accessible, fully keyboard-navigable Command Palette (Cmd+K) with fuzzy search and ARIA listbox roles."
      }
    ]
  },
  {
    id: "ai-safety-security-red-teaming",
    slug: "ai-safety-security-red-teaming",
    title: "AI Security, Red Teaming & LLM Guardrails",
    shortDesc: "Defend AI systems: indirect prompt injection, jailbreak mitigation, MCP tool permissions, data leakage prevention, and OWASP Top 10 for LLMs.",
    description: "Production LLMs create unprecedented security attack surfaces. Learn how ethical red teamers test models, build multi-layer guardrails, sandbox agent tool execution, and safeguard proprietary databases.",
    level: "Advanced",
    durationWeeks: 8,
    badge: "Critical Skill",
    accentColor: "from-red-500 to-rose-700",
    iconName: "Lock",
    prerequisites: ["Familiarity with LLM APIs and Agentic tool use", "Basic web application security (OWASP Top 10)"],
    targetRoles: ["AI Security Engineer", "Red Team Specialist", "Enterprise Trust & Safety Lead"],
    milestones: [
      {
        id: "sec-m1",
        stepNumber: 1,
        title: "OWASP Top 10 for LLMs & Prompt Injection Attacks",
        description: "Study real-world attack vectors: Direct Prompt Injection, Indirect Prompt Injection (via RAG or web scraping), and Jailbreaking.",
        duration: "2 weeks",
        topics: [
          "Direct vs Indirect Prompt Injection vectors",
          "Adversarial jailbreak techniques (Crescendo, Base64 encoding, persona hijacking)",
          "Insecure Output Handling (XSS via LLM generated markdown)",
          "Denial of Service via compute-heavy reasoning loops"
        ],
        resources: [
          { title: "OWASP Top 10 for Large Language Models", url: "https://genai.owasp.org/", type: "Docs" }
        ],
        recommendedProject: "Build an automated prompt fuzzing harness that tests an LLM system against 100 known injection attack payloads."
      },
      {
        id: "sec-m2",
        stepNumber: 2,
        title: "Guardrails Engineering: NeMo, Llama Guard & Rebuff",
        description: "Deploy real-time inference guardrails that inspect inputs and outputs for PII leaks, toxic content, and policy violations.",
        duration: "2 weeks",
        topics: [
          "NVIDIA NeMo Guardrails architecture (Colang language)",
          "Meta Llama Guard 3 classification model integration",
          "Automated PII anonymization & redaction (Microsoft Presidio)",
          "Deterministic output validation with regex & Zod fallback trees"
        ],
        resources: [
          { title: "NVIDIA NeMo Guardrails GitHub", url: "https://github.com/NVIDIA/NeMo-Guardrails", type: "Repo" }
        ],
        recommendedProject: "Build a security proxy middleware that redacts credit cards and passwords before prompts leave your network."
      },
      {
        id: "sec-m3",
        stepNumber: 3,
        title: "Agent Tool Sandboxing & Permission Boundaries",
        description: "Ensure autonomous agents cannot delete databases, exfiltrate API keys, or run malicious shell commands through MCP tools.",
        duration: "2 weeks",
        topics: [
          "Principle of Least Privilege for Agent Tool Schemas",
          "Container sandboxes (gVisor, Firecracker microVMs, Docker non-root)",
          "Human-in-the-loop confirmation gates for destructive actions",
          "Network egress filtering (blocking access to AWS IMDS metadata service)"
        ],
        resources: [
          { title: "Fly.io Firecracker MicroVM Architecture", url: "https://fly.io/blog/sandboxing-code/", type: "Article" }
        ],
        recommendedProject: "Build a secure code execution sandbox for an AI agent using Docker with zero internet access and strict CPU/RAM quotas."
      },
      {
        id: "sec-m4",
        stepNumber: 4,
        title: "Automated Red Teaming Harnesses & Compliance",
        description: "Run continuous automated adversarial benchmarks to verify that your safety guardrails hold up against emergent model behaviors.",
        duration: "2 weeks",
        topics: [
          "Automated Red Teaming with Promptfoo and Garak",
          "Model alignment evaluation (RLHF, DPO safety trade-offs)",
          "EU AI Act & NIST AI Risk Management Framework overview",
          "Incident response playbooks for AI security breaches"
        ],
        resources: [
          { title: "Promptfoo LLM Security & Eval Tool", url: "https://www.promptfoo.dev/", type: "Docs" }
        ],
        recommendedProject: "Integrate Promptfoo security evaluations into a GitHub Actions CI pipeline that fails any PR introducing an injection vulnerability."
      }
    ]
  }
];
