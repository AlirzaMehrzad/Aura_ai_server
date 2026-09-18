import express from 'express';
import { ragController } from '../controllers/rag.controller';
import multer from 'multer';

const ragRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

//-------------Chat--------
ragRouter.post(
  '/api/rag/upload',
  upload.single('file'),
  ragController.uploadPdf
);
ragRouter.post('/api/rag/ask', ragController.askQuestion);

export default ragRouter;
