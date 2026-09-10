import { StudyNote } from "@/types";

export const studyNotes: StudyNote[] = [
  {
    id: "rag-architecture-vector-db",
    slug: "rag-architecture-vector-db",
    title: "RAG Architecture: It Was Free vs It Was NOT Free",
    shortDesc: "The architectural reality of production RAG. Why naive vector search breaks, how token costs sneak up, and how to build a hybrid search engine.",
    category: "AI & Agents",
    icon: "⚡",
    coverImage: "/instagram/reel-rag-architecture.jpg",
    readTime: "6 min read",
    updatedAt: "March 2026",
    tags: ["RAG", "pgvector", "Embeddings", "Cloud Costs", "Vector DB"],
    linkedReelUrl: "https://www.instagram.com/reel/DdEvoULz_5D/",
    notionUrl: "https://notion.so/promptnprod/rag-architecture",
    keyTakeaways: [
      "Naive chunking without semantic boundaries destroys context across document sections.",
      "Dedicated SaaS vector databases get expensive quickly—Postgres with pgvector (HNSW) handles 95% of use cases with zero added infra.",
      "Hybrid search (BM25 keyword search + Dense Vector cosine similarity) outperforms pure vector search on codebases and technical docs.",
      "Cross-encoder reranking (Cohere or FlashRank) filters out 80% of irrelevant retrieved chunks before sending to the LLM, slashing token costs."
    ],
    sections: [
      {
        title: "The Naive RAG Trap",
        type: "callout",
        calloutType: "warning",
        content: "POV: You shipped RAG in a weekend with LangChain and Pinecone. It was free in dev. Then 1,000 users joined, token costs skyrocketed 800%, and users complained the AI hallucinated answers from page 2 when the real answer was in a table on page 4."
      },
      {
        title: "Architecture Breakdown: Dev vs Production",
        type: "text",
        content: [
          "In naive RAG, documents are split every 500 characters with 50-character overlap. Each chunk is embedded using an OpenAI model and pushed to a vector store.",
          "When a user asks a question, the vector store returns the top 5 closest chunks based on cosine distance. But cosine distance only measures semantic similarity—not relevance. If a chunk mentions the user's keywords in an unrelated section, it pollutes the prompt window."
        ]
      },
      {
        title: "Production Architecture Flow",
        type: "diagram",
        content: "User Query ──> Query Rewriter / Expansion ──> Hybrid Retrieval (BM25 + pgvector HNSW) ──> Reciprocal Rank Fusion (RRF) ──> Cross-Encoder Reranker (Top 3) ──> LLM Response"
      },
      {
        title: "Postgres + pgvector Production Schema",
        type: "code",
        codeSnippet: {
          language: "sql",
          caption: "Schema with HNSW indexing for sub-10ms vector similarity lookup",
          code: `-- Enable pgvector extension in Postgres
CREATE EXTENSION IF NOT EXISTS vector;

-- Document chunks table with embeddings and full-text search
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  tsv_content TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', content)) STORED,
  embedding VECTOR(1536), -- text-embedding-3-small dimension
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create HNSW index for high-speed approximate nearest neighbor search
CREATE INDEX ON document_chunks 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Create GIN index for full-text keyword search (BM25 companion)
CREATE INDEX ON document_chunks USING GIN (tsv_content);`
        }
      },
      {
        title: "The Cost Breakdown Rule of Thumb",
        type: "callout",
        calloutType: "tip",
        content: "Don't send 10 chunks to your primary LLM. Retrieve 20 chunks via hybrid search, use a lightweight local reranker (like FlashRank in Node.js) to score them, and pass only the top 3 high-confidence chunks. You save 70% on token generation costs."
      }
    ]
  },
  {
    id: "how-ai-agents-actually-work",
    slug: "how-ai-agents-actually-work",
    title: "How AI Agents Actually Work: ReAct Loops & Tool Use",
    shortDesc: "Demystifying AI Agents. How LLMs go from static text generators into autonomous problem solvers using Thought, Action, Observation, and State Machines.",
    category: "AI & Agents",
    icon: "🤖",
    coverImage: "/instagram/reel-ai-agents.jpg",
    readTime: "7 min read",
    updatedAt: "March 2026",
    tags: ["AI Agents", "ReAct", "MCP", "Tool Calling", "TypeScript"],
    linkedReelUrl: "https://www.instagram.com/reel/DdEwTujz-LV/",
    notionUrl: "https://notion.so/promptnprod/ai-agents-work",
    keyTakeaways: [
      "An 'agent' is simply an LLM placed inside a deterministic while-loop with access to callable tool functions.",
      "The ReAct pattern (Reasoning + Acting) forces the LLM to write its rationale before emitting tool parameters.",
      "Model Context Protocol (MCP) standardizes how agents discover and execute tools across local files, databases, and APIs.",
      "Without strict step limits and state validation, agents quickly enter infinite retry loops and burn API credits."
    ],
    sections: [
      {
        title: "What is an AI Agent in Plain English?",
        type: "callout",
        calloutType: "note",
        content: "An AI Agent is NOT sentient code. It is an LLM prompted with a JSON tool schema running in a loop: 1. Receive task -> 2. Decide next step (Thought) -> 3. Call tool (Action) -> 4. Read result (Observation) -> 5. Repeat until goal is complete."
      },
      {
        title: "The ReAct Execution Loop (TypeScript)",
        type: "code",
        codeSnippet: {
          language: "typescript",
          caption: "Minimal deterministic agent runtime with self-correction and max step safeguards",
          code: `interface AgentTool {
  name: string;
  description: string;
  execute: (args: Record<string, unknown>) => Promise<string>;
}

async function runAgent(goal: string, tools: AgentTool[], maxSteps = 8) {
  const history: Message[] = [
    { role: "system", content: "You solve tasks using tools. Format: Thought -> Action -> Action_Input" },
    { role: "user", content: goal }
  ];

  for (let step = 1; step <= maxSteps; step++) {
    const response = await llm.chat({ messages: history, tools });

    if (!response.toolCall) {
      // Agent determined task is finished
      return response.content;
    }

    const { name, args } = response.toolCall;
    const tool = tools.find(t => t.name === name);
    
    if (!tool) {
      history.push({ role: "tool", content: \`Error: Tool \${name} does not exist.\` });
      continue;
    }

    // Execute tool and inject observation back into context
    const observation = await tool.execute(args);
    history.push({ role: "assistant", content: response.content });
    history.push({ role: "tool", content: observation });
  }

  throw new Error("Agent reached maximum step limit without resolving task.");
}`
        }
      },
      {
        title: "Why Agents Fail in Production",
        type: "callout",
        calloutType: "warning",
        content: "1. Tool parameter drift: LLM hallucinating extra arguments not in your Zod schema. Always validate with safeParse().\\n2. Context bloating: Dumping 100KB tool output into prompt crashes the context window. Always summarize tool outputs before feeding back to the agent."
      }
    ]
  },
  {
    id: "sql-joins-visual-guide",
    slug: "sql-joins-visual-guide",
    title: "Visual SQL JOINs Guide: Watch What Happens to the Rows",
    shortDesc: "Venn diagrams lied to you. Here is what actually happens to table rows during INNER, LEFT, RIGHT, FULL OUTER, and CROSS joins.",
    category: "Databases & SQL",
    icon: "📊",
    coverImage: "/instagram/reel-sql-joins.jpg",
    readTime: "5 min read",
    updatedAt: "March 2026",
    tags: ["SQL", "Postgres", "Database", "Performance", "Indexing"],
    linkedReelUrl: "https://www.instagram.com/reel/DdEK7oCzOH9/",
    notionUrl: "https://notion.so/promptnprod/sql-joins-visual",
    keyTakeaways: [
      "Venn diagrams represent set theory, but SQL joins operate on rows. A join can produce MORE rows than either original table.",
      "INNER JOIN deletes non-matching rows from both tables.",
      "LEFT JOIN guarantees all rows from Table A appear, filling missing Table B columns with NULL.",
      "A missing index on the foreign key turns an O(N) Hash Join into an O(N * M) Nested Loop, freezing your database."
    ],
    sections: [
      {
        title: "The Venn Diagram Fallacy",
        type: "callout",
        calloutType: "note",
        content: "Most tutorials teach joins using circles. But if Table A has 3 rows matching 4 rows in Table B on the same ID, an INNER JOIN returns 12 rows! Circles cannot represent row multiplication."
      },
      {
        title: "Quick Reference Matrix",
        type: "text",
        content: [
          "• INNER JOIN: Only keeps rows where the condition matches in BOTH tables.",
          "• LEFT JOIN: Keeps EVERY row from Left, plus matching data from Right (or NULLs).",
          "• FULL OUTER JOIN: Keeps all rows from both sides, matching where possible.",
          "• ANTI-JOIN (LEFT JOIN WHERE right.id IS NULL): Finds orphan records (e.g. users with 0 orders)."
        ]
      },
      {
        title: "Production Anti-Join Example (Find Inactive Users)",
        type: "code",
        codeSnippet: {
          language: "sql",
          caption: "Efficient Anti-Join pattern to find users without any recent activity",
          code: `-- High-performance Anti-Join pattern
SELECT 
  u.id, 
  u.email, 
  u.created_at
FROM users u
LEFT JOIN orders o 
  ON u.id = o.user_id 
  AND o.created_at > NOW() - INTERVAL '90 days'
WHERE o.id IS NULL; -- Filters out any user who placed an order`
        }
      }
    ]
  },
  {
    id: "8-ai-concepts-2026",
    slug: "8-ai-concepts-2026",
    title: "8 AI Concepts Every Developer Needs in 2026",
    shortDesc: "Before calling yourself an AI Engineer, master these 8 non-negotiable fundamentals: embeddings, rerankers, MCP, evals, and speculative sampling.",
    category: "AI & Agents",
    icon: "🚀",
    coverImage: "/instagram/reel-8-ai-concepts.jpg",
    readTime: "8 min read",
    updatedAt: "March 2026",
    tags: ["AI Engineering", "LLMs", "Reranking", "Evals", "Architecture"],
    linkedReelUrl: "https://www.instagram.com/reel/DdEn7p-zfrg/",
    notionUrl: "https://notion.so/promptnprod/8-ai-concepts",
    keyTakeaways: [
      "1. Embeddings & Cosine Distance: Converting unstructured text into floating-point coordinate vectors.",
      "2. Cross-Encoder Reranking: High-precision neural sorting of top candidate chunks.",
      "3. Context Compaction & KV Cache: How LLM inference engines reuse prefix attention states.",
      "4. Model Context Protocol (MCP): Open standard for agent-to-tool connectivity.",
      "5. LLM-as-a-Judge Evals: Automated scoring with confidence intervals instead of 'vibes-based' testing."
    ],
    sections: [
      {
        title: "The Transition from Prompting to Engineering",
        type: "callout",
        calloutType: "tip",
        content: "In 2024, prompt engineering was writing clever system instructions. In 2026, AI Engineering is building deterministic control planes around non-deterministic model weights."
      },
      {
        title: "The 8 Core Concepts Breakdown",
        type: "text",
        content: [
          "1. Embeddings: Fixed-length semantic coordinates (e.g. 1536 floats) where concept similarity equals geometric proximity.",
          "2. Cross-Encoders: Unlike bi-encoders that encode query and document separately, cross-encoders score both together for 3x higher retrieval precision.",
          "3. Speculative Decoding: A small 1B draft model proposes tokens, and a larger 70B model verifies them in parallel, boosting inference speed by 2.5x.",
          "4. Tool Calling & Structured Outputs: Constraining model logits at decode time using BNF grammars to guarantee 100% valid JSON.",
          "5. Model Context Protocol (MCP): Standardized client-server protocol turning any database or API into an AI-ready tool.",
          "6. LLM-as-a-Judge: Using frontier models (Claude 3.5 Sonnet) with strict rubrics to evaluate cheaper task-specific models automatically.",
          "7. Semantic Chunking: Splitting text at natural idea transitions rather than rigid character counts.",
          "8. Agentic Memory (Working vs Long-Term): Differentiating ephemeral session state from persistent vector-indexed memory stores."
        ]
      }
    ]
  },
  {
    id: "ai-developer-roadmap-cheatsheet",
    slug: "ai-developer-roadmap-cheatsheet",
    title: "2026 AI Developer Roadmap & Tech Stack Cheatsheet",
    shortDesc: "From beginner prompt craft to autonomous multi-agent systems. The complete step-by-step career path with recommended libraries and tools.",
    category: "System Design",
    icon: "🗺️",
    coverImage: "/instagram/reel-ai-roadmap.jpg",
    readTime: "9 min read",
    updatedAt: "March 2026",
    tags: ["Roadmap", "Career", "TypeScript", "Python", "Full-Stack"],
    linkedReelUrl: "https://www.instagram.com/reel/DdD7OGGzQq0/",
    notionUrl: "https://notion.so/promptnprod/ai-roadmap-2026",
    keyTakeaways: [
      "Level 1: Prompt patterns, structured outputs, and streaming UI with Vercel AI SDK.",
      "Level 2: RAG, pgvector with HNSW, hybrid BM25 search, and chunking strategies.",
      "Level 3: Single-agent tool use, Model Context Protocol (MCP), and function calling.",
      "Level 4: Multi-agent coordination with deterministic state machines (LangGraph / Temporal).",
      "Level 5: Local model deployment with Ollama / vLLM and automated evaluation harnesses."
    ],
    sections: [
      {
        title: "The 2026 Tech Stack Recommendation",
        type: "callout",
        calloutType: "note",
        content: "• Frontend & UI: Next.js 16 (App Router), Vercel AI SDK, Tailwind CSS\\n• LLM Orchestration: LangGraph / Native TypeScript loops (avoid bloated black-box frameworks)\\n• Database & Vectors: Postgres with pgvector (Supabase or Neon)\\n• Tool Protocol: Anthropic Model Context Protocol (MCP)\\n• Evaluations: Braintrust, Langfuse, or custom LLM-judge scripts"
      }
    ]
  }
];
