import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { spawn } from "child_process";
import * as path from "node:path";

let backendProcess: ReturnType<typeof spawn> | null = null;

export default defineConfig({
    plugins: [
        react(),
        {
            name: "start-backend",
            configureServer() {
                if (backendProcess) return;

                console.log("\n🦊 Starting GitLab Handbook backend...\n");

                backendProcess = spawn("npx", ["tsx", "server.ts"], {
                    cwd: path.resolve(__dirname, "../backend"),
                    stdio: "inherit",
                    shell: true,
                });

                backendProcess.on("error", (err) => {
                    console.error("Backend failed to start:", err);
                });

                process.on("exit", () => {
                    backendProcess?.kill();
                });
            },
        },
    ],
    server: {
        port: 5173,
        proxy: {
            "/chat": "http://localhost:3001",
            "/health": "http://localhost:3001",
            "/progress": "http://localhost:3001"
        },
    },
});