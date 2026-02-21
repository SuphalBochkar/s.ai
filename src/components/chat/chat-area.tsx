"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  memo,
} from "react";
import {
  ArrowUp,
  ImagePlus,
  X,
  Plus,
  LogOut,
  Search,
  Code,
  MessageSquare,
  BarChart3,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { MessageBubble } from "./message-bubble";
import { ModelSelector } from "./model-selector";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  AI_PROVIDER_MODELS,
  modelConfigs,
  type AIProvider,
} from "@/lib/ai";
import { signOut } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

// ── Build provider list with full metadata ─────────────────────────────────

const providers = (
  Object.entries(AI_PROVIDER_MODELS) as [
    AIProvider,
    { defaultModel: string; freeModels: string[] },
  ][]
)
  .filter(([, config]) => config.freeModels.length > 0)
  .map(([id, config]) => {
    const full = modelConfigs[id];
    return {
      id,
      ...config,
      paidModels: full?.paidModels ?? [],
      category: full?.category,
      capabilities: full?.capabilities,
      supportsStreaming: full?.supportsStreaming,
      notes: full?.notes,
      rateLimits: full?.rateLimits,
    };
  });

// ── Suggestions ────────────────────────────────────────────────────────────

const suggestions = [
  { icon: Search, label: "Research", text: "What are the latest trends in AI?" },
  { icon: Code, label: "Code", text: "Write a TypeScript utility function" },
  { icon: MessageSquare, label: "Explain", text: "Explain quantum computing simply" },
  { icon: BarChart3, label: "Analyze", text: "Compare REST vs GraphQL" },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function getMessageText(msg: { parts?: unknown[]; content?: unknown }): string {
  if (Array.isArray(msg.parts)) {
    return msg.parts
      .filter(
        (p): p is { type: string; text: string } =>
          !!p &&
          typeof p === "object" &&
          "text" in p &&
          typeof (p as Record<string, unknown>).text === "string" &&
          "type" in p &&
          (p as Record<string, unknown>).type === "text",
      )
      .map((p) => p.text)
      .join("");
  }
  if (typeof msg.content === "string") return msg.content;
  return "";
}

// ── Memoized Message ───────────────────────────────────────────────────────

const MemoizedMessage = memo(function MemoizedMessage({
  id,
  content,
  role,
}: {
  id: string;
  content: string;
  role: "user" | "assistant";
}) {
  return <MessageBubble key={id} content={content} role={role} />;
});

// ── Component ──────────────────────────────────────────────────────────────

export function ChatArea() {
  const router = useRouter();

  // Model selection state
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(
    providers[0]?.id ?? "openrouter",
  );
  const [selectedModel, setSelectedModel] = useState<string>(
    providers[0]?.freeModels[0] ?? "",
  );

  // Chat state
  const [input, setInput] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/chat",
        body: { provider: selectedProvider, model: selectedModel },
      }),
    [selectedProvider, selectedModel],
  );

  const { messages, status, error, setMessages, sendMessage } = useChat({
    transport,
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll — use requestAnimationFrame for smoothness
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, [messages]);

  // Handlers
  function handleSelectModel(provider: AIProvider, model: string) {
    setSelectedProvider(provider);
    setSelectedModel(model);
    setMessages([]);
  }

  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length === 0) return;
      setImageFiles((prev) => [...prev, ...files]);
      setImagePreviews((prev) => [
        ...prev,
        ...files.map((f) => URL.createObjectURL(f)),
      ]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [fileInputRef],
  );

  const removeImage = useCallback((index: number) => {
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() && imageFiles.length === 0) return;

    const text = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    if (imageFiles.length > 0) {
      const dt = new DataTransfer();
      imageFiles.forEach((f) => dt.items.add(f));
      await sendMessage({ text, files: dt.files });
      setImagePreviews((prev) => {
        prev.forEach(URL.revokeObjectURL);
        return [];
      });
      setImageFiles([]);
    } else {
      await sendMessage({ text });
    }
  }, [input, imageFiles, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  // adjust textarea height to fit content
  const handleInputResize = useCallback(
    (e: React.FormEvent<HTMLTextAreaElement>) => {
      const ta = e.currentTarget;
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    },
    [],
  );

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-dvh bg-background">
      {/* ── Top bar — only visible when chatting ── */}
      {!isEmpty && (
        <header className="flex items-center justify-between px-4 h-12 shrink-0 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMessages([])}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="size-4" />
              <span className="text-xs font-medium hidden sm:inline">New</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={handleSignOut}
              className="size-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        </header>
      )}

      {/* ── Messages ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center px-6">
            {/* Brand */}
            <div className="mb-10 text-center">
              <div className="inline-flex items-center justify-center mb-6">
                <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-foreground">
                  s<span className="text-accent">.</span>ai
                </h1>
              </div>
            </div>

            {/* Input — Scira style centered */}
            <div className="w-full max-w-xl mb-8">
              {/* Image Previews — inside input area when empty */}
              {imagePreviews.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-3 px-1">
                  {imagePreviews.map((preview, i) => (
                    <div key={i} className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview}
                        alt="Upload preview"
                        className="h-16 w-16 object-cover rounded-xl border border-border/40"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="size-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="relative rounded-2xl border border-border/60 bg-card shadow-sm transition-all focus-within:border-accent/30 focus-within:shadow-md focus-within:shadow-accent/5">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onInput={handleInputResize}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question…"
                  rows={1}
                  className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none px-4 pt-4 pb-12 max-h-40 min-h-14 leading-relaxed"
                />

                {/* Bottom toolbar */}
                <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-3 pb-2.5">
                  <div className="flex items-center gap-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="size-8 rounded-lg flex items-center justify-center text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/50 transition-all"
                      aria-label="Attach image"
                    >
                      <ImagePlus className="size-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <ModelSelector
                      providers={providers}
                      selectedProvider={selectedProvider}
                      selectedModel={selectedModel}
                      onSelectModel={handleSelectModel}
                    />

                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={isLoading || (!input.trim() && imageFiles.length === 0)}
                      className="size-8 rounded-lg bg-accent text-accent-foreground flex items-center justify-center transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <Spinner className="size-3.5" />
                      ) : (
                        <ArrowUp className="size-4" strokeWidth={2.5} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggestion chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl">
              {suggestions.map((s) => (
                <button
                  key={s.label}
                  onClick={() => {
                    setInput(s.text);
                    textareaRef.current?.focus();
                  }}
                  className="flex items-center gap-2 text-xs text-muted-foreground border border-border/50 rounded-full px-3.5 py-2 hover:bg-muted/50 hover:text-foreground hover:border-border transition-all group"
                >
                  <s.icon className="size-3.5 text-muted-foreground/50 group-hover:text-accent transition-colors" />
                  {s.label}
                </button>
              ))}
            </div>

            {/* Utility links */}
            <div className="absolute bottom-4 flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={handleSignOut}
                className="size-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-1">
            {messages.map((msg) => {
              const text = getMessageText(msg);
              if (!text && msg.role !== "assistant") return null;
              if (msg.role !== "user" && msg.role !== "assistant") return null;
              return (
                <MemoizedMessage
                  key={msg.id}
                  id={msg.id}
                  content={text}
                  role={msg.role}
                />
              );
            })}

            {/* Streaming pulse — waiting for first token */}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex py-4 pl-10">
                <div className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-accent/60 animate-pulse-soft" />
                  <span className="size-1.5 rounded-full bg-accent/60 animate-pulse-soft [animation-delay:200ms]" />
                  <span className="size-1.5 rounded-full bg-accent/60 animate-pulse-soft [animation-delay:400ms]" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 pb-2">
          <div className="flex items-start gap-3 rounded-xl bg-destructive/8 border border-destructive/15 px-4 py-3 animate-fade-in-up">
            <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-destructive font-medium">
                {error.message?.includes("429") || error.message?.includes("rate")
                  ? "Rate limited"
                  : error.message?.includes("RetryError") || error.message?.includes("retry")
                    ? "Retries exhausted"
                    : "Request failed"}
              </p>
              <p className="text-xs text-destructive/70 mt-0.5 wrap-break-word">
                {error.message || "The model may not support this request."}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => {
                    // Retry last user message
                    const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
                    if (lastUserMsg) {
                      const text = getMessageText(lastUserMsg);
                      if (text) sendMessage({ text });
                    }
                  }}
                  className="flex items-center gap-1 text-[11px] text-destructive/70 hover:text-destructive transition-colors"
                >
                  <RefreshCw className="size-3" />
                  Retry
                </button>
                <span className="text-destructive/20">·</span>
                <span className="text-[11px] text-destructive/40">
                  Try a different model or provider
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Input — visible only when chatting ── */}
      {!isEmpty && (
        <div className="pb-4 pt-2 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-2">
                {imagePreviews.map((preview, i) => (
                  <div key={i} className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Upload preview"
                      className="h-14 w-14 object-cover rounded-xl border border-border/40"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="size-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="relative flex items-end gap-2 rounded-2xl border border-border/50 bg-card shadow-sm p-2 transition-all focus-within:border-accent/30 focus-within:shadow-md focus-within:shadow-accent/5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 size-8 rounded-lg flex items-center justify-center text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted/50 transition-all"
                aria-label="Attach image"
              >
                <ImagePlus className="size-4" />
              </button>

              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onInput={handleInputResize}
                onKeyDown={handleKeyDown}
                placeholder="Message…"
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none py-1.5 px-1 max-h-32 min-h-9 leading-relaxed"
              />

              <div className="flex items-center gap-1.5 shrink-0">
                <ModelSelector
                  providers={providers}
                  selectedProvider={selectedProvider}
                  selectedModel={selectedModel}
                  onSelectModel={handleSelectModel}
                />

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isLoading || (!input.trim() && imageFiles.length === 0)}
                  className="size-8 rounded-lg bg-accent text-accent-foreground flex items-center justify-center transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Spinner className="size-3.5" />
                  ) : (
                    <ArrowUp className="size-4" strokeWidth={2.5} />
                  )}
                </button>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground/30 text-center mt-2 select-none">
              {providers.length} providers · Free & open models
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
