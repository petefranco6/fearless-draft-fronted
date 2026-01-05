export type DraftTurn = "BLUE" | "RED";

export type DraftState = {
    phase: string;
    step: number;
    turn: DraftTurn;
    bluePicks: string[];
    redPicks: string[];
    bans: string[];
    previews: Partial<Record<DraftTurn, string>>;
    lastPickedChampion: string;
};

export type DraftAction = {
    team: string;
    championId: string;
};
