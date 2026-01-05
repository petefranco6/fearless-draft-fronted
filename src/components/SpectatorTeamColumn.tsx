import type { Champion } from "../utils/championService";
//import {splashAdjustments} from "../utils/splashAdjustments.ts";
import SpectatorPickSlot from "./SpectatorPickSlot.tsx";

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

}

export function SpectatorTeamColumn({
                                        title,
                                        color,
                                        picks,
                                        getChampion,
                                        team,
                                        turn,
                                        phase,
                                        PICK_SLOTS,
                                        lastPickedChampion
                                    }: TeamColumnProps) {



    const textClass =
        color === "BLUE" ? "text-blue-400" : "text-red-400";

    return (
        <div className="space-y-8">
            {/* Team title */}
            <h2
                className={`${textClass} font-extrabold text-2xl tracking-wide text-center`}
            >
                {title}
            </h2>

            {/* Picks */}
            <div className="flex flex-row gap-2 items-center">
                {Array.from({ length: PICK_SLOTS }).map((_, i) => {
                    const activePickIndex =
                        phase === "PICK" && turn === team
                            ? picks.length
                            : -1;

                    const champId = picks[i];
                    const champ = champId ? getChampion(champId) : undefined;

                    const isActive = i === activePickIndex;

                    if (!champ) {
                        // Empty slot (future pick)
                        return (
                            <div
                                key={i}
                                className={`w-44 h-80 rounded-2xl bg-neutral-800 border border-neutral-700
                                ${isActive ? "ring-4 ring-yellow-400 animate-pulse" : ""}
                                `}
                            />
                        );
                    }

                    return (
                        <SpectatorPickSlot
                            key={i}
                            champion={champ}
                            team={team}
                            isLastPicked={champ?.id === lastPickedChampion}
                        />
                    );
                })}
            </div>
        </div>
    );
}
