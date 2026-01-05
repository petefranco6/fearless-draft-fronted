// src/utils/splashAdjustments.ts


export type SplashAdjustment = {
    xPercent?: number; // horizontal focus, 0 = left, 50 = center, 100 = right
    flip?: boolean;    // whether to flip horizontally
};

export const splashAdjustments: Record<string, SplashAdjustment> = {
    // Problematic champs (examples)
    "Annie": {xPercent: 90},
    "Alistar": {xPercent: 70},
    "Akshan": {flip:true, xPercent: 70},
    "Amumu": {xPercent: 70},
    "Azir": {xPercent: 80},
    "Bard": {xPercent: 70}

    // Defaults you override later as you notice issues
};
