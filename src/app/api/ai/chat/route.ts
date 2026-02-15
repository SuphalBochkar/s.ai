import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { type AIProvider, AI_PROVIDER_MODELS, getAISDKModel } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, provider, model } = body as {
      messages: UIMessage[];
      provider: string;
      model: string;
    };

    // Validate provider
    if (!provider || !(provider in AI_PROVIDER_MODELS)) {
      return Response.json({ error: "Invalid provider" }, { status: 400 });
    }

    // Validate model
    const validProvider = provider as AIProvider;
    const providerModels = AI_PROVIDER_MODELS[validProvider];
    const allModels = [providerModels.defaultModel, ...providerModels.freeModels];
    if (!model || !allModels.includes(model)) {
      return Response.json({ error: "Invalid model" }, { status: 400 });
    }

    const result = streamText({
      model: getAISDKModel(validProvider, model),
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return Response.json({ error: message }, { status: 500 });
  }
}
