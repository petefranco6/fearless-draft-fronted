import type { DraftPhase, DraftTurn } from "../types/draft";

export type DraftStep = {
    phase: DraftPhase;
    turn: DraftTurn;
};

export function buildDraftSteps(firstPickTeam: DraftTurn): DraftStep[] {
    const first: DraftTurn = firstPickTeam;
    const second: DraftTurn = firstPickTeam === "BLUE" ? "RED" : "BLUE";

    return [
        // Ban phase 1
        { phase: "BAN", turn: first },
        { phase: "BAN", turn: second },
        { phase: "BAN", turn: first },
        { phase: "BAN", turn: second },
        { phase: "BAN", turn: first },
        { phase: "BAN", turn: second },

        // Pick phase 1
        { phase: "PICK", turn: first },
        { phase: "PICK", turn: second },
        { phase: "PICK", turn: second },
        { phase: "PICK", turn: first },
        { phase: "PICK", turn: first },
        { phase: "PICK", turn: second },

        // Ban phase 2
        { phase: "BAN", turn: second },
        { phase: "BAN", turn: first },
        { phase: "BAN", turn: second },
        { phase: "BAN", turn: first },

        // Pick phase 2
        { phase: "PICK", turn: second },
        { phase: "PICK", turn: first },
        { phase: "PICK", turn: first },
        { phase: "PICK", turn: second },
    ];
}
