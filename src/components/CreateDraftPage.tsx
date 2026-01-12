import { useState } from "react";
import { useNavigate } from "react-router-dom";

type DraftTurn = "BLUE" | "RED";
type DraftMode = "SINGLE" | "FEARLESS_SERIES";

export default function CreateDraftPage() {
    const navigate = useNavigate();

    // Team names
    const [blueTeamName, setBlueTeamName] = useState("");
    const [redTeamName, setRedTeamName] = useState("");

    // Which team gets first pick
    const [firstPickTeam, setFirstPickTeam] = useState<DraftTurn>("BLUE");

    // ✅ Mode
    const [mode, setMode] = useState<DraftMode>("SINGLE");
    const [bestOf, setBestOf] = useState<3 | 5>(3);

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createDraft = async () => {
        try {
            setIsSubmitting(true);
            setError(null);

            // Apply defaults if blank
            const finalBlueTeamName = blueTeamName.trim() || "Blue Team";
            const finalRedTeamName = redTeamName.trim() || "Red Team";

            const basePayload = {
                blueTeamName: finalBlueTeamName,
                redTeamName: finalRedTeamName,
                firstPickTeam,
            };

            const url =
                mode === "SINGLE"
                    ? "http://localhost:8080/draft"
                    : "http://localhost:8080/series";

            const payload =
                mode === "SINGLE" ? basePayload : { ...basePayload, bestOf };

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || "Failed to create draft");
            }

            const draft = await res.json();
            navigate(`/draft/${draft.draftId}`);
        } catch (err) {
            setError("Something went wrong creating the draft.");
            console.log(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const blueLabel = blueTeamName.trim() || "Blue Team";
    const redLabel = redTeamName.trim() || "Red Team";

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
            <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-8 space-y-6">
                {/* Header */}
                <div className="text-center space-y-1">
                    <h1 className="text-3xl font-bold text-white">Create Draft</h1>
                    <p className="text-neutral-400 text-sm">
                        Leave team names blank to use defaults
                    </p>
                </div>

                {/* ✅ Mode */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-neutral-300">
                        Draft Mode
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setMode("SINGLE")}
                            className={`rounded-xl border px-4 py-3 text-left transition ${
                                mode === "SINGLE"
                                    ? "border-blue-500 bg-blue-500/10"
                                    : "border-neutral-700 bg-neutral-800 hover:border-neutral-500"
                            }`}
                        >
                            <div className="text-sm font-semibold text-white">Single Game</div>
                            <div className="text-xs text-neutral-400 mt-1">
                                Standard draft (no locks).
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setMode("FEARLESS_SERIES")}
                            className={`rounded-xl border px-4 py-3 text-left transition ${
                                mode === "FEARLESS_SERIES"
                                    ? "border-emerald-400 bg-emerald-400/10"
                                    : "border-neutral-700 bg-neutral-800 hover:border-neutral-500"
                            }`}
                        >
                            <div className="text-sm font-semibold text-white">Fearless</div>
                            <div className="text-xs text-neutral-400 mt-1">
                                Picks lock across games.
                            </div>
                        </button>
                    </div>

                    {mode === "FEARLESS_SERIES" && (
                        <div className="flex items-center justify-between gap-3">
                            <label className="text-sm font-medium text-neutral-300">
                                Best of
                            </label>
                            <select
                                value={bestOf}
                                onChange={(e) => setBestOf(Number(e.target.value) as 3 | 5)}
                                className="rounded-lg bg-neutral-800 border border-neutral-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                            >
                                <option value={3}>Bo3</option>
                                <option value={5}>Bo5</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Team Inputs */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-blue-400 mb-1">
                            Blue Side Team
                        </label>
                        <input
                            value={blueTeamName}
                            onChange={(e) => setBlueTeamName(e.target.value)}
                            placeholder="Blue Team"
                            className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-red-400 mb-1">
                            Red Side Team
                        </label>
                        <input
                            value={redTeamName}
                            onChange={(e) => setRedTeamName(e.target.value)}
                            placeholder="Red Team"
                            className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                    </div>
                </div>

                {/* First Pick */}
                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">
                        First Pick
                    </label>
                    <select
                        value={firstPickTeam}
                        onChange={(e) => setFirstPickTeam(e.target.value as DraftTurn)}
                        className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neutral-600"
                    >
                        <option value="BLUE">{blueLabel}</option>
                        <option value="RED">{redLabel}</option>
                    </select>
                </div>

                {/* Error */}
                {error && (
                    <div className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-4 py-2">
                        {error}
                    </div>
                )}

                {/* Action */}
                <button
                    onClick={createDraft}
                    disabled={isSubmitting}
                    className="
            w-full rounded-xl py-3 font-semibold text-white
            bg-blue-600 hover:bg-blue-500
            disabled:bg-neutral-700 disabled:text-neutral-400
            transition-colors
          "
                >
                    {isSubmitting
                        ? mode === "SINGLE"
                            ? "Creating Draft..."
                            : "Creating Series..."
                        : mode === "SINGLE"
                            ? "Create Draft"
                            : "Create Fearless Series"}
                </button>

                {/* Hint */}
                <div className="text-xs text-neutral-500 text-center">
                    After creating, both teams must click <span className="text-neutral-300 font-semibold">Ready</span> to start.
                </div>
            </div>
        </div>
    );
}
