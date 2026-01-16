
export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  LEADERBOARD = 'LEADERBOARD',
  SKINS = 'SKINS'
}

export type Point = {
  x: number;
  y: number;
};

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export enum ItemType {
  MOUSE = 'MOUSE',
  BIG_MOUSE = 'BIG_MOUSE',
  POISON = 'POISON'
}

export type FoodItem = {
  pos: Point;
  type: ItemType;
  expiresAt?: number;
};

export type LeaderboardEntry = {
  name: string;
  address?: string;
  score: number;
  date: string;
  txHash?: string;
};

export type SkinStats = {
  speedMod?: number;
  scoreMod?: number;
  growthMod?: number;
  poisonResist?: number;
};

export type Skin = {
  id: string;
  name: string;
  price: number;
  headColor: string;
  bodyColor: string;
  description: string;
  emoji?: string;
  stats: SkinStats;
};

export type OnChainTx = {
  hash: string;
  type: 'MINT' | 'PURCHASE' | 'SCORE_SYNC';
  timestamp: number;
  status: 'SUCCESS' | 'PENDING';
};
