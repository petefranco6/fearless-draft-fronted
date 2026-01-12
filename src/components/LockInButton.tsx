import type { Champion } from "../utils/championService.ts";

type DraftTurn = "BLUE" | "RED" | null;

interface LockInButtonProps {
    team: string;
    turn: DraftTurn;
    phase: string;
    draftUsedIds: string[];
    champion: Champion | null;

    // server timer state
    isStarted: boolean;

    // ✅ ready-check state from backend DraftState
    blueReady: boolean;
    redReady: boolean;

    // ✅ websocket toggle
    onSetReady: (ready: boolean) => void;

    // existing action
    onPick: (championId: string) => void;
}

const NONE_ID = "NONE";

export default function LockInButton({
                                         team,
                                         turn,
                                         phase,
                                         draftUsedIds,
                                         champion,
                                         isStarted,
                                         blueReady,
                                         redReady,
                                         onSetReady,
                                         onPick,
                                     }: LockInButtonProps) {
    /* --------------------------------
       READY MODE (draft not started)
    -------------------------------- */
    if (!isStarted) {
        const bothReady = blueReady && redReady;

        const myReady =
            team === "BLUE" ? blueReady : team === "RED" ? redReady : false;

        const canToggleReady = team === "BLUE" || team === "RED";

        let label = "Waiting...";
        if (team === "SPECTATOR") {
            label = bothReady ? "Starting..." : "Spectating (waiting for teams)";
        } else if (bothReady) {
            label = "Starting...";
        } else if (myReady) {
            label = "Unready";
        } else {
            label = "Ready";
        }

        const handleReadyClick = () => {
            if (!canToggleReady || bothReady || phase === "COMPLETE") return;
            onSetReady(!myReady);
        };

        const enabled = canToggleReady && !bothReady && phase !== "COMPLETE";

        return (
            <button
                onClick={handleReadyClick}
                disabled={!enabled}
                className={`
          w-full px-6 py-4 rounded-xl font-semibold uppercase tracking-wide
          transition-all duration-200 shadow-lg border
          ${
                    !enabled
                        ? "bg-neutral-800 text-neutral-500 cursor-not-allowed border-neutral-700"
                        : myReady
                            ? "bg-neutral-100 text-black hover:bg-white active:scale-95 border-white/60"
                            : "bg-emerald-500 text-black hover:bg-emerald-400 active:scale-95 border-emerald-300/70"
                }
        `}
                title={
                    team === "SPECTATOR"
                        ? "Waiting for both teams to ready up"
                        : myReady
                            ? "Click to unready"
                            : "Click to ready up"
                }
            >
                {label}
            </button>
        );
    }

    /* --------------------------------
       NORMAL PICK / BAN MODE
   -------------------------------- */
    const isMyTurn = turn === team;
    const hasChampion = champion != null;
    const isNone = champion?.id === NONE_ID;

    // Only block already-used REAL champions (NONE can repeat)
    const isUsed = hasChampion && !isNone && draftUsedIds.includes(champion!.id);

    const canLockIn = isMyTurn && hasChampion && !isUsed && phase !== "COMPLETE";

    let label: string;

    if (phase === "COMPLETE") {
        label = "Draft Complete";
    } else if (!isMyTurn) {
        label = phase === "PICK" ? "Opponent is picking" : "Opponent is banning";
    } else if (!hasChampion) {
        label = phase === "PICK" ? "Select a champion" : "Select a ban";
    } else if (isNone) {
        label = "Lock In None";
    } else {
        label = phase === "PICK" ? "Lock In Pick" : "Lock In Ban";
    }

    const handleClick = () => {
        if (!canLockIn || !champion) return;
        onPick(champion.id);
    };

    return (
        <button
            onClick={handleClick}
            disabled={!canLockIn}
            className={`
        w-full px-6 py-4 rounded-xl font-semibold uppercase tracking-wide
        transition-all duration-200 shadow-lg border
        ${
                canLockIn
                    ? isNone
                        ? "bg-neutral-100 text-black hover:bg-white active:scale-95 border-white/60"
                        : "bg-yellow-400 text-black hover:bg-yellow-300 active:scale-95 border-yellow-200/70"
                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed border-neutral-700"
            }
      `}
        >
            {label}
        </button>
    );
}
