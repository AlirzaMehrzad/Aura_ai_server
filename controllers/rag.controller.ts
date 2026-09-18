import type { Request, Response } from 'express';
import { ingestDocumentChunks } from '../repositories/rag.repository'; // Adjust import path
import { processUploadedPDF } from '../tools/unpdf';
import { askPDFQuestion } from '../services/rag.service';

export const ragController = {
  uploadPdf: async (req: Request, res: Response) => {
    try {
      const file = (
        req as Request & {
          file?: { buffer: Buffer; originalname: string };
        }
      ).file;

      if (!file) {
        return res.status(400).json({ error: 'No PDF uploaded' });
      }

      // req.file.buffer is provided by multer's memory storage
      const chunks = await processUploadedPDF(file.buffer);

      // Use a real user ID from your auth middleware (e.g., req.user.id)
      const userId = 'user-123';

      await ingestDocumentChunks(chunks, file.originalname, userId);

      res.status(200).json({
        message: 'PDF ingested successfully',
        chunksGenerated: chunks.length,
      });
    } catch (error) {
      console.error('Upload Error:', error);
      res.status(500).json({ error: 'Failed to process PDF' });
    }
  },

  askQuestion: async (req: Request, res: Response) => {
    try {
      const { question } = req.body;

      if (!question) {
        return res.status(400).json({ error: 'Question is required' });
      }

      const answer = await askPDFQuestion(question);

      res.status(200).json({ answer });
    } catch (error) {
      console.error('Query Error:', error);
      res.status(500).json({ error: 'Failed to answer question' });
    }
  },
};
