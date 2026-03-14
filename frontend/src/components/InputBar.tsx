import { useRef, useState } from "react";

interface InputBarProps {
    onSend: (message: string) => void;
    disabled: boolean;
}

export default function InputBar({ onSend, disabled }: InputBarProps) {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        const trimmed = value.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setValue("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        const el = textareaRef.current;
        if (el) {
            el.style.height = "auto";
            el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
        }
    };

    const canSend = value.trim().length > 0 && !disabled;

    return (
        <div className="flex-shrink-0 px-4 pb-5 pt-3">
            <div className={`flex items-end gap-3 bg-gl-surface border rounded-2xl px-4 py-3 transition-all duration-200 ${
                canSend ? "border-orange-500/40 shadow-[0_0_20px_rgba(252,109,38,0.06)]" : "border-gl-border"
            }`}>
        <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? "Waiting for response..." : "Ask anything about the GitLab Handbook…"}
            rows={1}
            className="flex-1 bg-transparent text-gl-text placeholder-gl-muted text-sm resize-none outline-none font-sans leading-relaxed min-h-[22px] max-h-[160px] disabled:opacity-50"
        />
                <button
                    onClick={handleSend}
                    disabled={!canSend}
                    className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        canSend
                            ? "bg-orange-500 hover:bg-orange-400 text-white shadow-lg shadow-orange-500/20"
                            : "bg-gl-elevated text-gl-muted cursor-not-allowed"
                    }`}
                >
                    {disabled ? (
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                    ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
                            <path d="M2 8h12M8 2l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </button>
            </div>
            <p className="text-center text-[10px] text-gl-muted/50 mt-2 font-mono">
                Enter to send · Shift+Enter for new line · Powered by Gemini 2.5 Flash
            </p>
        </div>
    );
}