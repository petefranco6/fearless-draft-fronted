import { useEffect, useState } from "react";
import DraftBoard from "./components/DraftBoard";
import type {DraftState} from "./types/draft";
import type {Role} from "./types/role.ts";
import {WebSocketService} from "./ws/draftSocket.ts";
import type {Champion} from "./utils/championService.ts";
import { fetchAllChampions} from "./utils/championService.ts";
import RoleSelect from "./components/RoleSelect.tsx";
import SpectatorDraft from "./components/SpectatorDraft.tsx";


const PICK_SLOTS = 5;
const BAN_SLOTS = 5;

const wsService = new WebSocketService();

function App() {
    const [champions, setChampions] = useState<Champion[]>([]);
    const [draft, setDraft] = useState<DraftState | null>(null);
    const [lastPickedChampion, setLastPickedChampion] = useState<string | null>(null);
    const [selectedChampionId, setSelectedChampionId] = useState<string | null>(null);
    const [role, setRole] = useState<Role | null>(() => {
        const saved = localStorage.getItem("team");
        if (saved === "BLUE" || saved === "RED" || saved === "SPECTATOR") return saved;
        return null;
    });

    useEffect(() => {
        fetch("http://localhost:8080/draft")
            .then((res) => res.json())
            .then(setDraft);

        wsService.connect(setDraft);

        return () => wsService.disconnect();
    }, []);

    useEffect(() => {
        fetchAllChampions().then(setChampions);
    }, []);


    const selectChampion = (champion:string) => {
        if(!role || draft?.turn !== role ) return;
        setSelectedChampionId(champion);
        wsService.sendPreview(draft.turn, champion)
    }


    const pickChampion = (champion: string) => {
        if(!role || draft?.turn !== role) return;

        setLastPickedChampion(champion);

        const action = {
            team: draft.turn,
            championId: champion
        };

        wsService.sendAction(action);
        setSelectedChampionId(null);
    };

    if (!role) {
        return <RoleSelect
            onSelect={(t) => {
            localStorage.setItem("team", t);
            setRole(t);
        }} />;
    }

    if (!draft) return <div>Loading draft...</div>;

    if (role === "SPECTATOR") return <SpectatorDraft
        lastPickedChampion={lastPickedChampion}
        PICK_SLOTS={PICK_SLOTS}
        BAN_SLOTS={BAN_SLOTS}
        draft={draft}
        champions={champions}
    />

    return (
        <div className="min-h-screen bg-linear-to-b from-neutral-950 via-neutral-900 to-black text-white">
            <div className="w-full px-4 py-4">


                {/* Turn Indicator */}
                <div className="flex justify-center mb-4">
                    <div
                        className={`px-6 py-2 rounded-full text-lg font-bold tracking-wide
                        ${
                            draft.turn === "BLUE"
                                ? "bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/40"
                                : draft.turn === "RED"
                                    ? "bg-red-600/20 text-red-400 ring-1 ring-red-500/40"
                                    : "bg-gray-700/30 text-gray-300"
                        }`}
                    >
                        {draft.turn ? `${draft.turn} TURN` : "DRAFT COMPLETE"}
                    </div>
                </div>

                <DraftBoard
                    draft={draft}
                    champions={champions}
                    onPick={pickChampion}
                    onSelect={selectChampion}
                    PICK_SLOTS={PICK_SLOTS}
                    BAN_SLOTS={BAN_SLOTS}
                    lastPickedChampion={lastPickedChampion}
                    selectedChampion={selectedChampionId}
                    role={role}
                />
            </div>
        </div>
    );
}

export default App;
