import { useEffect, useRef, useState } from "react";
import { checkHealth } from "../api";

export function useBackendReady(enabled: boolean) {
    const [isReady, setIsReady] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!enabled) return;

        const poll = async () => {
            const ready = await checkHealth();
            if (ready) {
                setIsReady(true);
                if (intervalRef.current) clearInterval(intervalRef.current);
            }
        };

        poll();
        intervalRef.current = setInterval(poll, 3000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [enabled]);

    return isReady;
}