import type {Champion} from "../utils/championService";
import DraftPickSlot from "./DraftPickSlot.tsx";

type Props = {
    team: "BLUE" | "RED";
    picks: (Champion | null)[];
    turn: string | null;
    phase: string;
    lastPickedChampion: string | null;
    PICK_SLOTS: number;
    previewChampion: Champion | null;
};

export default function PicksColumn({
                                        team,
                                        picks,
                                        turn,
                                        phase,
                                        lastPickedChampion,
                                        PICK_SLOTS,
                                        previewChampion,
                                    }: Props) {
    // Determine the active pick index for this team
    const activePickIndex = phase === "PICK" ? picks.filter(Boolean).length : -1;

    return (
        <div className="h-full min-h-0">
            {/* Slots area is a fixed-height grid: prevents column (and board) from growing */}
            <div
                className="h-full min-h-0 grid gap-2"
                style={{gridTemplateRows: `repeat(${PICK_SLOTS}, minmax(0, 1fr))`}}
            >
                {Array.from({length: PICK_SLOTS}).map((_, i) => {
                    const lockedChamp = picks[i] ?? null;

                    const isActive = team === turn && phase === "PICK" && i === activePickIndex;
                    const showPreview = isActive && !lockedChamp;

                    return (
                        <div key={i} className="min-h-0">
                            <DraftPickSlot
                                team={team}
                                lockedChampion={lockedChamp}
                                previewChampion={showPreview ? previewChampion : null}
                                isActive={isActive}
                                isLastPicked={lockedChamp?.id === lastPickedChampion}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
