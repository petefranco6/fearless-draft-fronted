type Props = {
    onSelect: (championId: string) => void;
    isUsed?: boolean; // optional if you want to disable it (I recommend false)
};

const NONE_ID = "NONE";

export default function NoneChampionButton({ onSelect, isUsed = false }: Props) {
    return (
        <button
            type="button"
            onFocus={() => {
                if (!isUsed) onSelect(NONE_ID);
            }}
            onClick={() => {
                if (!isUsed) onSelect(NONE_ID);
            }}
            disabled={isUsed}
            className={[
                "relative flex flex-col items-center justify-center",
                "h-28 w-20 rounded-xl border",
                "bg-neutral-900 border-neutral-700",
                "shadow-sm transition-all",
                isUsed
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:-translate-y-0.5 hover:border-neutral-500 hover:shadow-md",
                "focus:outline-none focus:ring-2 focus:ring-blue-600/60",
            ].join(" ")}
            title="None (skip this pick/ban)"
        >
            <div className="text-3xl font-extrabold text-neutral-300 leading-none">Ø</div>
            <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                None
            </div>

            <div className="absolute bottom-1 text-[10px] text-neutral-500">
                Skip
            </div>
        </button>
    );
}
