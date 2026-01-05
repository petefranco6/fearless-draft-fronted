import type { Champion } from "../utils/championService";

type Mode = "draft" | "spectator";
type Team = "BLUE" | "RED";

interface ChampionSlotProps {
    champion?: Champion | null;
    team?: Team;              // For coloring in draft mode
    phase?: string | null;            // Determines slot style (PICK vs BAN)
    isActive?: boolean;       // Highlight if it’s the current turn
    isLastPicked?: boolean;   // Animate if last picked/ban
    mode?: Mode;              // Draft vs spectator
    onClick?: () => void;
}

export default function ChampionSlot({
                                 champion,
                                 team = "BLUE",
                                 phase = "PICK",
                                 isActive = false,
                                 isLastPicked = false,
                                 mode = "draft",
                                 onClick,
                             }: ChampionSlotProps) {
    const baseClasses =
        "flex items-center justify-center rounded overflow-hidden transition-all duration-200";

    const activeClass = isActive ? "ring-4 ring-yellow-400" : "";
    const lastPickAnim = isLastPicked ? "animate-slide-in-left" : "";

    // Determine size and shape based on mode + phase
    let sizeClass = "";
    if (mode === "draft") {
        sizeClass = phase === "PICK" ? "h-14 w-44" : "h-14 w-14"; // small squares for ban
    } else {
        sizeClass = phase === "PICK" ? "w-44 h-68 rounded-2xl" : "w-36 h-56 rounded-xl"; // spectator: picks bigger, bans slightly smaller
    }

    // Determine background color for draft mode
    let bgClass = "";
    if (mode === "draft") {
        if (phase === "BAN") {
            bgClass = "bg-gray-600"; // muted gray for bans
        } else if (phase === "PICK") {
            bgClass =
                team === "BLUE"
                    ? champion
                        ? "bg-blue-500"
                        : "bg-gray-700"
                    : team === "RED"
                        ? champion
                            ? "bg-red-500"
                            : "bg-gray-700"
                        : "bg-gray-700";
        }
    }

    return (
        <div
            className={`${baseClasses} ${sizeClass} ${bgClass} ${activeClass} ${lastPickAnim}`}
            onClick={onClick}
        >
            {champion ? (
                <img
                    src={champion.splashUrl}
                    alt={champion.name}
                    className={`w-full h-full object-cover ${
                        mode === "spectator" ? "shadow-xl" : ""
                    }`}
                />
            ) : (
                mode === "draft" ? "—" : null
            )}
        </div>
    );
}
