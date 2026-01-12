import type { Champion } from "../utils/championService";
import DraftBanSlot from "./DraftBanSlot.tsx";

type Props = {
    team: "BLUE" | "RED";
    bans: (Champion | null)[];
    turn: string | null;
    phase: string;
    lastPickedChampion: string | null;
    BAN_SLOTS: number; // <-- now used
    previewChampion : Champion | null;
};

export default function BanRow({
                                      team,
                                      bans,
                                      turn,
                                      phase,
                                      lastPickedChampion,
                                      BAN_SLOTS,
                                      previewChampion
                                  }: Props) {
    return (
        <div className="flex flex-col gap-2 items-center">
            <div className="flex flex-wrap gap-3 justify-center">
                {Array.from({ length: BAN_SLOTS }).map((_, i) => {
                    const activeBanIndex =
                        phase === "BAN" && turn === team
                            ? bans.filter(Boolean).length // number of already banned champs by this team
                            : -1;
                    const champ = bans[i] ?? null;
                    const isActive = i === activeBanIndex;
                    const showPreview = isActive && !champ;

                    return (
                        <DraftBanSlot
                            key={i}
                            isActive={isActive}
                            isLastPicked={champ?.id === lastPickedChampion}
                            lockedChampion={champ}
                            previewChampion={showPreview ? previewChampion : null}

                        />
                    );
                })}
            </div>
        </div>
    );
}
