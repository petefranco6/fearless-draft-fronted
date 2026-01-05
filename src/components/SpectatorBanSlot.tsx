import type { Champion } from "../utils/championService";

interface SpectatorBanSlotProps {
    champion: Champion;
}

export default function SpectatorBanSlot({ champion }: SpectatorBanSlotProps) {
    return (
        <div className="w-36 h-56 rounded-xl overflow-hidden opacity-60">
            <img
                src={champion.splashUrl}
                alt={champion.name}
                className="w-full h-full object-cover grayscale"
            />
        </div>
    );
}
