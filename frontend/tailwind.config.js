/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                mono: ["'JetBrains Mono'", "monospace"],
                sans: ["'DM Sans'", "sans-serif"],
            },
            colors: {
                gl: {
                    orange: "#FC6D26",
                    dark: "#0D0D0F",
                    surface: "#141416",
                    elevated: "#1C1C20",
                    border: "#2A2A30",
                    muted: "#52525E",
                    text: "#E8E8ED",
                    subtle: "#9898A6",
                },
            },
            animation: {
                "fade-up": "fadeUp 0.4s ease forwards",
                "fade-in": "fadeIn 0.3s ease forwards",
                pulse2: "pulse2 1.5s ease-in-out infinite",
            },
            keyframes: {
                fadeUp: {
                    "0%": { opacity: "0", transform: "translateY(12px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                pulse2: {
                    "0%, 100%": { opacity: "0.4" },
                    "50%": { opacity: "1" },
                },
            },
        },
    },
    plugins: [],
};