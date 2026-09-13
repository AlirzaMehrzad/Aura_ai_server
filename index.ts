import experss from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z from 'zod';
import type { Request, Response } from 'express';

dotenv.config();
const app = experss();
app.use(experss.json());
const port = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const conversations = new Map<string, string>();

const chatSchema = z.object({
  prompt: z
    .string()
    .min(1, 'Prompt cannot be empty')
    .max(1000, 'Prompt cannot exceed 1000 characters'),
  conversationId: z.string().uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const parsed = chatSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { prompt, conversationId } = parsed.data;
  try {
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 100,
      previous_response_id: conversations.get(conversationId),
    });

    conversations.set(conversationId, response.id);
    res.json({ message: response.output_text });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while processing your request.' });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
