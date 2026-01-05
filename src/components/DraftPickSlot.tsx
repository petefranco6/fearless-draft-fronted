import type { Champion } from "../utils/championService";

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
        team === "BLUE" ? "bg-blue-500" : "bg-red-500";

    // Decide what to show
    const championToShow = lockedChampion ?? previewChampion ?? null;

    const isPreview = !!previewChampion && !lockedChampion;

    return (
        <div
            className={`
                h-28 w-full flex items-center justify-center rounded
                overflow-hidden
                ${championToShow ? teamBg : "bg-gray-700"}
                ${isActive ? "ring-4 ring-yellow-400 animate-pulse" : ""}
                ${isPreview ? "opacity-90" : ""}
                ${isLastPicked ? "animate-slide-in-left" : ""}
            `}
        >
            {championToShow ? (
                <img
                    src={championToShow.splashUrl}
                    alt={championToShow.name}
                    className="w-full h-full object-cover"
                />
            ) : (
                "—"
            )}
        </div>
    );
}
