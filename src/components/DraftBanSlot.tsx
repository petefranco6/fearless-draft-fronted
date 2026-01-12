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
        h-14 w-14 flex items-center justify-center rounded-lg
        bg-neutral-800/70 border border-neutral-700 overflow-hidden shadow-sm
        ${isActive ? "ring-2 ring-yellow-300/80 shadow-md" : ""}
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
                <span className="text-xs font-semibold text-neutral-500">—</span>
            )}
        </div>
    );
}
