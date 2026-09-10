import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

// Memes table: Stores Reddit-synced and Community-submitted dev humor
export const memes = pgTable('memes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  imageUrl: text('image_url').notNull(),
  source: text('source').notNull().default('community'), // 'reddit' | 'community'
  redditId: text('reddit_id').unique(),
  subreddit: text('subreddit').default('programmerhumor'),
  permalink: text('permalink'),
  author: text('author').notNull().default('Dev Community'),
  upvotes: integer('upvotes').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Real-time Reactions & Upvotes across Memes, Study Notes, and Tech News
export const reactions = pgTable('reactions', {
  id: serial('id').primaryKey(),
  targetType: text('target_type').notNull(), // 'meme' | 'note' | 'article'
  targetId: text('target_id').notNull(), // slug or meme ID
  reactionType: text('reaction_type').notNull().default('upvote'), // 'upvote' | 'fire' | 'mindblown' | 'rocket'
  userIdentifier: text('user_identifier'), // hashed fingerprint or anonymous token
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Community Discussions & Feedback on Notes, News & Roadmap Projects
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  targetType: text('target_type').notNull(), // 'note' | 'article' | 'roadmap'
  targetId: text('target_id').notNull(), // slug
  authorName: text('author_name').notNull(),
  authorRole: text('author_role').notNull().default('Developer'),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Study Notes & PDF Cheatsheets Vault (Google Drive links & dynamic categories)
export const studyNotes = pgTable('study_notes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  category: text('category').notNull(), // e.g. "AWS & Cloud", "DBMS & Systems", "SQL Cheatsheets", "AI & Agents", or any custom category
  description: text('description').notNull(),
  driveUrl: text('drive_url').notNull(), // Google Drive public view/sharing link
  fileSize: text('file_size'), // e.g. "3.4 MB"
  pagesCount: integer('pages_count'), // e.g. 18
  tags: text('tags'), // comma separated
  upvotes: integer('upvotes').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Meme = typeof memes.$inferSelect;
export type NewMeme = typeof memes.$inferInsert;
export type Reaction = typeof reactions.$inferSelect;
export type NewReaction = typeof reactions.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type StudyNoteDb = typeof studyNotes.$inferSelect;
export type NewStudyNoteDb = typeof studyNotes.$inferInsert;
