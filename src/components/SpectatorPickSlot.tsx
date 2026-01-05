import type { Champion } from "../utils/championService";
import { splashAdjustments } from "../utils/splashAdjustments";

interface SpectatorPickSlotProps {
    champion: Champion;
    team: "BLUE" | "RED";
    isLastPicked?: boolean;   // animate on pick
}

export default function SpectatorPickSlot({
                                              champion,
                                              team,
                                              isLastPicked = false,
                                          }: SpectatorPickSlotProps) {
    /* Ring & animation */

    const lastPickAnim = isLastPicked ? "animate-slide-in-left" : "";

    /* Team background */
    const teamBg =
        team === "BLUE" ? "bg-blue-600" : "bg-red-600";

    /* Splash adjustments */
    const adj = splashAdjustments[champion.id] ?? {};
    const objectPos =
        adj.xPercent !== undefined
            ? `${adj.xPercent}% 50%`
            : "50% 50%";

    const flipClass = adj.flip ? "-scale-x-100" : "";

    return (
        <div
            className={`
        relative w-44 h-80 rounded-2xl
        ${lastPickAnim}
        transition-all duration-300
      `}
        >
            {/* Background frame */}
            <div
                className={`absolute inset-0 ${teamBg} rounded-2xl overflow-hidden`}
            >
                {/* Splash art */}
                <img
                    src={champion.splashUrl}
                    alt={champion.name}
                    className={`w-full h-full object-cover ${flipClass}`}
                    style={{ objectPosition: objectPos }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

                {/* Champion name */}
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
          <span className="block text-xl font-bold tracking-wide text-white drop-shadow-lg">
            {champion.name}
          </span>
                </div>
            </div>
        </div>
    );
}
