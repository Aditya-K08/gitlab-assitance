import { useCallback, useState } from "react";
import { sendMessage } from "../api";
import type { Message } from "../types";

function makeId() {
    return Math.random().toString(36).slice(2, 10);
}

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const send = useCallback(async (text: string) => {
        setError(null);

        const userMsg: Message = {
            id: makeId(),
            role: "user",
            content: text,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setIsTyping(true);

        try {
            const response = await sendMessage(text);
            const assistantMsg: Message = {
                id: makeId(),
                role: "assistant",
                content: response,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMsg]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsTyping(false);
        }
    }, []);

    const clearChat = useCallback(() => {
        setMessages([]);
        setError(null);
    }, []);

    return { messages, isTyping, error, send, clearChat };
}