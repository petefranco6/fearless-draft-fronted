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
    const turnKey = `${draft.phase}-${draft.step}-${draft.turn}-${draft.turnStartedAt}`;
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const id = window.setInterval(() => setNow(Date.now()), 250);
        return () => window.clearInterval(id);
    }, []);

    const secondsLeft = useMemo(() => {
        if (!draft.turnStartedAt || !draft.turnDurationSeconds) return 0;
        const endsAt = draft.turnStartedAt + draft.turnDurationSeconds * 1000;
        return Math.max(0, Math.ceil((endsAt - now) / 1000));
    }, [draft.turnStartedAt, draft.turnDurationSeconds, now, turnKey]);

    const isUrgent = secondsLeft <= 10 && secondsLeft > 0;

    if (draft.phase === "COMPLETE") return null;

    return (
        <div
            className={`
        inline-flex items-center justify-center gap-3
        rounded-2xl border bg-neutral-950/30 px-4 py-2 shadow-sm
        ${isUrgent ? "border-red-500/40 ring-1 ring-red-500/30" : "border-neutral-800"}
        ${className}
      `}
        >
            <div className={`text-2xl font-extrabold tabular-nums ${isUrgent ? "text-red-300" : "text-white"}`}>
                {formatTime(secondsLeft)}
            </div>
        </div>
    );
}
