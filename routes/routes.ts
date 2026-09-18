import express from 'express';
import type { Request, Response } from 'express';
import chatRouter from './chat.routes';
import productRouter from './review.routes';
const router = express.Router();

//-------------Chat--------
router.use(chatRouter);
//-------------------------

router.use(productRouter);

router.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

router.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World!' });
});

export default router;
