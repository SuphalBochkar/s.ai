"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  Send,
  ImagePlus,
  X,
  RotateCcw,
  LogOut,
  Sparkles,
} from "lucide-react";
import { MessageBubble } from "./message-bubble";
import { ModelSelector } from "./model-selector";
import { ThemeToggle } from "@/components/theme-toggle";
import { AI_PROVIDER_MODELS, type AIProvider } from "@/lib/ai";
import { signOut } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

// ── Build provider list ────────────────────────────────────────────────────

const providers = (
  Object.entries(AI_PROVIDER_MODELS) as [
    AIProvider,
    { defaultModel: string; freeModels: string[] },
  ][]
)
  .filter(([, config]) => config.freeModels.length > 0)
  .map(([id, config]) => ({ id, ...config }));

// ── Helpers ────────────────────────────────────────────────────────────────

/** Extract visible text from a UIMessage (handles parts array and string content). */
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

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, scrollRef]);

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
  }, [input, imageFiles, sendMessage, textareaRef]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-4 sm:px-6 h-14 shrink-0 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-foreground flex items-center justify-center">
              <Sparkles className="size-3.5 text-background" />
            </div>
            <span className="text-sm font-semibold tracking-tight hidden sm:inline">
              s.ai
            </span>
          </div>

          <div className="h-4 w-px bg-border/60 hidden sm:block" />

          <ModelSelector
            providers={providers}
            selectedProvider={selectedProvider}
            selectedModel={selectedModel}
            onSelectModel={handleSelectModel}
          />
        </div>

        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setMessages([])}
                  className="size-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <RotateCcw className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>New conversation</TooltipContent>
            </Tooltip>
          )}

          <ThemeToggle />

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleSignOut}
                className="size-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <LogOut className="size-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Sign out</TooltipContent>
          </Tooltip>
        </div>
      </header>

      {/* ── Messages ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="mb-6">
              <div className="size-14 rounded-2xl bg-linear-to-br from-muted to-muted/50 flex items-center justify-center mx-auto mb-5 shadow-sm">
                <Sparkles className="size-6 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-medium text-foreground mb-2 tracking-tight">
                What can I help with?
              </h2>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Send a message to test the selected model. Attach images for
                vision capabilities.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 max-w-md">
              {[
                "Explain quantum computing",
                "Write a haiku about code",
                "Compare REST vs GraphQL",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                    textareaRef.current?.focus();
                  }}
                  className="text-xs text-muted-foreground border border-border/60 rounded-full px-3.5 py-1.5 hover:bg-muted hover:text-foreground hover:border-border transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-1">
            {messages.map((msg) => {
              const text = getMessageText(msg);
              if (!text && msg.role !== "assistant") return null;
              if (msg.role !== "user" && msg.role !== "assistant") return null;
              return (
                <MessageBubble key={msg.id} content={text} role={msg.role} />
              );
            })}

            {/* Streaming indicator when waiting for first token */}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex py-4 px-1">
                <div className="flex items-center gap-1.5">
                  <div className="size-1.5 rounded-full bg-muted-foreground/30 animate-pulse" />
                  <div className="size-1.5 rounded-full bg-muted-foreground/30 animate-pulse [animation-delay:150ms]" />
                  <div className="size-1.5 rounded-full bg-muted-foreground/30 animate-pulse [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 pb-2">
          <div className="flex items-start gap-2.5 rounded-xl bg-destructive/8 border border-destructive/15 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-destructive font-medium">
                Request failed
              </p>
              <p className="text-xs text-destructive/70 mt-0.5 wrap-break-word">
                {error.message ||
                  "The model may not support this request. Try a different model."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Image Previews ── */}
      {imagePreviews.length > 0 && (
        <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 pb-2">
          <div className="flex gap-2 flex-wrap">
            {imagePreviews.map((preview, i) => (
              <div key={i} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Upload preview"
                  className="h-14 w-14 object-cover rounded-xl border border-border/60"
                />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Input ── */}
      <div className="pb-4 pt-2 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative flex items-end gap-2 rounded-2xl border border-border/60 bg-card shadow-sm p-2 transition-all focus-within:border-border focus-within:shadow-md">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0 size-8 rounded-xl flex items-center justify-center text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted transition-all"
                  aria-label="Attach image"
                >
                  <ImagePlus className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Attach image</TooltipContent>
            </Tooltip>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message…"
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none py-1.5 px-1 max-h-32 min-h-9 leading-relaxed"
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height =
                  Math.min(target.scrollHeight, 128) + "px";
              }}
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={
                isLoading || (!input.trim() && imageFiles.length === 0)
              }
              className="shrink-0 size-8 rounded-xl bg-foreground text-background flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Spinner className="size-3.5" />
              ) : (
                <Send className="size-3.5" />
              )}
            </button>
          </div>

          <p className="text-[10px] text-muted-foreground/40 text-center mt-2 select-none">
            {providers.length} providers · Free models
          </p>
        </div>
      </div>
    </div>
  );
}
