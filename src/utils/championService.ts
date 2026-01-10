type DragonChampionData = {
    id: string;
    name: string;
    tags: string[];
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
    roles: ChampionRole[];
};

export type ChampionRole = "TOP" | "JUNGLE" | "MID" | "ADC" | "SUPPORT";

const mapTagsToRoles = (tags: string[]): ChampionRole[] => {
    const roles = new Set<ChampionRole>();

    if (tags.includes("Marksman")) roles.add("ADC");
    if (tags.includes("Support")) roles.add("SUPPORT");
    if (tags.includes("Mage") || tags.includes("Assassin")) roles.add("MID");
    if (tags.includes("Fighter") || tags.includes("Tank")) roles.add("TOP");
    if (tags.includes("Assassin") || tags.includes("Fighter") || tags.includes("Tank"))
        roles.add("JUNGLE");

    return Array.from(roles);
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
        splashUrl: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${c.id}_0.jpg`,
        roles: mapTagsToRoles(c.tags)
    }));
};
