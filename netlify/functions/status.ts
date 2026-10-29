export interface HandlerResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

export const handler = async (): Promise<HandlerResponse> => {
  const hasApiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      online: true,
      hasApiKey,
      defaultModel: 'gemma-4-26b-a4b-it',
      availableModels: [
        { id: 'gemma-4-26b-a4b-it', name: 'Gemma 4 26B (Open-Weight)', category: 'gemma', isDefault: true },
        { id: 'gemma-4-31b-it', name: 'Gemma 4 31B (Open-Weight)', category: 'gemma', isDefault: false },
        { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash (Fallback Fast)', category: 'gemini', isDefault: false },
      ],
      statusText: hasApiKey ? 'GHOST ONLINE' : 'GHOST STANDBY (DEMO MODE)',
      timestamp: new Date().toISOString(),
    }),
  };
};
