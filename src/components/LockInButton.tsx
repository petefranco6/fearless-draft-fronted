import type { Champion } from "../utils/championService.ts";

interface LockInButtonProps {
    team: string; // "BLUE" | "RED"
    turn: "BLUE" | "RED" | null;
    phase: string; // "PICK" | "BAN" | "COMPLETE"
    draftUsedIds: string[];
    champion: Champion | null;
    onPick: (championId: string) => void;
}

const NONE_ID = "NONE";

export default function LockInButton({
                                         team,
                                         turn,
                                         phase,
                                         draftUsedIds,
                                         champion,
                                         onPick,
                                     }: LockInButtonProps) {
    const isMyTurn = turn === team;
    const hasChampion = champion != null;

    const isNone = champion?.id === NONE_ID;

    // ✅ Only enforce "already used" for real champions.
    // NONE can be locked in multiple times.
    const isUsed = hasChampion && !isNone && draftUsedIds.includes(champion!.id);

    const canLockIn = isMyTurn && hasChampion && !isUsed;

    let label: string;

    if (!isMyTurn) {
        label = phase === "PICK" ? "Opponent is picking" : "Opponent is banning";
    } else if (!hasChampion) {
        label = phase === "PICK" ? "Select a champion" : "Select a ban";
    } else if (isNone) {
        label = phase === "PICK" ? "Lock In None" : "Lock In None";
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
        px-10 py-4 rounded-xl font-bold uppercase tracking-wide
        transition-all duration-200 shadow-lg
        ${
                canLockIn
                    ? isNone
                        ? "bg-neutral-200 text-black hover:bg-neutral-100 active:scale-95"
                        : "bg-yellow-500 text-black hover:bg-yellow-400 active:scale-95"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }
      `}
            title={isNone ? "Submit no selection for this turn" : undefined}
        >
            {label}
        </button>
    );
}
