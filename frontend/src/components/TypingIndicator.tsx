import { motion } from "framer-motion";

export default function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="flex gap-3 justify-start"
        >
            <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gl-elevated border border-gl-border flex items-center justify-center mt-0.5">
                <svg viewBox="0 0 36 36" fill="none" className="w-4 h-4">
                    <path
                        d="M2 26.4L18 4L34 26.4L26.7 32L18 22L9.3 32L2 26.4Z"
                        fill="none" stroke="#FC6D26" strokeWidth="2.5" strokeLinejoin="round"
                    />
                </svg>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gl-muted font-mono px-1">handbook</span>
                <div className="bg-gl-surface border border-gl-border rounded-2xl rounded-tl-md px-4 py-3.5 flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-gl-muted"
                            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}