interface LockInButtonProps {
    team: string;
    turn: "BLUE" | "RED" | null;
    phase: string;
    draftUsedIds: string[];
    champion: string | null;
    onPick: (championId: string) => void;
}


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
    const isUsed = hasChampion && draftUsedIds.includes(champion);

    const canLockIn =
        isMyTurn &&
        hasChampion &&
        !isUsed;

    let label: string;

    if (!isMyTurn) {
        label = phase === "PICK"
            ? "Opponent is picking"
            : "Opponent is banning";
    } else if (!hasChampion) {
        label = phase === "PICK"
            ? "Select a champion"
            : "Select a ban";
    } else {
        label = phase === "PICK"
            ? "Lock In Pick"
            : "Lock In Ban";
    }

    const handleClick = () => {
        if (!canLockIn || !champion) return;
        onPick(champion);
    };

    return (
        <button
            onClick={handleClick}
            disabled={!canLockIn}
            className={`
                px-10 py-4 rounded-xl font-bold uppercase tracking-wide
                transition-all duration-200
                shadow-lg
                ${
                canLockIn
                    ? "bg-yellow-500 text-black hover:bg-yellow-400 active:scale-95"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }
            `}
        >
            {label}
        </button>
    );
}
