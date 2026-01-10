import { useEffect, useMemo, useRef, useState } from "react";

type DraftTimerProps = {
    /** Change when the server advances to a new pick/ban */
    turnKey: string | number;

    /** Seconds per pick/ban */
    secondsPerTurn: number;

    /** Auto-start on mount (each new turn) */
    autoStart?: boolean;

    /** Called once when time hits 0 */
    onExpire?: () => void;

    label?: string;
    className?: string;
};

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

function formatTime(totalSeconds: number) {
    const s = clamp(Math.floor(totalSeconds), 0, 60 * 60);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, "0")}`;
}

/**
 * Wrapper component: resets the timer by remounting the inner timer.
 * This avoids "reset state in useEffect" patterns entirely.
 */
export default function DraftTimer(props: DraftTimerProps) {
    return <InnerTimer key={props.turnKey} {...props} />;
}

function InnerTimer({
                        secondsPerTurn,
                        autoStart = true,
                        onExpire,
                        label = "Turn Timer",
                        className = "",
                    }: Omit<DraftTimerProps, "turnKey">) {
    const initialSeconds = useMemo(
        () => clamp(secondsPerTurn, 0, 60 * 60),
        [secondsPerTurn]
    );

    const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
    const [isRunning, setIsRunning] = useState<boolean>(autoStart);

    const intervalRef = useRef<number | null>(null);
    const expiredRef = useRef(false);
    const onExpireRef = useRef(onExpire);

    // keep latest callback (no interval restart)
    useEffect(() => {
        onExpireRef.current = onExpire;
    }, [onExpire]);

    // tick loop: starts/stops cleanly; no reset logic here
    useEffect(() => {
        // always clear existing interval before starting a new one
        if (intervalRef.current != null) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (!isRunning || secondsLeft <= 0) return;

        intervalRef.current = window.setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    if (!expiredRef.current) {
                        expiredRef.current = true;
                        onExpireRef.current?.();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current != null) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isRunning, secondsLeft]);

    const pct = useMemo(() => {
        if (initialSeconds <= 0) return 0;
        return (secondsLeft / initialSeconds) * 100;
    }, [secondsLeft, initialSeconds]);

    const isUrgent = secondsLeft <= 10 && secondsLeft > 0;

    const resetLocal = () => {
        expiredRef.current = false;
        setSecondsLeft(initialSeconds);
        setIsRunning(autoStart);
    };

    return (
        <div
            className={`w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-4 shadow-lg ${className}`}
        >
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                    <div className="text-sm font-medium text-neutral-300">{label}</div>
                    <div
                        className={`text-3xl font-bold ${
                            isUrgent ? "text-red-400" : "text-white"
                        }`}
                    >
                        {formatTime(secondsLeft)}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setIsRunning((r) => !r)}
                        className="rounded-xl px-3 py-2 text-sm font-semibold bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
                    >
                        {isRunning ? "Pause" : "Start"}
                    </button>

                    <button
                        onClick={resetLocal}
                        className="rounded-xl px-3 py-2 text-sm font-semibold bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>

            <div className="mt-4 h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all ${
                        isUrgent ? "bg-red-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${pct}%` }}
                />
            </div>

            <div className="mt-2 flex justify-between text-xs text-neutral-500">
                <span>{isRunning ? "Running" : secondsLeft === 0 ? "Expired" : "Paused"}</span>
                <span>{initialSeconds}s per turn</span>
            </div>
        </div>
    );
}
