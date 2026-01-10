import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DraftBoard from "./DraftBoard";
import SpectatorDraft from "./SpectatorDraft";
import RoleSelect from "./RoleSelect";

import type { DraftState } from "../types/draft";
import type { Role } from "../types/role";
import type { Champion } from "../utils/championService";

import { fetchAllChampions } from "../utils/championService";
import { WebSocketService } from "../ws/draftSocket";

const PICK_SLOTS = 5;
const BAN_SLOTS = 5;

const wsService = new WebSocketService();

export default function DraftPage() {
    /* ---------------- URL PARAM ---------------- */
    const params = useParams<{ draftId: string }>();
    const draftId = params.draftId ?? null;

    /* ---------------- STATE ---------------- */
    const [draft, setDraft] = useState<DraftState | null>(null);
    const [champions, setChampions] = useState<Champion[]>([]);

    const [role, setRole] = useState<Role | null>(() => {
        if (!draftId) return null;
        const saved = localStorage.getItem(`team:${draftId}`);
        if (saved === "BLUE" || saved === "RED" || saved === "SPECTATOR")
            return saved;
        return null;
    });

    /* ---------------- INIT DRAFT ---------------- */
    useEffect(() => {
        if (!draftId) return;

        fetch(`http://localhost:8080/draft/${draftId}`)
            .then((res) => res.json())
            .then((state: DraftState) => {
                setDraft(state);

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
        />
    );
}
