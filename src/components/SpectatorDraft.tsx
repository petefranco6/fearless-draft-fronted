import type { Champion } from "../utils/championService";
import type { DraftState } from "../types/draft";
import { SpectatorTeamColumn } from "./SpectatorTeamColumn";
import BanRow from "./BanRow";
import { buildDraftSteps } from "../utils/draftOrder";

interface SpectatorDraftProps {
    draft: DraftState;
    champions: Champion[];
    lastPickedChampion?: string | null;
    PICK_SLOTS: number;
    BAN_SLOTS: number;
}

export default function SpectatorDraft({
                                           draft,
                                           champions,
                                           lastPickedChampion = null,
                                           PICK_SLOTS,
                                           BAN_SLOTS,
                                       }: SpectatorDraftProps) {
    // Fast lookup
    const champMap = new Map<string, Champion>(champions.map((c) => [c.id, c]));
    const getChamp = (id: string) => champMap.get(id);

    // Previews (if spectator shows them)
    const bluePreview = draft.previews?.BLUE ? getChamp(draft.previews.BLUE) ?? null : null;
    const redPreview = draft.previews?.RED ? getChamp(draft.previews.RED) ?? null : null;

    /**
     * ✅ Correct ban splitting for spectator:
     * - Build steps from firstPickTeam
     * - Extract BAN steps
     * - Map bans[banIndex] → banSteps[banIndex].turn
     */
    const steps = buildDraftSteps(draft.firstPickTeam);
    const banSteps = steps.filter((s) => s.phase === "BAN");

    const blueBans: (Champion | null)[] = [];
    const redBans: (Champion | null)[] = [];

    draft.bans.forEach((champId, banIndex) => {
        const stepForThisBan = banSteps[banIndex];
        const champ = getChamp(champId) ?? null;

        if (!stepForThisBan) return; // safety
        if (stepForThisBan.turn === "BLUE") blueBans.push(champ);
        else redBans.push(champ);
    });

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-4 sm:p-8">
            {/* HEADER */}
            <div className="text-center mb-8 sm:mb-10">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide">FEARLESS DRAFT</h1>
                <p className="text-neutral-400 mt-2">
                    {draft.phase === "COMPLETE"
                        ? "Draft Complete"
                        : `Phase: ${draft.phase} — Turn: ${draft.turn ?? "-"}`}
                </p>
            </div>

            {/* PICKS */}
            <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-[1fr_auto_1fr]">
                <SpectatorTeamColumn
                    title={draft.blueTeamName ?? "BLUE TEAM"}
                    color="BLUE"
                    team="BLUE"
                    picks={draft.bluePicks}
                    getChampion={(id) => getChamp(id)}
                    turn={draft.turn}
                    phase={draft.phase}
                    PICK_SLOTS={PICK_SLOTS}
                    lastPickedChampion={draft.lastPickedChampion ?? lastPickedChampion}
                    previewChampion={bluePreview}
                />

                <div className="hidden h-full w-px bg-neutral-700 lg:block" />

                <SpectatorTeamColumn
                    title={draft.redTeamName ?? "RED TEAM"}
                    color="RED"
                    team="RED"
                    picks={draft.redPicks}
                    getChampion={(id) => getChamp(id)}
                    turn={draft.turn}
                    phase={draft.phase}
                    PICK_SLOTS={PICK_SLOTS}
                    lastPickedChampion={draft.lastPickedChampion ?? lastPickedChampion}
                    previewChampion={redPreview}
                />
            </div>

            {/* BANS */}
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8">
                <div className="rounded-2xl bg-blue-950/30 p-4 ring-1 ring-blue-500/20">
                    <BanRow
                        team="BLUE"
                        bans={blueBans}
                        turn={draft.turn}
                        phase={draft.phase}
                        lastPickedChampion={draft.lastPickedChampion ?? lastPickedChampion}
                        BAN_SLOTS={BAN_SLOTS}
                        previewChampion={redPreview}
                    />
                </div>

                <div className="rounded-2xl bg-red-950/30 p-4 ring-1 ring-red-500/20">
                    <BanRow
                        team="RED"
                        bans={redBans}
                        turn={draft.turn}
                        phase={draft.phase}
                        lastPickedChampion={draft.lastPickedChampion ?? lastPickedChampion}
                        BAN_SLOTS={BAN_SLOTS}
                        previewChampion={bluePreview}
                    />
                </div>
            </div>
        </div>
    );
}
