import type {Champion} from "../utils/championService.ts";
import type { DraftState} from "../types/draft.ts";
import {SpectatorTeamColumn} from "./SpectatorTeamColumn.tsx";
import BanRow from "./BanRow.tsx";

interface SpectatorDraftProps {
    draft: DraftState;
    champions: Champion[];
    lastPickedChampion: string | null;
    BAN_SLOTS: number;
    PICK_SLOTS: number;
}

export default function SpectatorDraft({ draft, champions, lastPickedChampion, BAN_SLOTS, PICK_SLOTS }: SpectatorDraftProps) {

    const championMap = new Map<string, Champion>(
        champions.map(c => [c.id, c])
    )


    const getChamp = (id: string): Champion | undefined =>
        championMap.get(id);


    const blueBans: (Champion | null)[] = [];
    const redBans: (Champion | null)[] = [];


        draft.bans?.forEach((champId, index) => {
            const champ = champions.find((c) => c.id === champId) ?? null;

            if (index < 6) {
                // Phase 1 bans: BLUE, RED, BLUE, RED, BLUE, RED
                if (index % 2 === 0) {
                    blueBans.push(champ);
                } else {
                    redBans.push(champ);
                }

            } else {
                // Phase 2 bans: RED, BLUE, RED, BLUE
                if ((index - 6) % 2 === 0) {
                    redBans.push(champ);
                } else {
                    blueBans.push(champ);
                }
            }
        });


    return (
        <div className="min-h-screen bg-neutral-900 text-white p-8">

            {/* HEADER */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold tracking-wide">
                    FEARLESS DRAFT
                </h1>
                <p className="text-neutral-400 mt-2">
                    {draft.phase === "COMPLETE"
                        ? "Draft Complete"
                        : `Phase: ${draft.phase} — Turn: ${draft.turn ?? "-"}`}
                </p>
            </div>

            {/* PICKS */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-start">

                {/* BLUE */}
                <SpectatorTeamColumn
                    title="BLUE TEAM"
                    color="BLUE"
                    picks={draft.bluePicks}
                    getChampion={getChamp}
                    team={"BLUE"}
                    phase={draft.phase}
                    turn={draft.turn}
                    PICK_SLOTS={PICK_SLOTS}
                    lastPickedChampion={lastPickedChampion}
                />

                <div className="h-full w-px bg-neutral-700" />

                {/* RED */}
                <SpectatorTeamColumn
                    title="RED TEAM"
                    color="RED"
                    picks={draft.redPicks}
                    getChampion={getChamp}
                    team={"RED"}
                    phase={draft.phase}
                    turn={draft.turn}
                    PICK_SLOTS={PICK_SLOTS}
                    lastPickedChampion={lastPickedChampion}
                />
            </div>

            {/* Bans Row */}
            <div className="grid grid-cols-[1fr_1fr] gap-8">
                <BanRow
                    team="BLUE"
                    bans={blueBans}
                    turn={draft.turn}
                    phase={draft.phase}
                    lastPickedChampion={lastPickedChampion}
                    BAN_SLOTS={BAN_SLOTS}
                />
                <BanRow
                    team="RED"
                    bans={redBans}
                    turn={draft.turn}
                    phase={draft.phase}
                    lastPickedChampion={lastPickedChampion}
                    BAN_SLOTS={BAN_SLOTS}
                />
            </div>
        </div>
    );
}
