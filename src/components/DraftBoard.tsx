import type { DraftState } from "../types/draft";
import type { Champion } from "../utils/championService";
import PicksColumn from "./PicksColumn";
import BanRow from "./BanRow";
import AvailableChampionsGrid from "./AvailableChampionsGrid";
import LockInButton from "./LockInButton";
import { buildDraftSteps } from "../utils/draftOrder.ts";
import ServerTurnTimer from "./ServerTurnTimer.tsx";
import noneIcon from "../assets/draft/none-champion.svg";
import noneSplash from "../assets/draft/none-champion-splash.svg";

type Props = {
    draft: DraftState;
    champions: Champion[];
    onPick: (championId: string) => void;
    onSelect: (championId: string) => void;
    PICK_SLOTS: number;
    BAN_SLOTS: number;
    role: string;
    lastPickedChampion?: string | null;
};

const NONE_ID = "NONE";

/**
 * NOTE: Public URL assets must exist on your frontend dev server.
 * If you still can't access /assets/... in the browser, move these svgs under src/assets
 * and import them instead.
 */
const NONE_CHAMPION: Champion = {
    id: NONE_ID,
    name: "None",
    imgUrl: noneIcon,
    splashUrl: noneSplash,
};

export default function DraftBoard({
                                       draft,
                                       champions,
                                       onPick,
                                       onSelect,
                                       PICK_SLOTS,
                                       BAN_SLOTS,
                                       role,
                                       lastPickedChampion = null,
                                   }: Props) {
    const champMap = new Map<string, Champion>(champions.map((c) => [c.id, c]));

    const resolveChampion = (id: string | null | undefined): Champion | null => {
        if (!id) return null;
        if (id === NONE_ID) return NONE_CHAMPION;
        return champMap.get(id) ?? null;
    };

    const draftUsedIds = [...draft.bluePicks, ...draft.redPicks, ...draft.bans];

    const bluePicks = draft.bluePicks.map(resolveChampion);
    const redPicks = draft.redPicks.map(resolveChampion);

    const bluePreview = resolveChampion(draft.previews?.BLUE);
    const redPreview = resolveChampion(draft.previews?.RED);

    const activePreview =
        draft.turn === "BLUE" ? bluePreview : draft.turn === "RED" ? redPreview : null;

    const steps = buildDraftSteps(draft.firstPickTeam);
    const banSteps = steps.filter((s) => s.phase === "BAN");

    const blueBans: (Champion | null)[] = [];
    const redBans: (Champion | null)[] = [];

    draft.bans.forEach((id, i) => {
        const step = banSteps[i];
        if (!step) return;
        (step.turn === "BLUE" ? blueBans : redBans).push(resolveChampion(id));
    });

    return (
        <div className="h-screen w-full bg-neutral-950 text-white overflow-hidden">
            {/* HEADER */}
            <div className="h-[96px] px-4 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/60">
                <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-lg font-semibold">{draft.blueTeamName}</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <ServerTurnTimer draft={draft} />
                    <div className="text-xs text-neutral-400">
                        {draft.phase} • Step {draft.step}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold">{draft.redTeamName}</span>
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="h-[calc(100vh-96px)] grid grid-rows-[1fr_auto] gap-3 p-3">
                {/* PICKS + GRID */}
                <div className="grid grid-cols-[1fr_2fr_1fr] gap-3 h-full">
                    <PicksColumn
                        team="BLUE"
                        picks={bluePicks}
                        previewChampion={bluePreview}
                        turn={draft.turn}
                        phase={draft.phase}
                        lastPickedChampion={draft.lastPickedChampion}
                        PICK_SLOTS={PICK_SLOTS}
                        teamName={draft.blueTeamName}
                    />

                    <div className="h-full rounded-xl border border-neutral-800 bg-neutral-900/40 p-2">
                        <AvailableChampionsGrid
                            champions={champions}
                            draftUsedIds={draftUsedIds}
                            onSelect={onSelect}
                        />
                    </div>

                    <PicksColumn
                        team="RED"
                        picks={redPicks}
                        previewChampion={redPreview}
                        turn={draft.turn}
                        phase={draft.phase}
                        lastPickedChampion={draft.lastPickedChampion}
                        PICK_SLOTS={PICK_SLOTS}
                        teamName={draft.redTeamName}
                    />
                </div>

                {/* BANS + ACTION */}
                <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                    <BanRow
                        team="BLUE"
                        bans={blueBans}
                        turn={draft.turn}
                        phase={draft.phase}
                        lastPickedChampion={lastPickedChampion}
                        BAN_SLOTS={BAN_SLOTS}
                        previewChampion={bluePreview}
                    />

                    <div className="flex flex-col items-center gap-2 px-4">
                        <div className="text-xs text-neutral-400">Current Selection</div>
                        <div className="text-sm font-semibold">
                            {activePreview?.name ?? "None"}
                        </div>
                        <LockInButton
                            team={role}
                            turn={draft.turn}
                            phase={draft.phase}
                            draftUsedIds={draftUsedIds}
                            champion={activePreview}
                            onPick={onPick}
                        />
                    </div>

                    <BanRow
                        team="RED"
                        bans={redBans}
                        turn={draft.turn}
                        phase={draft.phase}
                        lastPickedChampion={lastPickedChampion}
                        BAN_SLOTS={BAN_SLOTS}
                        previewChampion={redPreview}
                    />
                </div>
            </div>
        </div>
    );
}

