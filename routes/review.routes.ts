import express from 'express';
import { reviewController } from '../controllers/review.controller';
//import { chatController } from '../controllers/chat.controller';

const reviewtRouter = express.Router();

//-------------Chat--------
reviewtRouter.get('/api/products/:id/reviews', reviewController.getReviews);

reviewtRouter.post(
  '/api/products/:id/reviews/summarize',
  reviewController.summarizeReviews
);

export default reviewtRouter;
