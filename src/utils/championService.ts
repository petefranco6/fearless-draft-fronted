type DragonChampionData = {
    id: string;
    name: string;
    image: {
        full: string;
        sprite: string;
        group: string;
        x: number;
        y: number;
        w: number;
        h: number;
    };
};

type DragonResponse = {
    data: Record<string, DragonChampionData>;
};

export type Champion = {
    id: string;
    name: string;
    imgUrl: string;
    splashUrl: string;
};

export const fetchAllChampions = async (): Promise<Champion[]> => {
    // 1. Get the latest version
    const versionsRes = await fetch(
        "https://ddragon.leagueoflegends.com/api/versions.json"
    );
    const versions: string[] = await versionsRes.json();

    const latestVersion = versions[0]; // most recent
    // 2. Fetch champion list for that version
    const res = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`
    );
    const json: DragonResponse = await res.json();

    return Object.values(json.data).map((c) => ({
        id: c.id,
        name: c.name,
        imgUrl: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${c.image.full}`,
        splashUrl: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${c.id}_0.jpg`
    }));
};
