"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Bot } from "lucide-react";
import { useState } from "react";

type Props = {
  content: string;
  role: "user" | "assistant";
};

function CodeBlock({
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
    <div className="relative group my-3 rounded-xl overflow-hidden border border-border/40">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-white/4">
        <span className="text-[11px] font-mono text-white/30 uppercase tracking-wider">
          {lang || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors"
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
          fontSize: "0.8125rem",
          lineHeight: 1.7,
          background: "#1e1e1e",
          padding: "1rem 1.25rem",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export function MessageBubble({ content, role }: Props) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end py-2">
        <div className="flex items-start gap-2.5 max-w-[80%]">
          <div className="rounded-2xl rounded-tr-md bg-foreground text-background px-4 py-2.5 text-sm leading-relaxed shadow-sm">
            <p className="whitespace-pre-wrap">{content}</p>
          </div>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex py-3">
      <div className="flex items-start gap-3 max-w-full min-w-0">
        <div className="size-7 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
          <Bot className="size-3.5 text-muted-foreground" />
        </div>

        <div className="min-w-0 flex-1">
          {!content ? (
            <div className="flex items-center gap-1.5 py-2">
              <div className="size-1.5 rounded-full bg-muted-foreground/30 animate-pulse" />
              <div className="size-1.5 rounded-full bg-muted-foreground/30 animate-pulse [animation-delay:150ms]" />
              <div className="size-1.5 rounded-full bg-muted-foreground/30 animate-pulse [animation-delay:300ms]" />
            </div>
          ) : (
            <div className="prose-sm prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code
                          className="px-1.5 py-0.5 rounded-md bg-muted text-[0.8125rem] font-mono text-foreground"
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
                    return (
                      <p className="mb-3 last:mb-0 leading-relaxed">
                        {children}
                      </p>
                    );
                  },
                  ul({ children }) {
                    return (
                      <ul className="mb-3 pl-4 list-disc space-y-1.5 marker:text-muted-foreground/40">
                        {children}
                      </ul>
                    );
                  },
                  ol({ children }) {
                    return (
                      <ol className="mb-3 pl-4 list-decimal space-y-1.5 marker:text-muted-foreground/60">
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
                      <blockquote className="border-l-2 border-border pl-4 my-3 text-muted-foreground italic">
                        {children}
                      </blockquote>
                    );
                  },
                  hr() {
                    return <hr className="my-4 border-border/60" />;
                  },
                  a({ href, children }) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground underline underline-offset-2 decoration-border hover:decoration-foreground transition-colors"
                      >
                        {children}
                      </a>
                    );
                  },
                  strong({ children }) {
                    return (
                      <strong className="font-semibold text-foreground">
                        {children}
                      </strong>
                    );
                  },
                  table({ children }) {
                    return (
                      <div className="overflow-x-auto my-3 rounded-xl border border-border/60">
                        <table className="w-full text-sm">{children}</table>
                      </div>
                    );
                  },
                  thead({ children }) {
                    return <thead className="bg-muted/50">{children}</thead>;
                  },
                  th({ children }) {
                    return (
                      <th className="text-left px-3 py-2 border-b border-border/60 font-medium text-xs text-muted-foreground uppercase tracking-wider">
                        {children}
                      </th>
                    );
                  },
                  td({ children }) {
                    return (
                      <td className="px-3 py-2 border-b border-border/40">
                        {children}
                      </td>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
