import type {Champion} from "../utils/championService";

type Props = {
    champ: Champion;
    onSelect: (championId: string) => void;
    isUsed: boolean;
    isFearlessLocked?: boolean;
};

export default function AvailableChampionButton({
                                                    champ,
                                                    onSelect,
                                                    isUsed,
                                                    isFearlessLocked = false,
                                                }: Props) {
    const disabled = isUsed || isFearlessLocked;

    const badge = isFearlessLocked ? "FEARLESS" : isUsed ? "USED" : null;

    return (
        <button
            onClick={() => onSelect(champ.id)}
            disabled={disabled}
            title={isFearlessLocked ? "Locked (Fearless)" : isUsed ? "Already used this game" : champ.name}
            className={`
        relative flex h-28 w-20 flex-col overflow-hidden rounded-xl border bg-neutral-900 text-left
        transition duration-150 shadow-sm
        ${isFearlessLocked ? "border-emerald-500/60" : "border-neutral-700"}
        ${disabled ? "cursor-not-allowed opacity-55" : "hover:-translate-y-0.5 hover:border-neutral-500 hover:shadow-md"}
      `}
        >
            {/* Image */}
            <div className="relative h-20 w-full">
                <img src={champ.imgUrl} alt={champ.name} className="h-20 w-full object-cover"/>
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"/>
            </div>

            {/* Name */}
            <span className="px-1.5 pt-1 text-[0.65rem] font-semibold text-white truncate">
        {champ.name}
      </span>

            {/* Badge overlay */}
            {badge && (
                <span
                    className={`
            absolute top-1 left-1 rounded px-1.5 py-0.5 text-[0.55rem] font-extrabold tracking-wide
            ${isFearlessLocked ? "bg-emerald-400 text-black" : "bg-neutral-200 text-black"}
          `}
                >
          {badge}
        </span>
            )}

            {/* Subtle overlay tint for fearless */}
            {isFearlessLocked && <div className="absolute inset-0 bg-emerald-400/10 pointer-events-none"/>}
            {/* Subtle overlay tint for used */}
            {isUsed && !isFearlessLocked && <div className="absolute inset-0 bg-black/15 pointer-events-none"/>}
        </button>
    );
}
