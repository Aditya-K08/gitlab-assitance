import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeToProgress, type ProgressEvent } from "../api";

const FACTS = [
    "GitLab is one of the world's largest all-remote companies with 2,000+ team members across 65+ countries.",
    "GitLab's handbook is over 2,000 pages — one of the most comprehensive public company guides ever written.",
    "GitLab operates with a 'handbook-first' approach: if it isn't in the handbook, it doesn't exist.",
    "GitLab was founded in 2011 and became a public company in October 2021.",
    "GitLab's single application covers the entire DevSecOps lifecycle — from planning to monitoring.",
    "GitLab uses GitLab to build GitLab — a true dog-fooding culture.",
    "The GitLab handbook is open source and anyone can contribute via merge requests.",
    "GitLab has no offices. Every meeting is a video call, every decision is documented.",
];

type Phase = "crawling" | "chunking" | "indexing" | "ready";

interface CrawlEntry {
    url: string;
    count: number;
}

interface LoaderProps {
    onReady: () => void;
}

export default function Loader({ onReady }: LoaderProps) {
    const [phase, setPhase] = useState<Phase>("crawling");
    const [crawledPages, setCrawledPages] = useState<CrawlEntry[]>([]);
    const [crawlCount, setCrawlCount] = useState(0);
    const [crawlTotal, setCrawlTotal] = useState(120);
    const [chunkedCount, setChunkedCount] = useState(0);
    const [factIndex, setFactIndex] = useState(0);
    const [showFact, setShowFact] = useState(true);
    const logRef = useRef<HTMLDivElement>(null);
    const mountedRef = useRef(true);

    // Rotate facts
    useEffect(() => {
        const interval = setInterval(() => {
            setShowFact(false);
            setTimeout(() => {
                if (!mountedRef.current) return;
                setFactIndex((i) => (i + 1) % FACTS.length);
                setShowFact(true);
            }, 350);
        }, 4500);
        return () => {
            mountedRef.current = false;
            clearInterval(interval);
        };
    }, []);

    // Subscribe to SSE
    useEffect(() => {
        const unsub = subscribeToProgress(
            (event: ProgressEvent) => {
                if (event.type === "crawling") {
                    setPhase("crawling");
                    setCrawlCount(event.count);
                    setCrawlTotal(event.total);
                    setCrawledPages((prev) => {
                        const next = [...prev, { url: event.url, count: event.count }];
                        return next.slice(-60); // keep last 60
                    });
                    // Auto-scroll log
                    setTimeout(() => {
                        if (logRef.current) {
                            logRef.current.scrollTop = logRef.current.scrollHeight;
                        }
                    }, 30);
                } else if (event.type === "chunking") {
                    setPhase("chunking");
                    setChunkedCount(event.count);
                } else if (event.type === "indexing") {
                    setPhase("indexing");
                } else if (event.type === "ready") {
                    setPhase("ready");
                }
            },
            () => {
                setTimeout(() => onReady(), 900);
            }
        );
        return unsub;
    }, [onReady]);

    const progress =
        phase === "crawling"
            ? Math.round((crawlCount / crawlTotal) * 60)
            : phase === "chunking"
                ? 65
                : phase === "indexing"
                    ? 80
                    : 100;

    const phaseLabel =
        phase === "crawling"
            ? `Crawling handbook pages — ${crawlCount} / ${crawlTotal}`
            : phase === "chunking"
                ? `Chunking ${chunkedCount} documents`
                : phase === "indexing"
                    ? "Building vector index…"
                    : "Assistant ready!";

    const steps: { id: Phase; label: string }[] = [
        { id: "crawling", label: "Crawl handbook pages" },
        { id: "chunking", label: "Chunk documents" },
        { id: "indexing", label: "Build vector index" },
        { id: "ready",    label: "Prepare AI assistant" },
    ];

    const phaseOrder: Phase[] = ["crawling", "chunking", "indexing", "ready"];
    const currentIdx = phaseOrder.indexOf(phase);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-gl-dark z-50 px-6 py-8"
        >
            {/* Background grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(#FC6D26 1px, transparent 1px), linear-gradient(90deg, #FC6D26 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-600/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-2xl flex flex-col gap-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3"
                >
                    <div className="w-8 h-8">
                        <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8">
                            <path d="M2 26.4L18 4L34 26.4L26.7 32L18 22L9.3 32L2 26.4Z"
                                  fill="none" stroke="#FC6D26" strokeWidth="2" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-gl-text font-semibold text-sm leading-tight">GitLab Handbook Assistant</p>
                        <p className="text-gl-muted text-xs font-mono">Initializing — takes ~40–50s on first launch</p>
                    </div>
                </motion.div>

                {/* Steps row */}
                <div className="flex items-center gap-2">
                    {steps.map((step, idx) => {
                        const isCompleted = idx < currentIdx;
                        const isActive = idx === currentIdx;
                        return (
                            <div key={step.id} className="flex items-center gap-2 flex-1 min-w-0">
                                <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono whitespace-nowrap transition-all duration-500 ${
                                    isCompleted
                                        ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
                                        : isActive
                                            ? "border-orange-500/50 bg-orange-500/10 text-orange-300"
                                            : "border-gl-border/40 bg-transparent text-gl-muted"
                                }`}>
                                    {isCompleted ? (
                                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 12 12">
                                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : isActive ? (
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse flex-shrink-0" />
                                    ) : (
                                        <div className="w-1.5 h-1.5 rounded-full bg-gl-border flex-shrink-0" />
                                    )}
                                    <span className="truncate">{step.label}</span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className={`h-px flex-1 transition-all duration-700 ${
                                        idx < currentIdx ? "bg-orange-500/40" : "bg-gl-border/30"
                                    }`} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Live crawl log */}
                <div className="rounded-xl border border-gl-border bg-gl-surface overflow-hidden">
                    {/* Log header */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gl-border bg-gl-elevated">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                            </div>
                            <span className="text-xs text-gl-muted font-mono ml-1">backend console</span>
                        </div>
                        <span className="text-xs text-gl-muted font-mono">{crawlCount} pages crawled</span>
                    </div>

                    {/* Log body */}
                    <div
                        ref={logRef}
                        className="h-48 overflow-y-auto p-3 font-mono text-xs space-y-0.5"
                        style={{ scrollBehavior: "smooth" }}
                    >
                        {crawledPages.length === 0 ? (
                            <div className="flex items-center gap-2 text-gl-muted">
                                <div className="flex gap-0.5">
                                    {[0,1,2].map(i => (
                                        <div key={i} className="w-1 h-3 rounded-full bg-orange-500/50 animate-pulse2"
                                             style={{ animationDelay: `${i * 0.15}s` }} />
                                    ))}
                                </div>
                                <span>Connecting to backend...</span>
                            </div>
                        ) : (
                            crawledPages.map((entry, i) => (
                                <motion.div
                                    key={`${entry.url}-${i}`}
                                    initial={{ opacity: 0, x: -6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-start gap-2"
                                >
                  <span className="text-gl-muted flex-shrink-0 w-8 text-right">
                    {String(entry.count).padStart(3, " ")}
                  </span>
                                    <span className="text-orange-500/70 flex-shrink-0">›</span>
                                    <span className="text-gl-subtle truncate hover:text-gl-text transition-colors" title={entry.url}>
                    {entry.url.replace("https://handbook.gitlab.com", "")}
                  </span>
                                </motion.div>
                            ))
                        )}

                        {/* Phase messages */}
                        {phase === "chunking" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="flex items-center gap-2 text-emerald-400 mt-1 pt-1 border-t border-gl-border/30">
                                <span className="text-gl-muted w-8 text-right">---</span>
                                <span className="text-emerald-500/70">›</span>
                                <span>Chunking {chunkedCount} documents into semantic units...</span>
                            </motion.div>
                        )}
                        {phase === "indexing" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="flex items-center gap-2 text-blue-400 mt-1 pt-1 border-t border-gl-border/30">
                                <span className="text-gl-muted w-8 text-right">---</span>
                                <span className="text-blue-500/70">›</span>
                                <span>Building vector index with HuggingFace embeddings...</span>
                            </motion.div>
                        )}
                        {phase === "ready" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="flex items-center gap-2 text-emerald-400 mt-1 pt-1 border-t border-gl-border/30">
                                <span className="text-gl-muted w-8 text-right">✓</span>
                                <span className="text-emerald-500/70">›</span>
                                <span className="text-emerald-400 font-medium">GitLab Handbook Assistant is ready!</span>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Progress bar */}
                <div>
                    <div className="flex justify-between text-xs text-gl-muted mb-1.5 font-mono">
                        <span>{phaseLabel}</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-1 bg-gl-elevated rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* GitLab fact */}
                <div className="border border-gl-border/50 rounded-xl px-4 py-3 bg-gl-surface/30 flex items-start gap-2">
                    <span className="text-orange-500 text-xs font-mono font-medium flex-shrink-0 mt-0.5">✦ FACT</span>
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={factIndex}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: showFact ? 1 : 0, y: showFact ? 0 : -4 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.3 }}
                            className="text-gl-subtle text-sm leading-relaxed"
                        >
                            {FACTS[factIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>

            </div>
        </motion.div>
    );
}