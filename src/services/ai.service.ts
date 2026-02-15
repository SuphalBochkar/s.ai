import { AI_DEFAULT_PROVIDER, type AIProvider, getAIClient, getDefaultModel } from "@/lib/ai";

type GenerateCompletionOptions = {
  provider?: AIProvider;
  model?: string;
};

export async function generateCompletion(
  prompt: string,
  options: GenerateCompletionOptions = {},
): Promise<string> {
  const provider = options.provider ?? AI_DEFAULT_PROVIDER;
  const client = getAIClient(provider);
  const model = options.model ?? getDefaultModel(provider);

  const completion = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return completion.choices[0]?.message?.content?.trim() ?? "";
}
