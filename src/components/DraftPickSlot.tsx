import type {Champion} from "../utils/championService";

interface DraftPickSlotProps {
    lockedChampion?: Champion | null;
    previewChampion?: Champion | null;
    team: "BLUE" | "RED";
    isActive?: boolean;
    isLastPicked?: boolean;
}

export default function DraftPickSlot({
                                          lockedChampion,
                                          previewChampion,
                                          team,
                                          isActive = false,
                                          isLastPicked = false,
                                      }: DraftPickSlotProps) {

    const teamBg =
        team === "BLUE" ? "bg-blue-500/20" : "bg-red-500/20";

    // Decide what to show
    const championToShow = lockedChampion ?? previewChampion ?? null;

    const isPreview = !!previewChampion && !lockedChampion;

    return (
        <div
            className={`
                h-32 w-full flex items-center justify-center rounded-xl
                overflow-hidden border shadow-sm
                ${championToShow ? teamBg : "bg-neutral-800/60"}
                ${championToShow ? "border-neutral-700" : "border-neutral-800"}
                ${isActive ? "ring-2 ring-yellow-300/80 shadow-lg" : ""}
                ${isPreview ? "opacity-90" : ""}
                ${isLastPicked ? "animate-slide-in-left" : ""}
            `}
        >
            {championToShow ? (
                <div className="relative h-full w-full">
                    <img
                        src={championToShow.splashUrl}
                        alt={championToShow.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 text-xs font-semibold tracking-wide text-white drop-shadow">
                        {championToShow.name}
                    </div>
                </div>
            ) : (
                <span className="text-sm font-semibold text-neutral-500">Empty</span>
            )}
        </div>
    );
}
