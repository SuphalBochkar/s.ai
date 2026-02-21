"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Bot } from "lucide-react";
import { useState, memo, useMemo } from "react";

type Props = {
  content: string;
  role: "user" | "assistant";
};

// ── Code Block — memoized to prevent re-render during streaming ────────────

const CodeBlock = memo(function CodeBlock({
  className,
  children,
}: {
  className?: string;
  children: string;
}) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className ?? "");
  const lang = match?.[1] ?? "";
  const code = children.replace(/\n$/, "");

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="relative group my-3 rounded-xl overflow-hidden border border-border/30 bg-[#141211] dark:bg-[#0e0d0c]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <span className="text-[10px] font-mono text-white/25 uppercase tracking-wider">
          {lang || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] text-white/25 hover:text-white/50 transition-colors"
        >
          {copied ? (
            <>
              <Check className="size-3" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={lang || "text"}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "0.8rem",
          lineHeight: 1.7,
          background: "transparent",
          padding: "1rem 1.25rem",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
});

// ── Markdown components — stable reference to avoid re-creation ────────────

const markdownComponents: Components = {
  code({ className, children, ...props }) {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="px-1.5 py-0.5 rounded-md bg-muted text-[0.8rem] font-mono text-foreground"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <CodeBlock className={className}>
        {String(children)}
      </CodeBlock>
    );
  },
  p({ children }) {
    return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
  },
  ul({ children }) {
    return (
      <ul className="mb-3 pl-4 list-disc space-y-1 marker:text-muted-foreground/30">
        {children}
      </ul>
    );
  },
  ol({ children }) {
    return (
      <ol className="mb-3 pl-4 list-decimal space-y-1 marker:text-muted-foreground/50">
        {children}
      </ol>
    );
  },
  li({ children }) {
    return <li className="leading-relaxed">{children}</li>;
  },
  h1({ children }) {
    return (
      <h1 className="text-base font-semibold mb-2 mt-5 first:mt-0 tracking-tight">
        {children}
      </h1>
    );
  },
  h2({ children }) {
    return (
      <h2 className="text-[15px] font-semibold mb-2 mt-4 first:mt-0 tracking-tight">
        {children}
      </h2>
    );
  },
  h3({ children }) {
    return (
      <h3 className="text-sm font-semibold mb-1.5 mt-3 first:mt-0">
        {children}
      </h3>
    );
  },
  blockquote({ children }) {
    return (
      <blockquote className="border-l-2 border-accent/30 pl-4 my-3 text-muted-foreground italic">
        {children}
      </blockquote>
    );
  },
  hr() {
    return <hr className="my-4 border-border/40" />;
  },
  a({ href, children }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline underline-offset-2 decoration-accent/30 hover:decoration-accent transition-colors"
      >
        {children}
      </a>
    );
  },
  strong({ children }) {
    return <strong className="font-semibold text-foreground">{children}</strong>;
  },
  table({ children }) {
    return (
      <div className="overflow-x-auto my-3 rounded-xl border border-border/40">
        <table className="w-full text-sm">{children}</table>
      </div>
    );
  },
  thead({ children }) {
    return <thead className="bg-muted/30">{children}</thead>;
  },
  th({ children }) {
    return (
      <th className="text-left px-3 py-2 border-b border-border/40 font-medium text-xs text-muted-foreground uppercase tracking-wider">
        {children}
      </th>
    );
  },
  td({ children }) {
    return (
      <td className="px-3 py-2 border-b border-border/20">{children}</td>
    );
  },
};

const remarkPlugins = [remarkGfm];

// ── Message Bubble ─────────────────────────────────────────────────────────

export const MessageBubble = memo(function MessageBubble({ content, role }: Props) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end py-1.5 animate-fade-in-up">
        <div className="max-w-[80%]">
          <div className="rounded-2xl rounded-tr-sm bg-foreground text-background px-4 py-2.5 text-sm leading-relaxed">
            <p className="whitespace-pre-wrap">{content}</p>
          </div>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex py-2 animate-fade-in-up">
      <div className="flex items-start gap-3 max-w-full min-w-0">
        <div className="size-6 rounded-md bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
          <Bot className="size-3 text-accent" />
        </div>

        <div className="min-w-0 flex-1">
          {!content ? (
            <div className="flex items-center gap-1 py-2">
              <span className="size-1.5 rounded-full bg-accent/40 animate-pulse-soft" />
              <span className="size-1.5 rounded-full bg-accent/40 animate-pulse-soft [animation-delay:200ms]" />
              <span className="size-1.5 rounded-full bg-accent/40 animate-pulse-soft [animation-delay:400ms]" />
            </div>
          ) : (
            <div className="prose-sm prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
              <ReactMarkdown
                remarkPlugins={remarkPlugins}
                components={markdownComponents}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
