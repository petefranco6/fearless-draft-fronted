import type { Champion } from "../utils/championService";

interface DraftBanSlotProps {
    lockedChampion?: Champion | null;
    previewChampion? : Champion | null;
    isActive?: boolean;
    isLastPicked?: boolean;

}

export default function DraftBanSlot({
                                         lockedChampion,
                                         isActive = false,
                                         isLastPicked = false,
                                         previewChampion
                                     }: DraftBanSlotProps) {

    const championToShow = lockedChampion ?? previewChampion ?? null;

    const isPreview = !!previewChampion && !lockedChampion;
    return (
        <div
            className={`
        h-14 w-14 flex items-center justify-center rounded
        bg-gray-600 overflow-hidden
        ${isActive ? "ring-4 ring-yellow-400 animate-pulse" : ""}
        ${isPreview ? "opacity-90" : ""}
        ${isLastPicked ? "animate-slide-in-left" : ""}
      `}
        >
            {championToShow? (
                <img
                    src={championToShow.imgUrl}
                    alt={championToShow.name}
                    className="w-full h-full object-cover grayscale"
                />
            ) : (
                "—"
            )}
        </div>
    );
}
