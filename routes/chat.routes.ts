import express from 'express';
import { chatController } from '../controllers/chat.controller';

const chatRouter = express.Router();

//-------------Chat--------
chatRouter.post('/api/chat', chatController.sendMessage);

export default chatRouter;
