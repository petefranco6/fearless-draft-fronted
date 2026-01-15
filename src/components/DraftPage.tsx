import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import DraftBoard from "./DraftBoard";
import SpectatorDraft from "./SpectatorDraft";
import RoleSelect from "./RoleSelect";

import type {DraftState} from "../types/draft";
import type {Role} from "../types/role";
import type {Champion} from "../utils/championService";

import {fetchAllChampions} from "../utils/championService";
import {WebSocketService, type SeriesDraftCreatedEvent} from "../ws/draftSocket";
import NextGameModal from "./NextGameModal.tsx";

const PICK_SLOTS = 5;
const BAN_SLOTS = 5;

const wsService = new WebSocketService();

type FirstPickTeam = "BLUE" | "RED";

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

    /* ---------------- SERIES TOAST ---------------- */
    const [nextGameToast, setNextGameToast] = useState<{
        seriesId: string;
        gameNumber: number;
        draftId: string;
    } | null>(null);

    /* ---------------- NEXT GAME MODAL ---------------- */
    const [showNextGameModal, setShowNextGameModal] = useState(false);

    // Track whether THIS client initiated "next game"
    const requestedNextGameRef = useRef(false);

    /* ---------------- INIT + DRAFT WS ---------------- */
    useEffect(() => {
        if (!draftId) return;

        let unsubscribeDraft: (() => void) | null = null;
        const API = import.meta.env.VITE_API_URL;

        (async () => {
            const res = await fetch(`${API}/draft/${draftId}`);
            const state: DraftState = await res.json();

            setDraft(state);

            wsService.connect();
            unsubscribeDraft = wsService.subscribeDraft(draftId, setDraft);
        })().catch(console.error);

        return () => {
            unsubscribeDraft?.();
        };
    }, [draftId]);

    /* ---------------- SERIES WS ---------------- */
    useEffect(() => {
        if (!draft) return;
        if (draft.mode !== "FEARLESS_SERIES") return;
        if (!draft.seriesId) return;

        wsService.connect();

        const unsubscribeSeries = wsService.subscribeSeries(draft.seriesId, (evt: SeriesDraftCreatedEvent) => {
            if (evt.type !== "SERIES_DRAFT_CREATED") return;

            // If this client created it, we already navigate manually
            if (requestedNextGameRef.current) {
                requestedNextGameRef.current = false;
                return;
            }

            // Already on that draft
            if (evt.draftId === draftId) return;

            setNextGameToast({
                seriesId: evt.seriesId,
                gameNumber: evt.gameNumber,
                draftId: evt.draftId,
            });
        });

        return () => unsubscribeSeries();
    }, [draft, draftId]);

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

    /* ---------------- NEXT GAME FLOW ---------------- */

    // Step 1: clicking "Next Game" opens modal (instead of creating immediately)
    const onClickNextGame = () => {
        if (!draft) return;
        if (draft.mode !== "FEARLESS_SERIES") return;
        if (!draft.seriesId) return;
        if (draft.phase !== "COMPLETE") return;

        setShowNextGameModal(true);
    };

    // Step 2: modal submit calls backend to create next game
    const createNextGameDraft = async (payload: {
        blueTeamName: string;
        redTeamName: string;
        firstPickTeam: FirstPickTeam;
    }) => {
        if (!draft) return;
        if (draft.mode !== "FEARLESS_SERIES") return;
        if (!draft.seriesId) return;

        const API = import.meta.env.VITE_API_URL;

        requestedNextGameRef.current = true;

        const res = await fetch(`${API}/series/${draft.seriesId}/next`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            requestedNextGameRef.current = false;
            const text = await res.text().catch(() => "");
            alert(`Failed to create next game (${res.status}). ${text}`);
            return;
        }

        const nextDraft: DraftState = await res.json();

        setShowNextGameModal(false);
        localStorage.removeItem(`team:${nextDraft.draftId}`);

        // Creator redirects immediately
        navigate(`/draft/${nextDraft.draftId}`);
    };

    /* ---------------- RENDER ---------------- */

    if (!draftId) return <div>Invalid draft URL</div>;

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

    return (
        <>
            {role === "SPECTATOR" ? (
                <SpectatorDraft draft={draft} champions={champions} PICK_SLOTS={PICK_SLOTS} BAN_SLOTS={BAN_SLOTS}/>
            ) : (
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
                    onNextGame={onClickNextGame} // ✅ now opens modal first
                />
            )}

            {/* Create-next-game modal */}
            <NextGameModal
                key={showNextGameModal ? `${draft.draftId}:${draft.seriesId ?? "noseries"}` : "closed"}
                open={showNextGameModal}
                initialBlue={draft.blueTeamName}
                initialRed={draft.redTeamName}
                initialFirstPick={(draft.firstPickTeam as FirstPickTeam) ?? "BLUE"}
                lockedChampionCount={draft.lockedChampionIds?.length ?? 0}
                onClose={() => setShowNextGameModal(false)}
                onSubmit={createNextGameDraft}
            />

            {/* Persistent toast: other users can choose to join */}
            {nextGameToast && (
                <div className="fixed top-4 right-4 z-50 w-[min(92vw,360px)]">
                    <div
                        className="rounded-2xl border border-neutral-800 bg-neutral-950/95 p-4 shadow-xl backdrop-blur">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="text-sm font-semibold text-white">
                                    Game {nextGameToast.gameNumber} draft is ready
                                </div>
                                <div className="mt-1 text-xs text-neutral-300">A new fearless draft has been created.
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 flex justify-end gap-2">

                            <button
                                className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black hover:opacity-90"
                                onClick={() => {
                                    const nextId = nextGameToast.draftId;
                                    setNextGameToast(null);
                                    localStorage.removeItem(`team:${nextId}`);
                                    navigate(`/draft/${nextId}`);
                                }}
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
