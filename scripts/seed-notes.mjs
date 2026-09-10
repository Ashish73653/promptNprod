import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { config } from 'dotenv';

config({ path: '.env.local' });

const studyNotes = pgTable('study_notes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  driveUrl: text('drive_url').notNull(),
  fileSize: text('file_size'),
  pagesCount: integer('pages_count'),
  tags: text('tags'),
  upvotes: integer('upvotes').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

const initialNotes = [
  {
    title: "AWS Solutions Architect Associate (SAA-C03) Complete Notes",
    slug: "aws-solutions-architect-associate-notes",
    category: "AWS & Cloud",
    description: "Comprehensive revision guide for AWS SAA-C03: VPC design, Subnet CIDR blocks, S3 storage tiers, RDS vs Aurora Serverless, DynamoDB, ECS/EKS, and Route 53.",
    driveUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing",
    fileSize: "3.8 MB",
    pagesCount: 24,
    tags: "AWS, SAA-C03, Cloud, VPC, SolutionsArchitect",
    upvotes: 48,
  },
  {
    title: "DBMS & Database Internals: From ACID to B+ Trees",
    slug: "dbms-core-internals-notes",
    category: "DBMS & Systems",
    description: "Core database engineering revision: ACID transactions, 2PL locking, WAL logging, B+ Tree indexing vs LSM Trees, Sharding, and Normalization (1NF-BCNF).",
    driveUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing",
    fileSize: "2.9 MB",
    pagesCount: 19,
    tags: "DBMS, SQL, Transactions, Indexing, B+Tree",
    upvotes: 35,
  },
  {
    title: "SQL Visual Master Cheatsheet & Query Tuning",
    slug: "sql-visual-cheatsheet-guide",
    category: "SQL Cheatsheets",
    description: "Visual mental models for INNER/LEFT/FULL/ANTI joins, Window functions (ROW_NUMBER, DENSE_RANK, LEAD/LAG), CTEs, and EXPLAIN query plan optimization.",
    driveUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing",
    fileSize: "2.1 MB",
    pagesCount: 12,
    tags: "SQL, JOINs, WindowFunctions, CTE, Postgres",
    upvotes: 52,
  },
  {
    title: "RAG Architecture: It Was Free vs It Was NOT Free",
    slug: "rag-architecture-vector-db",
    category: "AI & Agents",
    description: "Production RAG engineering: Vector DB pricing traps, HNSW index tuning in pgvector, hybrid BM25 search, and cross-encoder reranking.",
    driveUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing",
    fileSize: "3.2 MB",
    pagesCount: 16,
    tags: "AI, RAG, pgvector, Embeddings, LLM",
    upvotes: 61,
  },
  {
    title: "How AI Agents Actually Work: ReAct Loops & Tool Schemas",
    slug: "how-ai-agents-actually-work",
    category: "AI & Agents",
    description: "Demystifying AI Agents: Thought-Action-Observation loop, MCP server tool calling schemas, deterministic state machines, and infinite loop safeguards.",
    driveUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing",
    fileSize: "2.6 MB",
    pagesCount: 14,
    tags: "Agents, ReAct, ToolCalling, MCP, Python",
    upvotes: 44,
  },
];

async function seed() {
  console.log("Seeding study_notes to Neon DB...");
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  for (const note of initialNotes) {
    try {
      await db.insert(studyNotes).values(note).onConflictDoNothing();
      console.log(`Seeded: ${note.title}`);
    } catch (err) {
      console.warn(`Could not seed ${note.title}:`, err.message);
    }
  }

  const all = await db.select().from(studyNotes);
  console.log(`Neon now has ${all.length} study notes.`);
}

seed().catch(console.error);
