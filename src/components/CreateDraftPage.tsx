import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateDraftPage() {
    const navigate = useNavigate();

    // Team names
    const [blueTeamName, setBlueTeamName] = useState("");
    const [redTeamName, setRedTeamName] = useState("");

    // Which team gets first pick
    const [firstPickTeam, setFirstPickTeam] = useState<"BLUE" | "RED">("BLUE");

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

            const res = await fetch("http://localhost:8080/draft", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    blueTeamName: finalBlueTeamName,
                    redTeamName: finalRedTeamName,
                    firstPickTeam,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create draft");
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
                        onChange={(e) =>
                            setFirstPickTeam(e.target.value as "BLUE" | "RED")
                        }
                        className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neutral-600"
                    >
                        <option value="BLUE">
                            {blueTeamName.trim() || "Blue Team"}
                        </option>
                        <option value="RED">
                            {redTeamName.trim() || "Red Team"}
                        </option>
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
                    {isSubmitting ? "Creating Draft..." : "Create Draft"}
                </button>
            </div>
        </div>
    );
}
