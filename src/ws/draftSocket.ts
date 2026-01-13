import {Client} from "@stomp/stompjs";
import type {IMessage} from "@stomp/stompjs";
import type {DraftState, DraftAction} from "../types/draft";

export type DraftStateCallback = (state: DraftState) => void;

export class WebSocketService {
    private client: Client | null = null;

    connect() {
        if (this.client?.connected) return;

        const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

        // Build ws/wss URL from your API base
        const wsUrl = new URL("/ws", apiBase);
        wsUrl.protocol = wsUrl.protocol === "https:" ? "wss:" : "ws:";

        this.client = new Client({
            brokerURL: wsUrl.toString(), // e.g. ws://localhost:8080/ws OR wss://fearless-draft-backend.onrender.com/ws
            reconnectDelay: 5000,
            debug: (str) => console.log("[STOMP]", str),
        });

        this.client.activate();
    }


    subscribe(draftId: string, callback: DraftStateCallback) {
        if (!this.client) return;

        this.client.onConnect = () => {
            this.client?.subscribe(
                `/topic/draft/${draftId}`,
                (msg: IMessage) => {
                    callback(JSON.parse(msg.body));
                }
            );
        };
    }

    sendAction(action: DraftAction) {
        if (!this.client?.connected) return;

        this.client.publish({
            destination: "/app/draft/action",
            body: JSON.stringify(action),
        });
    }

    sendPreview(
        draftId: string,
        team: "BLUE" | "RED",
        championId: string
    ) {
        if (!this.client?.connected) return;

        this.client.publish({
            destination: "/app/draft/preview",
            body: JSON.stringify({
                draftId,
                team,
                championId,
            }),
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
