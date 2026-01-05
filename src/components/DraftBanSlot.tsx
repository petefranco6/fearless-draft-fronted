import type { Champion } from "../utils/championService";

interface DraftBanSlotProps {
    champion?: Champion | null;
    isActive?: boolean;
    isLastPicked?: boolean;
}

export default function DraftBanSlot({
                                         champion,
                                         isActive = false,
                                         isLastPicked = false,
                                     }: DraftBanSlotProps) {
    return (
        <div
            className={`
        h-14 w-14 flex items-center justify-center rounded
        bg-gray-600 overflow-hidden
        ${isActive ? "ring-4 ring-yellow-400 animate-pulse" : ""}
        ${isLastPicked ? "animate-slide-in-left" : ""}
      `}
        >
            {champion ? (
                <img
                    src={champion.imgUrl}
                    alt={champion.name}
                    className="w-full h-full object-cover grayscale"
                />
            ) : (
                "—"
            )}
        </div>
    );
}
