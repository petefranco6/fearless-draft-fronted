import type { DraftAction, DraftState } from "../types/draft";

const BASE_URL = "http://localhost:8080";

export const fetchDraft = async (): Promise<DraftState> => {
    const res = await fetch(`${BASE_URL}/draft`);
    return res.json();
};

export const sendDraftAction = async (
    action: DraftAction
): Promise<DraftState> => {
    const res = await fetch(`${BASE_URL}/draft/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action)
    });
    return res.json();
};
