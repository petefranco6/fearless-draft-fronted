// websocketService.ts
import { Client} from "@stomp/stompjs";
import type {IMessage} from "@stomp/stompjs";
import type {DraftState, DraftAction} from "../types/draft.ts";

export type DraftStateCallback = (state: DraftState) => void; // replace 'any' with DraftState type

export class WebSocketService {
    private client: Client | null = null;

    connect(onMessage: DraftStateCallback) {
        this.client = new Client({
            brokerURL: "ws://localhost:8080/ws",
            reconnectDelay: 5000,
            debug: (str) => console.log("[STOMP]", str),
        });

        this.client.onConnect = () => {
            console.log("Connected to WebSocket");

            // Subscribe to draft topic
            this.client?.subscribe("/topic/draft", (msg: IMessage) => {
                const state = JSON.parse(msg.body);
                console.log(msg.body,"this is the msg")
                onMessage(state);
            });
        };

        this.client.activate();
    }

    sendAction(action: DraftAction) {
        if (!this.client || !this.client.connected) return;

        this.client.publish({
            destination: "/app/draft/action",
            body: JSON.stringify(action),
        });
    }

    sendPreview(team: "BLUE" | "RED", championId: string) {
        if (!this.client || !this.client.connected) return;

        this.client.publish({
            destination: "/app/draft/preview",
            body: JSON.stringify({
                team,
                championId,
            }),
        });
    }

    disconnect() {
        this.client?.deactivate();
    }
}
