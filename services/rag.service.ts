import { getNeo4jSession } from '../data/neo4j';
import { openAiClient } from '../llm/client';

export async function askPDFQuestion(userQuestion: string): Promise<string> {
  const questionEmbedRes = await openAiClient.embeddings.create({
    model: 'text-embedding-3-small',
    input: userQuestion,
  });
  const embedding = questionEmbedRes.data[0]?.embedding;

  if (!embedding) {
    throw new Error('Failed to generate question embedding');
  }

  const session = getNeo4jSession();
  let context = '';

  try {
    const result = await session.run(
      `
      CALL db.index.vector.queryNodes('chunk_embeddings', 3, $embedding)
      YIELD node, score
      MATCH (d:Document)-[:HAS_CHUNK]->(node)
      RETURN node.text AS text, d.name AS docName, score
    `,
      { embedding }
    );

    // FIX 1: Map only the raw text, stripping away the docName
    const contextBlocks = result.records.map((record) => record.get('text'));
    context = contextBlocks.join('\n\n');
  } finally {
    await session.close();
  }

  const chatResponse = await openAiClient.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        // FIX 2: Engineer the prompt to forbid meta-references
        content: `You are a helpful, direct assistant. Use the provided context to answer the user's question accurately.
        
        CRITICAL RULES:
        - NEVER mention file names, document titles, or sources.
        - NEVER use conversational filler like "Based on the provided text", "According to the document", or "The excerpts state".
        - Answer directly, confidently, and naturally, as if this information is your own inherent knowledge.
        
        Context:
        ${context}`,
      },
      { role: 'user', content: userQuestion },
    ],
  });

  return chatResponse.choices[0]?.message?.content || '';
}
