"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

function formatProviderName(id: string): string {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatModelName(model: string): string {
  return model.replace(/^.*\//, "").replace(/:free$/, "");
}

function truncateModel(model: string, max = 28): string {
  const name = formatModelName(model);
  return name.length > max ? name.slice(0, max - 1) + "…" : name;
}

export function ModelSelector({
  providers,
  selectedProvider,
  selectedModel,
  onSelectModel,
}: Props) {
  const [providerOpen, setProviderOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);

  const currentProvider = providers.find((p) => p.id === selectedProvider);
  const models = currentProvider?.freeModels ?? [];

  function handleProviderSelect(providerId: AIProvider) {
    const provider = providers.find((p) => p.id === providerId);
    if (provider) {
      onSelectModel(providerId, provider.freeModels[0] ?? provider.defaultModel);
    }
    setProviderOpen(false);
  }

  function handleModelSelect(model: string) {
    onSelectModel(selectedProvider, model);
    setModelOpen(false);
  }

  return (
    <div className="flex items-center gap-1.5">
      {/* ── Provider Pill ── */}
      <Popover open={providerOpen} onOpenChange={setProviderOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            role="combobox"
            aria-expanded={providerOpen}
            className="h-8 gap-1.5 rounded-full border border-border/60 bg-card/80 px-3 text-xs font-medium shadow-sm backdrop-blur-sm hover:bg-card hover:border-border transition-all"
          >
            <span className="text-foreground">
              {formatProviderName(selectedProvider)}
            </span>
            <ChevronsUpDown className="size-3 text-muted-foreground/60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-60 p-0 rounded-xl border border-border/60 shadow-lg"
          align="start"
          sideOffset={6}
        >
          <Command>
            <CommandInput placeholder="Search providers…" className="text-xs" />
            <CommandList>
              <CommandEmpty className="py-4 text-xs text-muted-foreground">
                No provider found.
              </CommandEmpty>
              <CommandGroup>
                {providers.map((provider) => (
                  <CommandItem
                    key={provider.id}
                    value={provider.id}
                    onSelect={() => handleProviderSelect(provider.id)}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs cursor-pointer"
                  >
                    <div className="flex items-center justify-center size-5 rounded-md bg-muted text-[10px] font-bold text-muted-foreground shrink-0">
                      {formatProviderName(provider.id).charAt(0)}
                    </div>
                    <span className="flex-1 truncate font-medium">
                      {formatProviderName(provider.id)}
                    </span>
                    <Badge
                      variant="muted"
                      className="text-[10px] tabular-nums px-1.5 py-0 h-4.5 rounded-full"
                    >
                      {provider.freeModels.length}
                    </Badge>
                    <Check
                      className={cn(
                        "size-3.5 shrink-0 text-foreground",
                        selectedProvider === provider.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <span className="text-muted-foreground/40 text-xs select-none">/</span>

      {/* ── Model Pill ── */}
      <Popover open={modelOpen} onOpenChange={setModelOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            role="combobox"
            aria-expanded={modelOpen}
            className="h-8 max-w-60 gap-1.5 rounded-full border border-border/60 bg-card/80 px-3 text-xs font-medium shadow-sm backdrop-blur-sm hover:bg-card hover:border-border transition-all"
          >
            <span className="truncate text-muted-foreground">
              {truncateModel(selectedModel)}
            </span>
            <ChevronsUpDown className="size-3 text-muted-foreground/60 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[320px] p-0 rounded-xl border border-border/60 shadow-lg"
          align="start"
          sideOffset={6}
        >
          <Command>
            <CommandInput placeholder="Search models…" className="text-xs" />
            <CommandList className="max-h-70">
              <CommandEmpty className="py-4 text-xs text-muted-foreground">
                No model found.
              </CommandEmpty>
              <CommandGroup>
                {models.map((model) => (
                  <CommandItem
                    key={model}
                    value={formatModelName(model)}
                    onSelect={() => handleModelSelect(model)}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs cursor-pointer"
                  >
                    <span className="flex-1 truncate font-mono text-[11px]">
                      {formatModelName(model)}
                    </span>
                    <Check
                      className={cn(
                        "size-3.5 shrink-0 text-foreground",
                        selectedModel === model ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
