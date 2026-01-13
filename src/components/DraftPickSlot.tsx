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
    const teamBg = team === "BLUE" ? "bg-blue-500/15" : "bg-red-500/15";

    const championToShow = lockedChampion ?? previewChampion ?? null;
    const isPreview = !!previewChampion && !lockedChampion;

    return (
        <div
            className={`
        h-full w-full rounded-lg overflow-hidden
        border shadow-sm
        ${championToShow ? teamBg : "bg-neutral-900/40"}
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
                        className="h-full w-full object-cover"
                    />
                </div>
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                    <div className="h-10 w-10 rounded-full border border-neutral-700 bg-neutral-900/40"/>
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Empty
          </span>
                </div>
            )}
        </div>
    );
}
