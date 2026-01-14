import {useMemo, useState} from "react";
import AvailableChampionButton from "./AvailableChampionButton";
import type {Champion, ChampionRole} from "../utils/championService";
import NoneChampionButton from "./NoneChampionButton.tsx";

type Props = {
    champions: Champion[];
    draftUsedIds: string[];        // used in THIS game (picks+bans)
    fearlessLockedIds?: string[];  // locked from previous games (picks-only)
    onSelect: (championId: string) => void;
};

const NONE_ID = "NONE";

export default function AvailableChampionsGrid({
                                                   champions,
                                                   draftUsedIds,
                                                   fearlessLockedIds = [],
                                                   onSelect,
                                               }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeRoles, setActiveRoles] = useState<ChampionRole[]>([]);

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const roleFilters = useMemo(
        () => ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"] as ChampionRole[],
        []
    );

    const isUsed = (id: string) => draftUsedIds.includes(id);

    const isFearlessLocked = (id: string) =>
        id !== NONE_ID && fearlessLockedIds.includes(id);

    const filteredChampions = useMemo(() => {
        return champions.filter((champ) => {
            const matchesSearch =
                normalizedSearch.length === 0 ||
                champ.name.toLowerCase().includes(normalizedSearch);

            const matchesRole =
                activeRoles.length === 0 ||
                champ.roles.some((role) => activeRoles.includes(role));

            return matchesSearch && matchesRole;
        });
    }, [champions, normalizedSearch, activeRoles]);

    const toggleRole = (role: ChampionRole) => {
        setActiveRoles((current) =>
            current.includes(role)
                ? current.filter((value) => value !== role)
                : [...current, role]
        );
    };

    const handleSelect = (championId: string) => {
        // ✅ Block fearless locked champs from being selected/previewed
        if (isFearlessLocked(championId)) return;
        onSelect(championId);
    };

    return (
        <div
            className="flex flex-col gap-4 h-full min-h-0">
            <div className="flex flex-row-reverse justify-between">
                <div
                    className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/60">
                    <input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search champions"
                        className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {roleFilters.map((role) => {
                        const isActive = activeRoles.includes(role);
                        return (
                            <button
                                key={role}
                                type="button"
                                onClick={() => toggleRole(role)}
                                className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition ${
                                    isActive
                                        ? "border-blue-400/70 bg-blue-500/20 text-blue-100"
                                        : "border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-neutral-500 hover:text-white"
                                }`}
                            >
                                {role}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div
                className="flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-hidden">
                <div className="grid gap-2 justify-center grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))]">
                    <NoneChampionButton onSelect={handleSelect}/>

                    {filteredChampions.map((champ) => (
                        <AvailableChampionButton
                            key={champ.id}
                            champ={champ}
                            onSelect={handleSelect}
                            isUsed={isUsed(champ.id)}
                            isFearlessLocked={isFearlessLocked(champ.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
