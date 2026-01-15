import {useState} from "react";

export type FirstPickTeam = "BLUE" | "RED";

export default function NextGameModal({
                                          open,
                                          initialBlue,
                                          initialRed,
                                          initialFirstPick,
                                          lockedChampionCount,
                                          onClose,
                                          onSubmit,
                                      }: {
    open: boolean;
    initialBlue: string;
    initialRed: string;
    initialFirstPick: FirstPickTeam;
    lockedChampionCount: number;
    onClose: () => void;
    onSubmit: (payload: {
        blueTeamName: string;
        redTeamName: string;
        firstPickTeam: FirstPickTeam;
    }) => void;
}) {
    // Initialize once per mount. Parent will remount this component when opening.
    const [blueTeamName, setBlueTeamName] = useState(initialBlue);
    const [redTeamName, setRedTeamName] = useState(initialRed);
    const [firstPickTeam, setFirstPickTeam] =
        useState<FirstPickTeam>(initialFirstPick);

    if (!open) return null;

    const canSubmit =
        blueTeamName.trim().length > 0 && redTeamName.trim().length > 0;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onMouseDown={(e) => {
                // click backdrop to close (but not clicks inside modal)
                if (e.target === e.currentTarget) onClose();
            }}
            onKeyDown={(e) => {
                if (e.key === "Escape") onClose();
            }}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-950 p-5 shadow-xl">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-lg font-bold text-white">
                            Create next game draft
                        </div>
                        <div className="mt-1 text-sm text-neutral-300">
                            Locked champions:{" "}
                            <span className="font-semibold text-white">
                {lockedChampionCount}
              </span>
                        </div>
                    </div>

                    <button
                        className="rounded-lg px-2 py-1 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white"
                        onClick={onClose}
                        aria-label="Close"
                        type="button"
                    >
                        ✕
                    </button>
                </div>

                <div className="mt-4 grid gap-3">
                    <label className="grid gap-1">
            <span className="text-xs font-medium text-neutral-300">
              Blue team name
            </span>
                        <input
                            className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-white outline-none focus:border-neutral-600"
                            value={blueTeamName}
                            onChange={(e) => setBlueTeamName(e.target.value)}
                            placeholder="Blue team name"
                            autoFocus
                        />
                    </label>

                    <label className="grid gap-1">
            <span className="text-xs font-medium text-neutral-300">
              Red team name
            </span>
                        <input
                            className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-white outline-none focus:border-neutral-600"
                            value={redTeamName}
                            onChange={(e) => setRedTeamName(e.target.value)}
                            placeholder="Red team name"
                        />
                    </label>

                    <div className="grid gap-2">
                        <div className="text-xs font-medium text-neutral-300">
                            First pick
                        </div>
                        <div className="flex gap-2">
                            {(["BLUE", "RED"] as FirstPickTeam[]).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold ${
                                        firstPickTeam === t
                                            ? t === "BLUE"
                                                ? "border-blue-500/40 bg-blue-500/10 text-blue-200"
                                                : "border-red-500/40 bg-red-500/10 text-red-200"
                                            : "border-neutral-800 bg-neutral-900/40 text-white hover:bg-neutral-900"
                                    }`}
                                    onClick={() => setFirstPickTeam(t)}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                    <button
                        type="button"
                        className="rounded-xl border border-neutral-700 px-4 py-2 text-sm text-white hover:bg-neutral-900"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                            canSubmit
                                ? "bg-white text-black hover:opacity-90"
                                : "bg-neutral-800 text-neutral-400"
                        }`}
                        disabled={!canSubmit}
                        onClick={() =>
                            onSubmit({
                                blueTeamName: blueTeamName.trim(),
                                redTeamName: redTeamName.trim(),
                                firstPickTeam,
                            })
                        }
                    >
                        Create draft
                    </button>
                </div>
            </div>
        </div>
    );
}
