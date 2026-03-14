import { motion } from "framer-motion";

const SUGGESTIONS = [
    "What is GitLab's approach to remote work?",
    "How does GitLab handle performance reviews?",
    "What is GitLab's communication philosophy?",
    "How does GitLab define its engineering values?",
];

interface WelcomeProps {
    onSuggestion: (text: string) => void;
}

export default function Welcome({ onSuggestion }: WelcomeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center"
        >
            <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gl-elevated border border-gl-border flex items-center justify-center">
                    <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8">
                        <path
                            d="M2 26.4L18 4L34 26.4L26.7 32L18 22L9.3 32L2 26.4Z"
                            fill="none" stroke="#FC6D26" strokeWidth="2" strokeLinejoin="round"
                        />
                    </svg>
                </div>
                <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-orange-500"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <h2 className="text-xl font-semibold text-gl-text mb-2">GitLab Handbook Assistant</h2>
            <p className="text-sm text-gl-subtle max-w-sm leading-relaxed mb-8">
                Ask me anything about GitLab's culture, processes, engineering practices, and more.
                I've indexed the full handbook for you.
            </p>

            <div className="w-full max-w-md grid grid-cols-1 gap-2">
                {SUGGESTIONS.map((suggestion, i) => (
                    <motion.button
                        key={suggestion}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.06 }}
                        onClick={() => onSuggestion(suggestion)}
                        className="w-full text-left px-4 py-3 rounded-xl border border-gl-border bg-gl-surface hover:border-orange-500/40 hover:bg-orange-500/5 transition-all duration-200 group"
                    >
                        <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gl-subtle group-hover:text-gl-text transition-colors duration-200">
                {suggestion}
              </span>
                            <svg className="w-3.5 h-3.5 text-gl-muted group-hover:text-orange-500 transition-colors flex-shrink-0" fill="none" viewBox="0 0 16 16">
                                <path d="M2 8h12M8 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}