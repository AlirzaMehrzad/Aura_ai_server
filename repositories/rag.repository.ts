import { getNeo4jSession } from '../data/neo4j';
import { openAiClient } from '../llm/client';
import { randomUUID } from 'crypto';

export async function ingestDocumentChunks(
  chunks: string[],
  documentName: string,
  userId: string // Change to 'number' if your Prisma User ID is an integer
): Promise<void> {
  const session = getNeo4jSession();
  const documentId = randomUUID();

  try {
    await session.run(
      `
      MERGE (u:User {id: $userId})
      CREATE (d:Document {id: $documentId, name: $documentName})
      MERGE (u)-[:UPLOADED]->(d)
    `,
      { userId, documentId, documentName }
    );

    for (let i = 0; i < chunks.length; i++) {
      const embedRes = await openAiClient.embeddings.create({
        model: 'text-embedding-3-small',
        input: chunks[i]!,
      });
      const embeddingResult = embedRes.data[0];
      if (!embeddingResult) {
        throw new Error('Embedding response did not contain an embedding');
      }
      const embedding = embeddingResult.embedding;

      await session.run(
        `
        MATCH (d:Document {id: $documentId})
        CREATE (c:Chunk {
          id: $chunkId, 
          text: $text, 
          sequence: $sequence, 
          embedding: $embedding
        })
        CREATE (d)-[:HAS_CHUNK]->(c)
      `,
        {
          documentId,
          chunkId: randomUUID(),
          text: chunks[i],
          sequence: i,
          embedding,
        }
      );
    }
  } finally {
    await session.close();
  }
}
