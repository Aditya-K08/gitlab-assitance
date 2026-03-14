import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import type { SyntaxHighlighterProps } from "react-syntax-highlighter";

const theme: SyntaxHighlighterProps["style"] = {
    'code[class*="language-"]': {
        color: "#C8C8D4", background: "none",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.8rem", lineHeight: "1.6",
    },
    'pre[class*="language-"]': {
        color: "#C8C8D4", background: "#141416",
        padding: "1rem", margin: "0", overflow: "auto",
    },
    comment: { color: "#52525E", fontStyle: "italic" },
    punctuation: { color: "#9898A6" },
    property: { color: "#FC6D26" },
    keyword: { color: "#FC8C50" },
    string: { color: "#98C379" },
    number: { color: "#61AFEF" },
    boolean: { color: "#FC6D26" },
    function: { color: "#61AFEF" },
    "class-name": { color: "#E5C07B" },
    operator: { color: "#9898A6" },
    variable: { color: "#C8C8D4" },
    tag: { color: "#FC6D26" },
    "attr-name": { color: "#E5C07B" },
    "attr-value": { color: "#98C379" },
};

interface CodeBlockProps {
    inline?: boolean;
    className?: string;
    children: React.ReactNode;
}

export default function CodeBlock({ inline, className, children }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);
    const match = /language-(\w+)/.exec(className ?? "");
    const lang = match?.[1] ?? "";
    const code = String(children).replace(/\n$/, "");

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    if (inline || !match) {
        return (
            <code className="font-mono text-[0.82em] bg-white/5 text-orange-400 px-1.5 py-0.5 rounded">
                {children}
            </code>
        );
    }

    return (
        <div className="relative group rounded-lg overflow-hidden border border-gl-border my-3">
            <div className="flex items-center justify-between px-3 py-1.5 bg-gl-surface border-b border-gl-border">
                <span className="text-xs text-gl-muted font-mono">{lang || "code"}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-gl-muted hover:text-gl-text transition-colors"
                >
                    {copied ? (
                        <>
                            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 16 16">
                                <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="text-emerald-400">Copied</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
                                <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                                <path d="M3 11V3h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                            </svg>
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <SyntaxHighlighter
                style={theme}
                language={lang}
                PreTag="div"
                customStyle={{ margin: 0, borderRadius: 0 }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}