import {Client, type IMessage, type StompSubscription} from "@stomp/stompjs";
import type {DraftState, DraftAction} from "../types/draft";

export type DraftStateCallback = (state: DraftState) => void;

export type SeriesDraftCreatedEvent = {
    type: "SERIES_DRAFT_CREATED";
    seriesId: string;
    gameNumber: number;
    draftId: string;
};

export type SeriesEventCallback = (event: SeriesDraftCreatedEvent) => void;

export class WebSocketService {
    private client: Client | null = null;

    connect() {
        if (this.client?.connected || this.client?.active) return;

        const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

        // Build ws/wss URL from your API base
        const wsUrl = new URL("/ws", apiBase);
        wsUrl.protocol = wsUrl.protocol === "https:" ? "wss:" : "ws:";

        this.client = new Client({
            brokerURL: wsUrl.toString(),
            reconnectDelay: 5000,
            debug: (str) => console.log("[STOMP]", str),
        });

        this.client.activate();
    }

    /**
     * Subscribe to draft state updates.
     * Returns an unsubscribe function.
     */
    subscribeDraft(draftId: string, callback: DraftStateCallback): () => void {
        if (!this.client) return () => {
        };

        let sub: StompSubscription | undefined;

        const doSubscribe = () => {
            sub = this.client?.subscribe(`/topic/draft/${draftId}`, (msg: IMessage) => {
                callback(JSON.parse(msg.body));
            });
        };

        // If already connected, subscribe immediately.
        if (this.client.connected) {
            doSubscribe();
        } else {
            // Preserve any existing onConnect handler.
            const prev = this.client.onConnect;
            this.client.onConnect = (frame) => {
                prev?.(frame);
                doSubscribe();
            };
        }

        return () => sub?.unsubscribe();
    }

    /**
     * Subscribe to series-level events (like "next game draft created").
     * Returns an unsubscribe function.
     */
    subscribeSeries(seriesId: string, callback: SeriesEventCallback): () => void {
        if (!this.client) return () => {
        };

        let sub: StompSubscription | undefined;

        const doSubscribe = () => {
            sub = this.client?.subscribe(`/topic/series/${seriesId}`, (msg: IMessage) => {
                callback(JSON.parse(msg.body) as SeriesDraftCreatedEvent);
            });
        };

        if (this.client.connected) {
            doSubscribe();
        } else {
            const prev = this.client.onConnect;
            this.client.onConnect = (frame) => {
                prev?.(frame);
                doSubscribe();
            };
        }

        return () => sub?.unsubscribe();
    }

    sendAction(action: DraftAction) {
        if (!this.client?.connected) return;

        this.client.publish({
            destination: "/app/draft/action",
            body: JSON.stringify(action),
        });
    }

    sendPreview(draftId: string, team: "BLUE" | "RED", championId: string) {
        if (!this.client?.connected) return;

        this.client.publish({
            destination: "/app/draft/preview",
            body: JSON.stringify({draftId, team, championId}),
        });
    }

    sendReady(draftId: string, team: "BLUE" | "RED", ready: boolean) {
        if (!this.client?.connected) return;

        this.client.publish({
            destination: "/app/draft/ready",
            body: JSON.stringify({draftId, team, ready}),
        });
    }

    disconnect() {
        this.client?.deactivate();
        this.client = null;
    }
}
