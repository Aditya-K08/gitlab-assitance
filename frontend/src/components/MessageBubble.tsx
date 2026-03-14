import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "../types";
import CodeBlock from "./CodeBlock";

interface MessageBubbleProps {
    message: Message;
    index: number;
}

export default function MessageBubble({ message, index }: MessageBubbleProps) {
    const isUser = message.role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
        >
            {!isUser && (
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gl-elevated border border-gl-border flex items-center justify-center mt-0.5">
                    <svg viewBox="0 0 36 36" fill="none" className="w-4 h-4">
                        <path
                            d="M2 26.4L18 4L34 26.4L26.7 32L18 22L9.3 32L2 26.4Z"
                            fill="none" stroke="#FC6D26" strokeWidth="2.5" strokeLinejoin="round"
                        />
                    </svg>
                </div>
            )}

            <div className={`max-w-[82%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <span className="text-[10px] text-gl-muted font-mono px-1">
          {isUser ? "you" : "handbook"}
        </span>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                        ? "bg-orange-500/15 border border-orange-500/25 text-gl-text rounded-tr-md"
                        : "bg-gl-surface border border-gl-border text-gl-text rounded-tl-md"
                }`}>
                    {isUser ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                        <div className="markdown-body">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    // @ts-expect-error – react-markdown typing
                                    code: CodeBlock,
                                    a: ({ href, children }) => (
                                        <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
                                    ),
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
                <span className="text-[10px] text-gl-muted/60 px-1 font-mono">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
            </div>
        </motion.div>
    );
}