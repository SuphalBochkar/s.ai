"use client";

import { useState, useMemo } from "react";
import { Check, ChevronDown, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { AIProvider } from "@/lib/ai";

type Provider = {
  id: AIProvider;
  defaultModel: string;
  freeModels: string[];
};

type Props = {
  providers: Provider[];
  selectedProvider: AIProvider;
  selectedModel: string;
  onSelectModel: (provider: AIProvider, model: string) => void;
};

// ── Provider display config ────────────────────────────────────────────────

const providerMeta: Partial<Record<AIProvider, { icon: string; color: string }>> = {
  openrouter: { icon: "⚡", color: "text-orange-500" },
  groq: { icon: "🔥", color: "text-amber-500" },
  cerebras: { icon: "🧠", color: "text-purple-500" },
  "google-ai": { icon: "✦", color: "text-blue-500" },
  mistral: { icon: "◆", color: "text-cyan-500" },
  nvidia: { icon: "▲", color: "text-green-500" },
  huggingface: { icon: "🤗", color: "text-yellow-500" },
  cohere: { icon: "◎", color: "text-pink-500" },
  "github-models": { icon: "⬡", color: "text-indigo-500" },
  cloudflare: { icon: "☁", color: "text-orange-400" },
  sambanova: { icon: "◈", color: "text-violet-500" },
  hyperbolic: { icon: "∞", color: "text-rose-500" },
  scaleway: { icon: "◇", color: "text-teal-500" },
};

function formatProviderName(id: string): string {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatModelName(model: string): string {
  return model.replace(/^.*\//, "").replace(/:free$/, "");
}

function truncateModel(model: string, max = 24): string {
  const name = formatModelName(model);
  return name.length > max ? name.slice(0, max - 1) + "…" : name;
}

export function ModelSelector({
  providers,
  selectedProvider,
  selectedModel,
  onSelectModel,
}: Props) {
  const [open, setOpen] = useState(false);

  const currentProvider = providers.find((p) => p.id === selectedProvider);
  const meta = providerMeta[selectedProvider];

  // Group models by provider for the popover
  const groupedProviders = useMemo(() => {
    return providers.map((p) => ({
      ...p,
      meta: providerMeta[p.id],
      displayName: formatProviderName(p.id),
    }));
  }, [providers]);

  function handleSelect(providerId: AIProvider, model: string) {
    onSelectModel(providerId, model);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-1.5 h-7 rounded-lg px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer select-none"
          aria-label="Select model"
        >
          {meta && (
            <span className="text-sm leading-none">{meta.icon}</span>
          )}
          <span className="font-medium truncate max-w-36">
            {truncateModel(selectedModel)}
          </span>
          <ChevronDown className="size-3 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-0 rounded-xl border border-border/60 shadow-xl bg-popover"
        align="end"
        sideOffset={8}
      >
        <Command>
          <div className="px-3 pt-3 pb-2">
            <CommandInput
              placeholder="Search models…"
              className="text-xs"
            />
          </div>
          <CommandList className="max-h-80 px-1.5 pb-1.5">
            <CommandEmpty className="py-6 text-center text-xs text-muted-foreground">
              No models found.
            </CommandEmpty>
            {groupedProviders.map((provider) => (
              <CommandGroup
                key={provider.id}
                heading={
                  <div className="flex items-center gap-1.5 px-1">
                    {provider.meta && (
                      <span className="text-xs">{provider.meta.icon}</span>
                    )}
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/60">
                      {provider.displayName}
                    </span>
                    <span className="text-[10px] tabular-nums text-muted-foreground/30 ml-auto">
                      {provider.freeModels.length}
                    </span>
                  </div>
                }
              >
                {provider.freeModels.map((model) => {
                  const isSelected =
                    selectedProvider === provider.id &&
                    selectedModel === model;
                  return (
                    <CommandItem
                      key={`${provider.id}/${model}`}
                      value={`${provider.displayName} ${formatModelName(model)}`}
                      onSelect={() => handleSelect(provider.id, model)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs cursor-pointer",
                        isSelected && "bg-accent/8",
                      )}
                    >
                      <span className="flex-1 truncate font-mono text-[11px]">
                        {formatModelName(model)}
                      </span>
                      {isSelected && (
                        <div className="size-4 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                          <Check className="size-2.5 text-accent" />
                        </div>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
