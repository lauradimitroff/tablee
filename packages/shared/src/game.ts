/** Catégories proposées dans la fiche d'un jeu. */
export const GAME_CATEGORIES = ['PARTY', 'STRATEGY', 'FAMILY', 'MYSTERY', 'RPG', 'OTHER'] as const;
export type GameCategory = (typeof GAME_CATEGORIES)[number];

/** Un jeu se joue soit les uns contre les autres, soit tous ensemble. */
export const GAME_MODES = ['COMPETITIVE', 'COOPERATIVE'] as const;
export type GameMode = (typeof GAME_MODES)[number];

/** Bornes de la fiche d'un jeu (cahier des charges, F3). */
export const GAME_LIMITS = {
  minPlayers: 1,
  maxPlayers: 20,
  durationStep: 15,
} as const;
