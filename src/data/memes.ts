import { Meme } from "@/types";

export const memes: Meme[] = [
  {
    id: "meme-1",
    title: "It worked on my machine",
    category: "Production",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    caption: "'It compiled fine on my M3 Max with 64GB RAM, why is the 512MB prod container running out of memory?'",
    upvotes: 342,
    author: "DevOpsSurvivor",
    tags: ["Docker", "MemoryLeak", "FridayDeploy"]
  },
  {
    id: "meme-2",
    title: "The Agent Swarm in Practice",
    category: "AI Hype",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    caption: "Manager: 'We replaced our junior devs with 5 autonomous agents!' The 5 agents: debating the meaning of life in an infinite recursive tool loop.",
    upvotes: 512,
    author: "TokenBurner",
    tags: ["AutonomousAgents", "LangChain", "Recursion"]
  },
  {
    id: "meme-3",
    title: "Centering a DIV in 2026",
    category: "Frontend/CSS",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80",
    caption: "We have quantum computing, humanoid robots, and 1M context windows, but junior frontend devs still dread centering a modal.",
    upvotes: 428,
    author: "FlexboxMaster",
    tags: ["CSS", "Frontend", "Grid"]
  },
  {
    id: "meme-4",
    title: "Junior vs Senior Debugging",
    category: "Junior vs Senior",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    caption: "Junior: *rewrites entire auth flow because token expired*. Senior: *changes 1 environment variable after staring into the void for 4 hours*.",
    upvotes: 689,
    author: "LegacyCodeSage",
    tags: ["Debugging", "Experience", "ProdIncident"]
  },
  {
    id: "meme-5",
    title: "Deploying on Friday at 4:59 PM",
    category: "Production",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    caption: "'It's just a 1-line CSS change, what could possibly happen?' *PagerDuty alarm siren intensifies at 5:02 PM*.",
    upvotes: 815,
    author: "OnCallHero",
    tags: ["PagerDuty", "Production", "WeekendRuined"]
  },
  {
    id: "meme-6",
    title: "RAG vs 2M Context Window",
    category: "AI Hype",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80",
    caption: "Me spending 3 weeks tuning chunk sizes, BM25, and re-rankers vs the intern dumping the whole company wiki into Gemini 1.5 Pro.",
    upvotes: 940,
    author: "VectorArchitect",
    tags: ["RAG", "Embeddings", "ContextWindow"]
  }
];
