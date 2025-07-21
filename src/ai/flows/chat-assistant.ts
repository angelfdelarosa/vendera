'use server';

/**
 * @fileOverview A chat assistant that helps users connect with sellers.
 *
 * - chatAssistant - A function that generates a response from the seller.
 * - ChatAssistantInput - The input type for the chatAssistant function.
 * - ChatAssistantOutput - The return type for the chatAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatAssistantInputSchema = z.object({
  buyerName: z.string().describe("The name of the potential buyer."),
  sellerName: z.string().describe("The name of the seller."),
  propertyName: z.string().describe("The name or title of the property being discussed."),
  messageHistory: z.string().describe("The history of the conversation so far, formatted as a dialogue."),
});
export type ChatAssistantInput = z.infer<typeof ChatAssistantInputSchema>;

const ChatAssistantOutputSchema = z.object({
  response: z.string().describe('The generated response from the seller.'),
});
export type ChatAssistantOutput = z.infer<typeof ChatAssistantOutputSchema>;

export async function chatAssistant(
  input: ChatAssistantInput
): Promise<ChatAssistantOutput> {
  return chatAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatAssistantPrompt',
  input: {schema: ChatAssistantInputSchema},
  output: {schema: ChatAssistantOutputSchema},
  prompt: `You are a real estate seller named {{{sellerName}}}. You are professional, friendly, and eager to help.

A potential buyer named {{{buyerName}}} is interested in your property: "{{{propertyName}}}".

Here is the conversation history:
{{{messageHistory}}}

Based on the history, generate a helpful and encouraging response to the buyer's last message. Keep your response concise, friendly, and focused on answering their question or scheduling a viewing.
Your response should only be from the perspective of {{{sellerName}}}. Do not add any prefixes like "Seller:" or "{{{sellerName}}}:".`,
});

const chatAssistantFlow = ai.defineFlow(
  {
    name: 'chatAssistantFlow',
    inputSchema: ChatAssistantInputSchema,
    outputSchema: ChatAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
