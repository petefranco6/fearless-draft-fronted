import AvailableChampionButton from "./AvailableChampionButton";
import type { Champion } from "../utils/championService";
import NoneChampionButton from "./NoneChampionButton.tsx";

type Props = {
    champions: Champion[];
    draftUsedIds: string[];
    onSelect: (championId: string) => void;
};

export default function AvailableChampionsGrid({ champions, draftUsedIds, onSelect }: Props) {
    const isUsed = (id: string) => draftUsedIds.includes(id);

    return (
        <div
            className="h-[70vh] overflow-y-auto overscroll-contain
                       p-4 bg-neutral-900 rounded-xl shadow-inner
                       border border-neutral-800
                       scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900"
        >
            <div className="grid gap-3 justify-center
                           grid-cols-[repeat(auto-fit,minmax(5rem,1fr))]">
                <NoneChampionButton onSelect={onSelect} />
                {champions.map((champ) => (
                    <AvailableChampionButton
                        key={champ.id}
                        champ={champ}
                        onSelect={onSelect}
                        isUsed={isUsed(champ.id)}
                    />
                ))}
            </div>
        </div>
    );
}
