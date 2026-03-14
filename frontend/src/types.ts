export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export type AppPhase = "idle" | "loading" | "chat";

export interface LoadStep {
    id: string;
    label: string;
    sublabel: string;
    durationMs: number;
}