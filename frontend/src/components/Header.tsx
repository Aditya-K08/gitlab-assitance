export default function Header() {
    return (
        <header className="flex-shrink-0 h-14 flex items-center border-b border-gl-border px-5 gap-3">
            <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 36 36" fill="none" className="w-6 h-6">
                    <path
                        d="M2 26.4L18 4L34 26.4L26.7 32L18 22L9.3 32L2 26.4Z"
                        fill="none" stroke="#FC6D26" strokeWidth="2.5" strokeLinejoin="round"
                    />
                </svg>
            </div>
            <div className="flex-1 min-w-0">
                <h1 className="text-sm font-semibold text-gl-text leading-none">
                    GitLab Handbook Assistant
                </h1>
                <p className="text-xs text-gl-muted mt-0.5">Ask anything about the GitLab Handbook</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gl-elevated border border-gl-border text-xs text-gl-subtle font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Ready</span>
            </div>
        </header>
    );
}