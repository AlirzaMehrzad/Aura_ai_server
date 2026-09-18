import { llmClient } from '../llm/client';
import { reviewRepository } from '../repositories/review.repository';
import template from '../llm/prompts/summarize-reviews.txt';

export const reviewService = {
  summarizeReviews: async (productId: number): Promise<string> => {
    const existingSummary = await reviewRepository.getReviewSummary(productId);
    if (existingSummary) {
      return existingSummary;
    }

    // Get last 10 reviews
    const reviews = await reviewRepository.getReviews(productId, 10);
    const joindReviews = reviews.map((r) => r.content).join('\n\n');

    // ==> Send reviws to a openAI LLMs
    //const prompt = template.replace('{{reviews}}', joindReviews);

    // const { text: summary } = await llmClient.generateText({
    //   model: 'gpt-4.1',
    //   prompt,
    //   temperature: 0.2,
    //   maxTokens: 500,
    // });

    // ==> Send reviws to a Huggingface LLMs
    const summary = await llmClient.huggingFaceService(joindReviews);

    await reviewRepository.storeReviewSummary(productId, summary);

    return summary;
  },
};
