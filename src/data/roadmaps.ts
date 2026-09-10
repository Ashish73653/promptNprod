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
        recommendedProject: "Build an interactive CLI tool that generates validated TypeScript types from messy raw SQL queries."
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
  // Execute hybrid search: vector cosine similarity + tsvector full-text match
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
            code: `export async function executeAgentStep(history: Message[], tools: ToolDefinition[]) {
  const completion = await anthropic.messages.create({
    model: "claude-3-5-sonnet-latest",
    max_tokens: 1024,
    messages: history,
    tools: tools.map(t => ({ name: t.name, description: t.description, input_schema: t.schema }))
  });

  const toolUse = completion.content.find(block => block.type === "tool_use");
  if (!toolUse) {
    return { isFinished: true, output: completion.content[0].text };
  }

  return { isFinished: false, toolCall: { name: toolUse.name, input: toolUse.input } };
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
    title: "Next.js 15/16 & Modern Full-Stack Mastery",
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
        recommendedProject: "Build a responsive tech radar directory with nested category filters and zero client-side layout shifts."
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
          "Revalidating tags (`revalidateTag`) and paths",
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
        recommendedProject: "Create an MCP server suite that lets an agent securely access AWS CloudWatch, GitHub, and Jira."
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
  }
];
