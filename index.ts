import experss from 'express';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';

dotenv.config();
const app = experss();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
