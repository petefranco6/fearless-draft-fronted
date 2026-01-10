import { useEffect, useMemo, useState } from "react";
import type { DraftState } from "../types/draft";

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

export default function ServerTurnTimer({ draft, className = "" }: Props) {
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

    const pct = useMemo(() => {
        if (!draft.turnDurationSeconds) return 0;
        return (secondsLeft / draft.turnDurationSeconds) * 100;
    }, [secondsLeft, draft.turnDurationSeconds]);

    const isUrgent = secondsLeft <= 10 && secondsLeft > 0;

    if (draft.phase === "COMPLETE") return null;

    return (
        <div className={`w-full rounded-2xl border border-neutral-800 bg-neutral-900 p-4 shadow-lg ${className}`}>
            <div className="flex items-center justify-between">
                <div>
                    <div className={`text-3xl font-bold ${isUrgent ? "text-red-400" : "text-white"}`}>
                        {formatTime(secondsLeft)}
                    </div>
                </div>
            </div>

            <div className="mt-4 h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all ${isUrgent ? "bg-red-500" : "bg-blue-500"}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}
