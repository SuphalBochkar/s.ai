import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { type AIProvider, AI_PROVIDER_MODELS, getAISDKModel } from "@/lib/ai";

/**
 * Extract a useful HTTP status from AI SDK errors.
 * AI SDK wraps provider errors as `AI_APICallError` with a `statusCode` prop,
 * and wraps retries as `AI_RetryError` whose `.reason` is the underlying error.
 */
function extractErrorDetails(error: unknown): {
  status: number;
  message: string;
  provider?: string;
  isRetryExhausted?: boolean;
} {
  if (!(error instanceof Error))
    return { status: 500, message: "Internal server error" };

  const name = error.name ?? "";
  const msg = error.message ?? "Unknown error";

  // AI SDK retry wrapper — unwrap the underlying cause
  if (name === "AI_RetryError" || name === "RetryError") {
    const cause = (error as { reason?: unknown }).reason;
    if (cause instanceof Error) {
      const inner = extractErrorDetails(cause);
      return { ...inner, isRetryExhausted: true };
    }
    return { status: 429, message: msg, isRetryExhausted: true };
  }

  // AI SDK API call error — has statusCode
  const statusCode = (error as { statusCode?: number }).statusCode;
  if (typeof statusCode === "number") {
    return { status: statusCode, message: msg };
  }

  // Check for rate-limit keywords in message
  if (/rate.?limit|429|too many requests|quota/i.test(msg)) {
    return { status: 429, message: msg };
  }

  return { status: 500, message: msg };
}

export async function POST(req: Request) {
  let provider = "";
  let model = "";

  try {
    const body = await req.json();
    const { messages } = body as { messages: UIMessage[] };
    provider = body.provider as string;
    model = body.model as string;

    // Validate provider
    if (!provider || !(provider in AI_PROVIDER_MODELS)) {
      return Response.json(
        { error: "Invalid provider", provider },
        { status: 400 },
      );
    }

    // Validate model
    const validProvider = provider as AIProvider;
    const providerModels = AI_PROVIDER_MODELS[validProvider];
    const allModels = [
      providerModels.defaultModel,
      ...providerModels.freeModels,
    ];
    if (!model || !allModels.includes(model)) {
      return Response.json(
        { error: "Invalid model", provider, model },
        { status: 400 },
      );
    }

    const result = streamText({
      model: getAISDKModel(validProvider, model),
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(`[ai/chat] ${provider}/${model}:`, error);
    const details = extractErrorDetails(error);

    return Response.json(
      {
        error: details.message,
        status: details.status,
        provider,
        model,
        isRetryExhausted: details.isRetryExhausted ?? false,
      },
      { status: details.status },
    );
  }
}
