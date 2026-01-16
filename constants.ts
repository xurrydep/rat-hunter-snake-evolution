
import { Skin } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 1;
export const MIN_SPEED = 60;

export const SCORES = {
  MOUSE: 1,
  BIG_MOUSE: 5,
  POISON: -3
};

export const GROWTH = {
  MOUSE: 1,
  BIG_MOUSE: 3,
  POISON: -2
};

export const COLORS = {
  SNAKE_HEAD: '#22c55e',
  SNAKE_BODY: '#15803d',
  MOUSE: '#94a3b8',
  BIG_MOUSE: '#f59e0b',
  POISON: '#ef4444',
  GRID: '#1e293b'
};

export const SKINS: Skin[] = [
  {
    id: 'classic',
    name: 'Classic',
    price: 0,
    headColor: '#22c55e',
    bodyColor: '#15803d',
    description: 'The green of the wild. Standard stats.',
    emoji: '🐍',
    stats: {}
  },
  {
    id: 'neon',
    name: 'Neon Night',
    price: 50,
    headColor: '#06b6d4',
    bodyColor: '#0891b2',
    description: 'Cyber speed! 20% faster, 25% more points.',
    emoji: '💎',
    stats: { speedMod: 20, scoreMod: 1.25 }
  },
  {
    id: 'magma',
    name: 'Magma',
    price: 150,
    headColor: '#f97316',
    bodyColor: '#c2410c',
    description: 'Poison resistance! 50% less impact from poisons.',
    emoji: '🔥',
    stats: { poisonResist: 0.5, scoreMod: 1.1 }
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 500,
    headColor: '#facc15',
    bodyColor: '#a16207',
    description: 'Wealth! All scores and coins are doubled.',
    emoji: '👑',
    stats: { scoreMod: 2.0 }
  },
  {
    id: 'ghost',
    name: 'Ghost',
    price: 1000,
    headColor: '#f8fafc',
    bodyColor: '#cbd5e1',
    description: 'Weightless! Moves 30% slower and grows less.',
    emoji: '👻',
    stats: { speedMod: -40, growthMod: 0.5 }
  }
];
