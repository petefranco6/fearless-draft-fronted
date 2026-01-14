import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import DraftBoard from "./DraftBoard";
import SpectatorDraft from "./SpectatorDraft";
import RoleSelect from "./RoleSelect";

import type {DraftState} from "../types/draft";
import type {Role} from "../types/role";
import type {Champion} from "../utils/championService";

import {fetchAllChampions} from "../utils/championService";
import {WebSocketService} from "../ws/draftSocket";

const PICK_SLOTS = 5;
const BAN_SLOTS = 5;

const wsService = new WebSocketService();

export default function DraftPage() {
    const navigate = useNavigate();

    /* ---------------- URL PARAM ---------------- */
    const params = useParams<{ draftId: string }>();
    const draftId = params.draftId ?? null;

    /* ---------------- STATE ---------------- */
    const [draft, setDraft] = useState<DraftState | null>(null);
    const [champions, setChampions] = useState<Champion[]>([]);

    const [role, setRole] = useState<Role | null>(() => {
        if (!draftId) return null;
        const saved = localStorage.getItem(`team:${draftId}`);
        if (saved === "BLUE" || saved === "RED" || saved === "SPECTATOR") return saved;
        return null;
    });

    /* ---------------- INIT DRAFT ---------------- */
    useEffect(() => {
        if (!draftId) return;

        const API = import.meta.env.VITE_API_URL;
        fetch(`${API}/draft/${draftId}`)
            .then((res) => res.json())
            .then((state: DraftState) => {
                setDraft(state);
                console.log(state);
                wsService.connect();
                wsService.subscribe(draftId, setDraft);
            });

        return () => wsService.disconnect();
    }, [draftId]);

    /* ---------------- LOAD CHAMPIONS ---------------- */
    useEffect(() => {
        fetchAllChampions().then(setChampions);
    }, []);

    /* ---------------- ACTIONS ---------------- */
    const selectChampion = (championId: string) => {
        if (!draftId || !draft || !role || draft.turn !== role) return;
        wsService.sendPreview(draftId, draft.turn, championId);
    };

    const pickChampion = (championId: string) => {
        if (!draftId || !draft || !role || draft.turn !== role) return;
        wsService.sendAction({
            draftId,
            team: draft.turn,
            championId,
        });
    };

    const setReady = (ready: boolean) => {
        if (!draftId || !role || role === "SPECTATOR") return;
        wsService.sendReady(draftId, role, ready);
    };

    // ✅ Fearless series: advance to next game
    const nextGame = async () => {
        if (!draft) return;
        if (draft.mode !== "FEARLESS_SERIES") return;
        if (!draft.seriesId) return;
        if (draft.phase !== "COMPLETE") return;

        const API = import.meta.env.VITE_API_URL;

        const res = await fetch(`${API}/series/${draft.seriesId}/next`, {
            method: "POST",
        });

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            alert(`Failed to start next game (${res.status}). ${text}`);
            return;
        }

        const nextDraft: DraftState = await res.json();

        // Optional: clear role selection so each game can re-pick roles if desired.
        // If you want to keep same role across games, delete these two lines.
        localStorage.removeItem(`team:${nextDraft.draftId}`);

        navigate(`/draft/${nextDraft.draftId}`);
    };

    /* ---------------- RENDER ---------------- */

    if (!draftId) {
        return <div>Invalid draft URL</div>;
    }

    if (!role) {
        return (
            <RoleSelect
                onSelect={(t) => {
                    localStorage.setItem(`team:${draftId}`, t);
                    setRole(t);
                }}
            />
        );
    }

    if (!draft) return <div>Loading draft...</div>;

    const isStarted = draft.turnStartedAt > 0 && draft.turnDurationSeconds > 0;

    if (role === "SPECTATOR") {
        return (
            <SpectatorDraft
                draft={draft}
                champions={champions}
                PICK_SLOTS={PICK_SLOTS}
                BAN_SLOTS={BAN_SLOTS}
            />
        );
    }

    return (
        <DraftBoard
            draft={draft}
            champions={champions}
            onPick={pickChampion}
            onSelect={selectChampion}
            PICK_SLOTS={PICK_SLOTS}
            BAN_SLOTS={BAN_SLOTS}
            role={role}
            isStarted={isStarted}
            onSetReady={setReady}
            onNextGame={nextGame} // ✅ new
        />
    );
}
