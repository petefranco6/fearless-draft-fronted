import type { Champion } from "../utils/championService";
import DraftPickSlot from "./DraftPickSlot.tsx";

type Props = {
    team: "BLUE" | "RED";
    picks: (Champion | null)[];
    turn: string | null
    phase: string;
    lastPickedChampion: string | null;
    PICK_SLOTS: number; // <-- now used
    previewChampion : Champion | null;
};

export default function PicksColumn({
                                        team,
                                        picks,
                                        turn,
                                        phase,
                                        lastPickedChampion,
                                        PICK_SLOTS,
                                        previewChampion

                                    }: Props) {
    // Determine the active pick index for this team
    const activePickIndex =
        phase === "PICK" ? picks.filter(Boolean).length : -1;

    return (
        <div className="flex flex-col gap-2 items-center">
            <h3
                className={`text-center font-bold ${
                    team === "BLUE" ? "text-blue-400" : "text-red-400"
                }`}
            >
                {team}
            </h3>

            {Array.from({ length: PICK_SLOTS }).map((_, i) => {
                const lockedChamp = picks[i] ?? null;

                const isActive =
                    team === turn &&
                    phase === "PICK" &&
                    i === activePickIndex;

                const showPreview =
                    isActive && !lockedChamp;

                return (
                    <DraftPickSlot
                        key={i}
                        team={team}
                        lockedChampion={lockedChamp}
                        previewChampion={showPreview ? previewChampion : null}
                        isActive={isActive}
                        isLastPicked={lockedChamp?.id === lastPickedChampion}
                    />
                );
            })}

        </div>
    );
}
