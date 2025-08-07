import { streamText, UIMessage, tool, convertToModelMessages, stepCountIs } from 'ai';
import { z } from 'zod';
import Exa from 'exa-js';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const exa = new Exa(process.env.EXA_API_KEY);

export const webSearchTool = tool({
  description: 'Search the web for up-to-date information',
  inputSchema: z.object({
    query: z.string().min(1).max(100).describe('The search query'),
  }),
  execute: async ({ query }) => {
    const { results } = await exa.searchAndContents(query, {
      livecrawl: 'always',
      numResults: 3,
    });
    console.log('Web search results:', results);
    return results.map(result => ({
      title: result.title,
      url: result.url,
      content: result.text.slice(0, 1000),
      publishedDate: result.publishedDate,
    }));
  },
});

export async function POST(req: Request) {
  const {
    messages,
    model,
    webSearch,
  }: { messages: UIMessage[]; model: string; webSearch: boolean } =
    await req.json();

  const result = streamText({
    model: model,
    messages: convertToModelMessages(messages),
    temperature: 0.0,
    system:
      'You are a helpful assistant that can answer questions and help with tasks',
    tools: webSearch ? { webSearchTool } : {},
    stopWhen: stepCountIs(5),

  });
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}