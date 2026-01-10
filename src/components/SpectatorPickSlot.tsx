import type { Champion } from "../utils/championService";
import { splashAdjustments } from "../utils/splashAdjustments";

interface SpectatorPickSlotProps {
    lockedChampion?: Champion | null;
    previewChampion?: Champion | null;
    team: "BLUE" | "RED";
    isLastPicked?: boolean;
    isActive?: boolean;
}

export default function SpectatorPickSlot({
                                              lockedChampion,
                                              previewChampion,
                                              team,
                                              isLastPicked = false,
                                              isActive = false
                                          }: SpectatorPickSlotProps) {

    // Decide what to show (same rule as DraftPickSlot)
    const championToShow = lockedChampion ?? previewChampion ?? null;

    const isPreview = !!previewChampion && !lockedChampion;

    const teamBg =
        team === "BLUE" ? "bg-blue-600" : "bg-red-600";

    const adj = championToShow
        ? splashAdjustments[championToShow.id] ?? {}
        : {};

    const objectPos =
        adj.xPercent !== undefined
            ? `${adj.xPercent}% 50%`
            : "50% 50%";

    const flipClass = adj.flip ? "-scale-x-100" : "";

    return (
        <div
            className={`
                relative w-44 h-80 rounded-2xl
                overflow-hidden
                transition-all duration-300
                ${isLastPicked ? "animate-slide-in-left" : ""}
                ${isActive ? "ring-4 ring-yellow-400 animate-pulse": ""}
                ${championToShow ? teamBg : "bg-gray-800"}
                ${isPreview ? "opacity-80" : ""}
            `}
        >
            {championToShow ? (
                <>
                    {/* Splash */}
                    <img
                        src={championToShow.splashUrl}
                        alt={championToShow.name}
                        className={`w-full h-full object-cover ${flipClass}`}
                        style={{ objectPosition: objectPos }}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Champion name */}
                    <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
                        <span className="block text-xl font-bold tracking-wide text-white drop-shadow-lg">
                            {championToShow.name}
                        </span>
                    </div>
                </>
            ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400 text-3xl">
                    —
                </div>
            )}
        </div>
    );
}
