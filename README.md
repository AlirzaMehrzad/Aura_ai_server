# GraphRAG AI API Server

A high-performance hybrid RAG (Retrieval-Augmented Generation) and Knowledge Graph server built with **Bun**, **Express**, **Prisma (MySQL)**, **Neo4j**, and **OpenAI**.

This system handles traditional relational data alongside graph-based vector search to ingest PDFs, extract unstructured context, store graph relationships, and perform grounded Q&A with LLMs.

---

## 🌟 Features

- **PDF Document Ingestion**: In-memory parsing using `unpdf` and `multer`, splitting text into overlapping chunks.
- **Vector & Graph Storage**: Embeds document chunks using OpenAI's `text-embedding-3-small` and links them inside Neo4j (`User` $\rightarrow$ `Document` $\rightarrow$ `Chunk`).
- **GraphRAG Endpoint**: Queries Neo4j vector indexes using similarity search and passes context to `gpt-4o` for hallucination-free answers.
- **Relational Storage**: MySQL managed via Prisma ORM for core app data, authentication, and metadata.
- **User Review Summarization & Chat**: Custom endpoints for summarizing reviews and general chatbot interactions.

---

## 🛠 Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Web Framework**: Express.js
- **Relational DB & ORM**: MySQL + Prisma
- **Graph & Vector DB**: Neo4j (Community / Aura)
- **AI & Machine Learning**: OpenAI API (`gpt-4o`, `text-embedding-3-small`), Hugging Face
- **PDF Processing**: `unpdf`, `multer`

---

## 🏗 Architecture Overview

```text
                               ┌─────────────────────────┐
                               │     Express Server      │
                               │      (Bun Runtime)      │
                               └────────────┬────────────┘
                                            │
                  ┌─────────────────────────┼─────────────────────────┐
                  ▼                         ▼                         ▼
        ┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
        │   MySQL / Prisma  │     │    OpenAI API     │     │     Neo4j DB      │
        │   (Relational)    │     │  (Embed / Chat)   │     │  (Graph + Vector) │
        └───────────────────┘     └───────────────────┘     └───────────────────┘
        - Users & Auth            - Text Embeddings         - Document Nodes
        - Metadata & Reviews      - GPT Context Answers     - Chunk Embeddings
```

## 📋 Prerequisites

- Bun installed (v1.0.0 or higher)

- MySQL database running locally or remotely

- Neo4j database running locally via Docker/Desktop or Neo4j Aura Cloud

- OpenAI API Key

## 1. Getting Started

```
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name
bun install
```

## 2. Configure Environment Variables

```
# Application Port
PORT=3000

# Database Connections
DATABASE_URL="mysql://root:password@localhost:3306/aura_db"

# Neo4j Settings
NEO4J_URI="neo4j://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASSWORD="your_neo4j_password"

# OpenAI Key
OPENAI_API_KEY="sk-proj-your-openai-api-key"
```

## 3. Setup Databases

```
bunx prisma migrate dev --name init
```

- **Neo4j Vector Index Setup**: Log into your Neo4j Browser (http://localhost:7474) or run the query through a setup script to create the vector search index:

```
CREATE VECTOR INDEX chunk_embeddings IF NOT EXISTS
FOR (c:Chunk) ON (c.embedding)
OPTIONS { indexConfig: {
  `vector.dimensions`: 1536,
  `vector.similarity_function`: 'cosine'
}};
```

## 4. Running the Server

- Development Mode:

```
bun run dev
```

- Production Mode:

```
bun run start
```
