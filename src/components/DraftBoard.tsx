import type {DraftState} from "../types/draft";
import type {Champion} from "../utils/championService";
import PicksColumn from "./PicksColumn";
import BanRow from "./BanRow";
import AvailableChampionsGrid from "./AvailableChampionsGrid";
import LockInButton from "./LockInButton";
import {buildDraftSteps} from "../utils/draftOrder.ts";
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
    isStarted: boolean;
    onSetReady: (ready: boolean) => void;
    onNextGame?: () => void;
};

const NONE_ID = "NONE";

const NONE_CHAMPION: Champion = {
    id: NONE_ID,
    name: "None",
    imgUrl: noneIcon,
    splashUrl: noneSplash,
    roles: [],
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
                                       isStarted,
                                       onSetReady,
                                       onNextGame,
                                   }: Props) {
    const champMap = new Map<string, Champion>(champions.map((c) => [c.id, c]));

    const resolveChampion = (id: string | null | undefined): Champion | null => {
        if (!id) return null;
        if (id === NONE_ID) return NONE_CHAMPION;
        return champMap.get(id) ?? null;
    };

    // used THIS GAME only
    const draftUsedIds = [...draft.bluePicks, ...draft.redPicks, ...draft.bans];

    // fearless locks from previous games
    const fearlessLockedIds = draft.lockedChampionIds ?? [];

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

    // Ready indicator dots
    const blueDotClass = isStarted
        ? "bg-blue-500"
        : draft.blueReady
            ? "bg-emerald-400 ring-2 ring-emerald-300/40"
            : "bg-blue-500/70";

    const redDotClass = isStarted
        ? "bg-red-500"
        : draft.redReady
            ? "bg-emerald-400 ring-2 ring-emerald-300/40"
            : "bg-red-500/70";

    const modeChip =
        draft.mode === "FEARLESS_SERIES" ? (
            <span className="inline-flex items-center gap-2">
                <span className="text-neutral-600">•</span>
                <span
                    className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-0.5 text-emerald-200 font-semibold">
                    Fearless
                </span>
                <span className="text-neutral-300">Game {draft.gameNumber}</span>
      </span>
        ) : (
            ""
        );

    const statusChip = (() => {
        if (draft.phase === "COMPLETE") {
            return (
                <span
                    className="rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-neutral-200 font-semibold">
        Draft Complete
      </span>
            );
        }

        const isBlue = draft.turn === "BLUE";
        const isPick = draft.phase === "PICK";

        const base =
            "inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold uppercase tracking-wide";

        if (isBlue && isPick)
            return (
                <span className={`${base} border border-blue-400/40 bg-blue-500/10 text-blue-200`}>
        <span className="h-2 w-2 rounded-full bg-blue-400"/>
        Blue Pick
      </span>
            );

        if (isBlue && !isPick)
            return (
                <span className={`${base} border border-blue-400/40 bg-blue-500/10 text-blue-200`}>
        <span className="h-2 w-2 rounded-full bg-blue-400"/>
        Blue Ban
      </span>
            );

        if (!isBlue && isPick)
            return (
                <span className={`${base} border border-red-400/40 bg-red-500/10 text-red-200`}>
        <span className="h-2 w-2 rounded-full bg-red-400"/>
        Red Pick
      </span>
            );

        return (
            <span className={`${base} border border-red-400/40 bg-red-500/10 text-red-200`}>
      <span className="h-2 w-2 rounded-full bg-red-400"/>
      Red Ban
    </span>
        );
    })();


    return (
        <div className="h-screen w-full bg-neutral-950 text-white overflow-hidden">
            {/* HEADER */}
            <div className="h-24 px-6 flex items-center justify-between border-b border-neutral-800/80 bg-neutral-900/80 backdrop-blur">
                {/* BLUE */}
                <div className="flex items-center gap-3 min-w-0">
                    <span className={`h-3 w-3 rounded-full shadow ${blueDotClass}`}/>
                    <div className="min-w-0">
                        <div className="truncate text-lg font-semibold">{draft.blueTeamName}</div>
                        {!isStarted && (
                            <div className={`text-xs ${draft.blueReady ? "text-emerald-300" : "text-neutral-400"}`}>
                                {draft.blueReady ? "Ready" : "Not ready"}
                            </div>
                        )}
                    </div>
                </div>

                {/* CENTER STATUS */}
                <div className="flex flex-col items-center gap-2">
                    <ServerTurnTimer draft={draft} className="max-w-65"/>
                    <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
                        {statusChip}
                        {modeChip}
                    </div>

                </div>

                {/* RED */}
                <div className="flex items-center gap-3 min-w-0 justify-end">
                    <div className="min-w-0 text-right">
                        <div className="truncate text-lg font-semibold">{draft.redTeamName}</div>
                        {!isStarted && (
                            <div className={`text-xs ${draft.redReady ? "text-emerald-300" : "text-neutral-400"}`}>
                                {draft.redReady ? "Ready" : "Not ready"}
                            </div>
                        )}
                    </div>
                    <span className={`h-3 w-3 rounded-full shadow ${redDotClass}`}/>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="h-[calc(100vh-96px)] grid grid-rows-[minmax(0,1fr)_auto] gap-4 p-4">
                {/* PICKS + GRID */}
                <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 h-full min-h-0">
                    <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-3 shadow-lg">
                        <PicksColumn
                            team="BLUE"
                            picks={bluePicks}
                            previewChampion={bluePreview}
                            turn={draft.turn}
                            phase={draft.phase}
                            lastPickedChampion={draft.lastPickedChampion}
                            PICK_SLOTS={PICK_SLOTS}
                        />
                    </div>

                    <div className="h-full min-h-0 rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-3 shadow-lg">
                        <AvailableChampionsGrid
                            champions={champions}
                            draftUsedIds={draftUsedIds}
                            fearlessLockedIds={fearlessLockedIds}
                            onSelect={onSelect}
                        />
                    </div>

                    <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-3 shadow-lg">
                        <PicksColumn
                            team="RED"
                            picks={redPicks}
                            previewChampion={redPreview}
                            turn={draft.turn}
                            phase={draft.phase}
                            lastPickedChampion={draft.lastPickedChampion}
                            PICK_SLOTS={PICK_SLOTS}
                        />
                    </div>
                </div>

                {/* BANS + ACTION */}
                <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
                    <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-3 shadow-lg">
                        <BanRow
                            team="BLUE"
                            bans={blueBans}
                            turn={draft.turn}
                            phase={draft.phase}
                            lastPickedChampion={lastPickedChampion}
                            BAN_SLOTS={BAN_SLOTS}
                            previewChampion={bluePreview}
                        />
                    </div>

                    {/* ACTION PANEL */}
                    <div className="w-65 flex flex-col justify-center rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-3 shadow-lg">
                        <LockInButton
                            team={role}
                            turn={draft.turn}
                            phase={draft.phase}
                            draftUsedIds={draftUsedIds}
                            champion={activePreview}
                            onPick={onPick}
                            isStarted={isStarted}
                            blueReady={draft.blueReady}
                            redReady={draft.redReady}
                            onSetReady={onSetReady}
                        />
                        {draft.mode === "FEARLESS_SERIES" && draft.phase === "COMPLETE" && draft.seriesId && (
                            <button
                                onClick={onNextGame}
                                className="mt-3 w-full px-4 py-2 rounded-xl font-semibold uppercase tracking-wide bg-emerald-500/90 text-black hover:bg-emerald-400 active:scale-[0.98] transition"
                            >
                                Next Game
                            </button>
                        )}
                    </div>

                    <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-3 shadow-lg">
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
        </div>
    );
}
