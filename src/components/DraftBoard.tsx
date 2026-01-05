import type { DraftState } from "../types/draft";
import type { Champion } from "../utils/championService";
import PicksColumn from "./PicksColumn";
import BanRow from "./BanRow.tsx";
import AvailableChampionsGrid from "./AvailableChampionsGrid";
import LockInButton from "./LockInButton.tsx";

type Props = {
    draft: DraftState;
    champions: Champion[];
    onPick: (championId: string) => void;
    onSelect: (championId: string) => void;
    PICK_SLOTS: number;
    BAN_SLOTS: number;
    lastPickedChampion: string | null;
    selectedChampion: string | null;
    role: string;
};

export default function DraftBoard({
                                       draft,
                                       champions,
                                       onPick,
                                       onSelect,
                                       PICK_SLOTS,
                                       BAN_SLOTS,
                                       lastPickedChampion,
                                       selectedChampion,
                                       role
                                   }: Props) {
    // Combine all used champion IDs
    const draftUsedIds: string[] = [
        ...draft.bluePicks,
        ...draft.redPicks,
        ...draft.bans,
    ];

    // Helper: map pick IDs to Champion objects
    const mapIdsToChampions = (ids: string[]): (Champion | null)[] =>
        ids.map((id) => champions.find((c) => c.id === id) ?? null);

    const bluePicks = mapIdsToChampions(draft.bluePicks);
    const redPicks = mapIdsToChampions(draft.redPicks);

    const bluePreview =
        draft.previews.BLUE
            ? champions.find(c => c.id === draft.previews.BLUE) ?? null
            : null;

    const redPreview =
        draft.previews.RED
            ? champions.find(c => c.id === draft.previews.RED) ?? null
            : null;


    // Split bans into BLUE and RED
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
        <div className="grid grid-rows-[auto_auto] gap-5">
            {/* Picks Section */}
            <div className="rounded-2xl bg-neutral-900/80 shadow-xl p-4">
                <div className="grid grid-cols-[minmax(280px,1fr)_2fr_minmax(280px,1fr)] gap-6">
                    <div className="rounded-xl bg-black/40 p-4 ring-1 ring-white/5">
                        <PicksColumn
                            team="BLUE"
                            picks={bluePicks}
                            turn={draft.turn}
                            phase={draft.phase}
                            lastPickedChampion={draft.lastPickedChampion}
                            PICK_SLOTS={PICK_SLOTS}
                            previewChampion={bluePreview}
                        />
                    </div>

                    <AvailableChampionsGrid
                        champions={champions}
                        draftUsedIds={draftUsedIds}
                        onSelect={onSelect}
                    />

                    <div className="rounded-xl bg-black/40 p-4 ring-1 ring-white/5">
                        <PicksColumn
                            team="RED"
                            picks={redPicks}
                            turn={draft.turn}
                            phase={draft.phase}
                            lastPickedChampion={draft.lastPickedChampion}
                            PICK_SLOTS={PICK_SLOTS}
                            previewChampion={redPreview}
                        />
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

            {/* Bans + Lock In */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-12">
                <div className="rounded-xl bg-blue-950/40 p-4 shadow-lg ring-1 ring-blue-500/20">
                    <BanRow
                        team="BLUE"
                        bans={blueBans}
                        turn={draft.turn}
                        phase={draft.phase}
                        lastPickedChampion={lastPickedChampion}
                        BAN_SLOTS={BAN_SLOTS}
                    />
                </div>

                <LockInButton
                    draftUsedIds={draftUsedIds}
                    onPick={onPick}
                    champion={selectedChampion}
                    phase={draft.phase}
                    turn={draft.turn}
                    team={role}
                />

                <div className="rounded-xl bg-red-950/40 p-4 shadow-lg ring-1 ring-red-500/20">
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
        </div>
    );
}
