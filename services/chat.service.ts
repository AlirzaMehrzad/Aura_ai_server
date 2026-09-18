import { llmClient } from '../llm/client';
import { conversationRepository } from '../repositories/conversation.repository';

type ChatResponse = {
  id: string;
  message: string;
};

export const chatService = {
  sendMessage: async (
    prompt: string,
    conversationId: string
  ): Promise<ChatResponse> => {
    const response = await llmClient.generateText({
      model: 'gpt-4o-mini',
      prompt,
      temperature: 0.2,
      maxTokens: 200,
      previousResponseId:
        conversationRepository.getLastResponseId(conversationId),
    });

    conversationRepository.setLastResponseId(conversationId, response.id);

    return {
      id: response.id,
      message: response.text,
    };
  },
};
