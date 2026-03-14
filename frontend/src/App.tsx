import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AppPhase } from "./types";
import { useChat } from "./hooks/useChat";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Welcome from "./components/Welcome";
import MessageBubble from "./components/MessageBubble";
import TypingIndicator from "./components/TypingIndicator";
import InputBar from "./components/InputBar";

export default function App() {
    const [phase, setPhase] = useState<AppPhase>("idle");
    const scrollRef = useRef<HTMLDivElement>(null);
    const { messages, isTyping, error, send, clearChat } = useChat();

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSend = useCallback(
        (text: string) => {
            if (phase === "idle") {
                setPhase("loading");
                sessionStorage.setItem("pendingMessage", text);
            } else if (phase === "chat") {
                send(text);
            }
        },
        [phase, send]
    );

    const handleLoaderReady = useCallback(() => {
        setPhase("chat");
        const pending = sessionStorage.getItem("pendingMessage");
        if (pending) {
            sessionStorage.removeItem("pendingMessage");
            setTimeout(() => send(pending), 400);
        }
    }, [send]);

    return (
        <div className="h-screen flex flex-col bg-gl-dark overflow-hidden relative">
            <AnimatePresence>
                {phase === "loading" && (
                    <Loader key="loader" onReady={handleLoaderReady} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {(phase === "idle" || phase === "chat") && (
                    <motion.div
                        key="chat-ui"
                        initial={phase === "chat" ? { opacity: 0 } : false}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col h-full"
                    >
                        {phase === "chat" && <Header />}

                        {phase === "idle" && (
                            <div className="flex flex-col h-full">
                                <div className="flex-shrink-0 h-14 flex items-center px-5 gap-3">
                                    <div className="w-7 h-7 flex items-center justify-center">
                                        <svg viewBox="0 0 36 36" fill="none" className="w-6 h-6">
                                            <path d="M2 26.4L18 4L34 26.4L26.7 32L18 22L9.3 32L2 26.4Z"
                                                  fill="none" stroke="#FC6D26" strokeWidth="2.5" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gl-text leading-none">GitLab Handbook Assistant</p>
                                        <p className="text-xs text-gl-muted mt-0.5">Ask anything about the GitLab Handbook</p>
                                    </div>
                                </div>
                                <Welcome onSuggestion={handleSend} />
                                <InputBar onSend={handleSend} disabled={false} />
                            </div>
                        )}

                        {phase === "chat" && (
                            <>
                                <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
                                    <AnimatePresence initial={false}>
                                        {messages.length === 0 ? (
                                            <Welcome key="welcome" onSuggestion={send} />
                                        ) : (
                                            messages.map((msg, idx) => (
                                                <MessageBubble key={msg.id} message={msg} index={idx} />
                                            ))
                                        )}
                                    </AnimatePresence>
                                    <AnimatePresence>
                                        {isTyping && <TypingIndicator key="typing" />}
                                    </AnimatePresence>
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div key="error" initial={{ opacity: 0, y: 8 }}
                                                        animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                        className="flex justify-start">
                                                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl rounded-tl-md px-4 py-3 text-sm text-red-400 max-w-[80%]">
                                                    <span className="font-medium">Error: </span>{error}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {messages.length > 0 && !isTyping && (
                                    <div className="flex-shrink-0 flex justify-center pb-1">
                                        <button onClick={clearChat}
                                                className="text-[11px] text-gl-muted hover:text-gl-subtle transition-colors font-mono flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-gl-surface">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 16 16">
                                                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                            Clear chat
                                        </button>
                                    </div>
                                )}
                                <InputBar onSend={send} disabled={isTyping} />
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}