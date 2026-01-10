export type DraftTurn = "BLUE" | "RED";
export type DraftPhase = "BAN" | "PICK" | "COMPLETE";

export type DraftState = {
    draftId: string;

    blueTeamName: string;
    redTeamName: string;

    firstPickTeam: DraftTurn;

    phase: string;
    step: number;
    turn: DraftTurn;

    bluePicks: string[];
    redPicks: string[];
    bans: string[];

    previews: Partial<Record<DraftTurn, string>>;
    lastPickedChampion: string;

    turnStartedAt: number;
    turnDurationSeconds: number;
};

export type DraftAction = {
    draftId: string;
    team: string;
    championId: string;
};
