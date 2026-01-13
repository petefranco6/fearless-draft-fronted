import {useEffect, useMemo, useState} from "react";
import type {DraftState} from "../types/draft";

type Props = {
    draft: DraftState;
    className?: string;
};

function formatTime(totalSeconds: number) {
    const s = Math.max(0, Math.floor(totalSeconds));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, "0")}`;
}

export default function ServerTurnTimer({draft, className = ""}: Props) {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const id = window.setInterval(() => setNow(Date.now()), 250);
        return () => window.clearInterval(id);
    }, []);

    useEffect(() => {
        console.log("TIMER DEBUG", {
            turnStartedAt: draft.turnStartedAt,
            turnDurationSeconds: draft.turnDurationSeconds,
            now: Date.now(),
        });
    }, [draft.turnStartedAt, draft.turnDurationSeconds]);


    const secondsLeft = useMemo(() => {
        const startedAt = draft.turnStartedAt;
        const duration = draft.turnDurationSeconds;

        if (!startedAt || !duration) return 0;

        const endsAt = startedAt + duration * 1000;
        return Math.max(0, Math.ceil((endsAt - now) / 1000));
    }, [draft.turnStartedAt, draft.turnDurationSeconds, now]);

    const isUrgent = secondsLeft <= 10 && secondsLeft > 0;

    if (draft.phase === "COMPLETE") return null;

    return (
        <div
            className={`
        inline-flex items-center justify-center gap-3
        rounded-2xl border bg-neutral-950/50 px-4 py-2 shadow-sm
        ${isUrgent ? "border-red-500/50 ring-2 ring-red-500/30" : "border-neutral-800/80"}
        ${className}
      `}
        >
            <div className={`text-3xl font-extrabold tabular-nums ${isUrgent ? "text-red-300" : "text-white"}`}>
                {formatTime(secondsLeft)}
            </div>
        </div>
    );
}
