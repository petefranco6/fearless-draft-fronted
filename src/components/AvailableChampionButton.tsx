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
            className={`relative h-20 w-20 border border-gray-600 rounded overflow-hidden transform transition duration-150
        ${isUsed ? "opacity-50 cursor-not-allowed" : "hover:scale-110 hover:ring-2 hover:ring-white"}`}
        >
            <img src={champ.imgUrl} alt={champ.name} className="h-full w-full object-cover" />
        </button>
    );
}
