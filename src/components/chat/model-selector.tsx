"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Check,
  ChevronDown,
  Zap,
  Crown,
  Info,
  Search,
  Gauge,
  Eye,
  Code,
  MessageSquare,
  Layers,
  Cpu,
  Headphones,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { AIProvider, ModelCapability, ProviderCategory } from "@/lib/ai";

// ── Types ──────────────────────────────────────────────────────────────────

type ProviderInfo = {
  id: AIProvider;
  defaultModel: string;
  freeModels: string[];
  paidModels?: string[];
  category?: ProviderCategory;
  capabilities?: ModelCapability[];
  supportsStreaming?: boolean;
  notes?: string;
  rateLimits?: { requestsPerMinute?: number; tokensPerMinute?: number };
};

type Props = {
  providers: ProviderInfo[];
  selectedProvider: AIProvider;
  selectedModel: string;
  onSelectModel: (provider: AIProvider, model: string) => void;
};

// ── Provider metadata ──────────────────────────────────────────────────────

const providerMeta: Record<
  string,
  { icon: string; label: string; accent: string }
> = {
  openai: { icon: "◉", label: "OpenAI", accent: "text-emerald-500" },
  anthropic: { icon: "◈", label: "Anthropic", accent: "text-amber-600" },
  openrouter: { icon: "⚡", label: "OpenRouter", accent: "text-orange-500" },
  "google-ai": { icon: "✦", label: "Google AI", accent: "text-blue-500" },
  mistral: { icon: "◆", label: "Mistral", accent: "text-cyan-500" },
  nvidia: { icon: "▲", label: "NVIDIA", accent: "text-green-500" },
  huggingface: { icon: "🤗", label: "Hugging Face", accent: "text-yellow-500" },
  groq: { icon: "🔥", label: "Groq", accent: "text-amber-500" },
  cerebras: { icon: "🧠", label: "Cerebras", accent: "text-purple-500" },
  cohere: { icon: "◎", label: "Cohere", accent: "text-pink-500" },
  "github-models": { icon: "⬡", label: "GitHub Models", accent: "text-indigo-500" },
  cloudflare: { icon: "☁", label: "Cloudflare", accent: "text-orange-400" },
  sambanova: { icon: "◈", label: "SambaNova", accent: "text-violet-500" },
  hyperbolic: { icon: "∞", label: "Hyperbolic", accent: "text-rose-500" },
  fireworks: { icon: "✧", label: "Fireworks", accent: "text-red-500" },
  scaleway: { icon: "◇", label: "Scaleway", accent: "text-teal-500" },
  nebius: { icon: "◬", label: "Nebius", accent: "text-sky-500" },
  novita: { icon: "✶", label: "Novita", accent: "text-lime-500" },
  ai21: { icon: "㉑", label: "AI21", accent: "text-blue-400" },
  upstage: { icon: "↑", label: "Upstage", accent: "text-violet-400" },
  together: { icon: "⊕", label: "Together", accent: "text-indigo-400" },
  deepseek: { icon: "◉", label: "DeepSeek", accent: "text-blue-600" },
  nlpcloud: { icon: "☁", label: "NLP Cloud", accent: "text-slate-500" },
  "alibaba-cloud": { icon: "☁", label: "Alibaba Cloud", accent: "text-orange-600" },
  "inference-net": { icon: "⊞", label: "Inference.net", accent: "text-green-400" },
  baseten: { icon: "▣", label: "Baseten", accent: "text-purple-400" },
  modal: { icon: "▦", label: "Modal", accent: "text-emerald-400" },
  aihubmix: { icon: "⊛", label: "AIHubMix", accent: "text-pink-400" },
  "google-vertex": { icon: "✦", label: "Vertex AI", accent: "text-blue-500" },
  "vercel-ai": { icon: "▵", label: "Vercel AI", accent: "text-foreground" },
  stability: { icon: "◎", label: "Stability", accent: "text-purple-500" },
  replicate: { icon: "◉", label: "Replicate", accent: "text-blue-400" },
  runpod: { icon: "▶", label: "RunPod", accent: "text-violet-500" },
  banana: { icon: "🍌", label: "Banana", accent: "text-yellow-400" },
};

const capabilityIcons: Record<ModelCapability, typeof Code> = {
  text: MessageSquare,
  code: Code,
  vision: Eye,
  audio: Headphones,
  multimodal: Layers,
  embeddings: Cpu,
  infra: Gauge,
};

const categoryStyles: Record<ProviderCategory, { label: string; className: string }> = {
  free: { label: "Free", className: "bg-success/10 text-success border-success/20" },
  trial: { label: "Trial", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  paid: { label: "Paid", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  community: { label: "Community", className: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  infra: { label: "Infra", className: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20" },
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function getMeta(id: string) {
  return providerMeta[id] ?? { icon: "●", label: formatName(id), accent: "text-muted-foreground" };
}

function formatName(id: string): string {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatModelName(model: string): string {
  return model.replace(/^.*\//, "").replace(/:free$/, "");
}

function truncateModel(model: string, max = 22): string {
  const name = formatModelName(model);
  return name.length > max ? name.slice(0, max - 1) + "…" : name;
}

// ── Component ──────────────────────────────────────────────────────────────

export function ModelSelector({
  providers,
  selectedProvider,
  selectedModel,
  onSelectModel,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeProvider, setActiveProvider] = useState<string>(selectedProvider);
  const [showInfo, setShowInfo] = useState(false);

  const meta = getMeta(selectedProvider);

  // Sorted providers — ones with freeModels first, then by name
  const sortedProviders = useMemo(() => {
    return [...providers].sort((a, b) => {
      const af = a.freeModels.length > 0 ? 1 : 0;
      const bf = b.freeModels.length > 0 ? 1 : 0;
      if (af !== bf) return bf - af;
      return getMeta(a.id).label.localeCompare(getMeta(b.id).label);
    });
  }, [providers]);

  const activeProviderData = useMemo(
    () => sortedProviders.find((p) => p.id === activeProvider) ?? sortedProviders[0],
    [sortedProviders, activeProvider],
  );

  // Models filtered by search
  const filteredModels = useMemo(() => {
    if (!activeProviderData) return { free: [], paid: [] };
    const q = search.toLowerCase();
    const free = activeProviderData.freeModels
      .filter((m) => !q || formatModelName(m).toLowerCase().includes(q))
      .map((m) => ({ id: m, name: formatModelName(m), isFree: true }));
    const paid = (activeProviderData.paidModels ?? [])
      .filter((m) => !q || formatModelName(m).toLowerCase().includes(q))
      .map((m) => ({ id: m, name: formatModelName(m), isFree: false }));
    return { free, paid };
  }, [activeProviderData, search]);

  const handleSelect = useCallback(
    (model: string) => {
      onSelectModel(activeProviderData?.id ?? selectedProvider, model);
      setOpen(false);
      setSearch("");
    },
    [activeProviderData, selectedProvider, onSelectModel],
  );

  const handleProviderClick = useCallback((id: string) => {
    setActiveProvider(id);
    setSearch("");
    setShowInfo(false);
  }, []);

  const totalModels = filteredModels.free.length + filteredModels.paid.length;

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v) {
          setActiveProvider(selectedProvider);
          setSearch("");
          setShowInfo(false);
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-1.5 h-7 rounded-lg px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer select-none"
          aria-label="Select model"
        >
          <span className={cn("text-sm leading-none", meta.accent)}>
            {meta.icon}
          </span>
          <span className="font-medium truncate max-w-36">
            {truncateModel(selectedModel)}
          </span>
          <ChevronDown className="size-3 opacity-50" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[420px] p-0 rounded-2xl border border-border/60 shadow-2xl bg-popover overflow-hidden"
        align="end"
        sideOffset={8}
      >
        {/* ── Search bar ── */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/40">
          <Search className="size-3.5 text-muted-foreground/50 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search models…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none"
            autoFocus
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-muted-foreground/50 hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        <div className="flex h-[360px]">
          {/* ── Provider sidebar ── */}
          <div className="w-[140px] border-r border-border/40 overflow-y-auto py-1.5 px-1.5 bg-muted/20">
            {sortedProviders.map((p) => {
              const pm = getMeta(p.id);
              const isActive = p.id === activeProvider;
              const isSelected = p.id === selectedProvider;
              const count = p.freeModels.length + (p.paidModels?.length ?? 0);

              return (
                <button
                  key={p.id}
                  onClick={() => handleProviderClick(p.id)}
                  className={cn(
                    "w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-all text-xs",
                    isActive
                      ? "bg-accent/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  <span className={cn("text-xs shrink-0 w-4 text-center", pm.accent)}>
                    {pm.icon}
                  </span>
                  <span className="flex-1 truncate font-medium text-[11px]">
                    {pm.label}
                  </span>
                  {isSelected && (
                    <span className="size-1.5 rounded-full bg-accent shrink-0" />
                  )}
                  {!isSelected && count > 0 && (
                    <span className="text-[9px] tabular-nums text-muted-foreground/40">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Model list ── */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Provider header */}
            {activeProviderData && (
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border/30 shrink-0">
                <span className={cn("text-sm", getMeta(activeProviderData.id).accent)}>
                  {getMeta(activeProviderData.id).icon}
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {getMeta(activeProviderData.id).label}
                </span>
                {activeProviderData.category && (
                  <span
                    className={cn(
                      "text-[9px] font-medium px-1.5 py-0.5 rounded-full border",
                      categoryStyles[activeProviderData.category]?.className ??
                        "bg-muted text-muted-foreground",
                    )}
                  >
                    {categoryStyles[activeProviderData.category]?.label ?? activeProviderData.category}
                  </span>
                )}
                {activeProviderData.supportsStreaming !== false && (
                  <Zap className="size-3 text-amber-500/60" />
                )}
                <div className="flex-1" />
                {(activeProviderData.capabilities?.length || activeProviderData.notes || activeProviderData.rateLimits) && (
                  <button
                    onClick={() => setShowInfo(!showInfo)}
                    className={cn(
                      "size-5 rounded flex items-center justify-center transition-colors",
                      showInfo
                        ? "bg-accent/15 text-accent"
                        : "text-muted-foreground/40 hover:text-muted-foreground",
                    )}
                  >
                    <Info className="size-3" />
                  </button>
                )}
              </div>
            )}

            {/* Provider info panel (collapsible) */}
            {showInfo && activeProviderData && (
              <div className="px-3 py-2.5 border-b border-border/30 bg-muted/30 space-y-2 shrink-0 animate-fade-in-up">
                {/* Capabilities */}
                {activeProviderData.capabilities && activeProviderData.capabilities.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-medium mr-1">
                      Capabilities
                    </span>
                    {activeProviderData.capabilities.map((cap) => {
                      const Icon = capabilityIcons[cap] ?? Cpu;
                      return (
                        <span
                          key={cap}
                          className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/60 rounded px-1.5 py-0.5"
                        >
                          <Icon className="size-2.5" />
                          {cap}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Rate limits */}
                {activeProviderData.rateLimits && (
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-medium">
                      Limits
                    </span>
                    {activeProviderData.rateLimits.requestsPerMinute && (
                      <span className="text-[10px] text-muted-foreground tabular-nums">
                        {activeProviderData.rateLimits.requestsPerMinute} req/min
                      </span>
                    )}
                    {activeProviderData.rateLimits.tokensPerMinute && (
                      <span className="text-[10px] text-muted-foreground tabular-nums">
                        {(activeProviderData.rateLimits.tokensPerMinute / 1000).toFixed(0)}k tok/min
                      </span>
                    )}
                  </div>
                )}

                {/* Notes */}
                {activeProviderData.notes && (
                  <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
                    {activeProviderData.notes}
                  </p>
                )}
              </div>
            )}

            {/* Model list */}
            <div className="flex-1 overflow-y-auto py-1 px-1.5">
              {totalModels === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <p className="text-xs text-muted-foreground/60">
                    {search ? "No models match your search" : "No models available"}
                  </p>
                </div>
              ) : (
                <>
                  {/* Free models */}
                  {filteredModels.free.length > 0 && (
                    <div className="mb-1">
                      {filteredModels.paid.length > 0 && (
                        <div className="flex items-center gap-1.5 px-2 pt-1 pb-1.5">
                          <Zap className="size-2.5 text-success" />
                          <span className="text-[9px] uppercase tracking-wider font-semibold text-success/70">
                            Free
                          </span>
                          <span className="text-[9px] tabular-nums text-muted-foreground/30 ml-auto">
                            {filteredModels.free.length}
                          </span>
                        </div>
                      )}
                      {filteredModels.free.map((m) => (
                        <ModelRow
                          key={m.id}
                          model={m}
                          isSelected={selectedProvider === activeProvider && selectedModel === m.id}
                          onSelect={handleSelect}
                        />
                      ))}
                    </div>
                  )}

                  {/* Paid models */}
                  {filteredModels.paid.length > 0 && (
                    <div className="mb-1">
                      <div className="flex items-center gap-1.5 px-2 pt-2 pb-1.5">
                        <Crown className="size-2.5 text-amber-500" />
                        <span className="text-[9px] uppercase tracking-wider font-semibold text-amber-500/70">
                          Paid
                        </span>
                        <span className="text-[9px] tabular-nums text-muted-foreground/30 ml-auto">
                          {filteredModels.paid.length}
                        </span>
                      </div>
                      {filteredModels.paid.map((m) => (
                        <ModelRow
                          key={m.id}
                          model={m}
                          isSelected={selectedProvider === activeProvider && selectedModel === m.id}
                          onSelect={handleSelect}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ── Model Row ──────────────────────────────────────────────────────────────

function ModelRow({
  model,
  isSelected,
  onSelect,
}: {
  model: { id: string; name: string; isFree: boolean };
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(model.id)}
      className={cn(
        "w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left transition-all text-xs group",
        isSelected
          ? "bg-accent/10 text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
      )}
    >
      <span className="flex-1 truncate font-mono text-[11px]">{model.name}</span>
      {model.isFree && (
        <span className="text-[8px] font-semibold tracking-wider uppercase text-success/60 shrink-0">
          free
        </span>
      )}
      {isSelected && (
        <div className="size-4 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
          <Check className="size-2.5 text-accent" />
        </div>
      )}
    </button>
  );
}
