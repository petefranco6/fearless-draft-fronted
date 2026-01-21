import type {Champion} from "../utils/championService.ts";

export default function FearlessLocksRow({
                                             lockedIds,
                                             resolveChampion,
                                         }: {
    lockedIds: string[];
    resolveChampion: (id: string | null | undefined) => Champion | null;
}) {
    const cleaned = (lockedIds ?? []).filter((id) => id && id !== "NONE");
    if (cleaned.length === 0) return null;

    const MAX = 12; // keep it compact in the action panel
    const shown = cleaned.slice(0, MAX);
  
    return (
        <div>
            <div className="m-1 flex flex-wrap gap-1 justify-center">
                {shown.map((id) => {
                    const champ = resolveChampion(id);

                    return (
                        <div
                            key={id}
                            title={champ?.name ?? id}
                            className={`
                h-10 w-10 flex items-center justify-center rounded-lg
                bg-neutral-800/70 border border-neutral-700 overflow-hidden shadow-sm
              `}
                        >
                            {champ ? (
                                <img
                                    src={champ.imgUrl}
                                    alt={champ.name}
                                    className="w-full h-full object-cover grayscale"
                                    draggable={false}
                                />
                            ) : (
                                <span className="text-[10px] font-semibold text-neutral-500">—</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
