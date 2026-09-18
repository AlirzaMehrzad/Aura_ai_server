import { getNeo4jSession } from '../data/neo4j';
import { openAiClient } from '../llm/client';

export async function askPDFQuestion(userQuestion: string) {
  // 1. Embed the user's question
  const questionEmbedRes = await openAiClient.embeddings.create({
    model: 'text-embedding-3-small',
    input: userQuestion,
  });
  const embedding = questionEmbedRes.data[0]?.embedding;
  if (!embedding) {
    throw new Error('Failed to generate an embedding for the question');
  }

  const session = getNeo4jSession();
  let context = '';

  try {
    // 2. Find the top 3 most relevant chunks
    const result = await session.run(
      `
      CALL db.index.vector.queryNodes('chunk_embeddings', 3, $embedding)
      YIELD node, score
      MATCH (d:Document)-[:HAS_CHUNK]->(node)
      RETURN node.text AS text, d.name AS docName, score
    `,
      { embedding }
    );

    const contextBlocks = result.records.map(
      (record) =>
        `From document '${record.get('docName')}':\n${record.get('text')}`
    );
    context = contextBlocks.join('\n\n---\n\n');
  } finally {
    await session.close();
  }

  // 3. Generate the answer using the retrieved context
  const chatResponse = await openAiClient.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Answer the question based only on the provided document excerpts:\n\n${context}`,
      },
      { role: 'user', content: userQuestion },
    ],
  });

  return chatResponse.choices[0]?.message?.content ?? '';
}
