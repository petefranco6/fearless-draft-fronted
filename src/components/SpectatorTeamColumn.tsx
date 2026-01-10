import type { Champion } from "../utils/championService";
import SpectatorPickSlot from "./SpectatorPickSlot";

interface TeamColumnProps {
    title: string;
    color: "BLUE" | "RED";
    picks: string[];
    getChampion: (id: string) => Champion | undefined;
    team: "BLUE" | "RED";
    phase: string;
    turn: string | null;
    PICK_SLOTS: number;
    lastPickedChampion: string | null;
    previewChampion: Champion | null;
}

export function SpectatorTeamColumn({
                                        title,
                                        color,
                                        picks,
                                        getChampion,
                                        team,
                                        phase,
                                        turn,
                                        PICK_SLOTS,
                                        lastPickedChampion,
                                        previewChampion,
                                    }: TeamColumnProps) {

    const textClass =
        color === "BLUE" ? "text-blue-400" : "text-red-400";

    // Same logic as PicksColumn
    const activePickIndex =
        phase === "PICK" ? picks.length : -1;

    return (
        <div className="space-y-8">
            {/* Team title */}
            <h2 className={`${textClass} font-extrabold text-2xl tracking-wide text-center`}>
                {title}
            </h2>

            {/* Picks */}
            <div className="flex flex-row gap-2 items-center">
                {Array.from({ length: PICK_SLOTS }).map((_, i) => {
                    const champId = picks[i];
                    const lockedChampion =
                        champId ? getChampion(champId) ?? null : null;

                    const isActive =
                        team === turn &&
                        phase === "PICK" &&
                        i === activePickIndex;

                    const showPreview =
                        isActive && !lockedChampion;

                    return (
                        <SpectatorPickSlot
                            key={i}
                            team={team}
                            lockedChampion={lockedChampion}
                            previewChampion={showPreview ? previewChampion : null}
                            isLastPicked={lockedChampion?.id === lastPickedChampion}
                            isActive={isActive}
                        />
                    );
                })}
            </div>
        </div>
    );
}
