import type { Champion } from "../utils/championService";

type Props = {
    champ: Champion;
    onSelect: (championId: string) => void;
    isUsed: boolean;
};

export default function AvailableChampionButton({ champ, onSelect, isUsed }: Props) {
    return (
        <button
            onClick={() => onSelect(champ.id)}
            disabled={isUsed}
            className={`flex h-28 w-20 flex-col overflow-hidden rounded border border-gray-600 text-left
            transition duration-150
        ${isUsed ? "cursor-not-allowed opacity-50" : "hover:scale-105 hover:ring-2 hover:ring-white"}`}
        >
            <img src={champ.imgUrl} alt={champ.name} className="h-20 w-full object-cover" />
            <span className="px-1 pt-1 text-[0.65rem] font-semibold text-white truncate">
                {champ.name}
            </span>
        </button>
    );
}
