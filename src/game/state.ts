import { BOARD_SIZE, HERO_ATTACK, HERO_MAX_HEALTH, HERO_START } from './config';
import { createArenaTiles } from './map';
import type { Entity, GameState } from './types';

const createHero = (): Entity => ({
  id: 'hero',
  kind: 'hero',
  position: HERO_START,
  health: HERO_MAX_HEALTH,
  maxHealth: HERO_MAX_HEALTH,
  attack: HERO_ATTACK,
});

export const createInitialState = (): GameState => ({
  turn: 0,
  status: 'playing',
  boardSize: BOARD_SIZE,
  tiles: createArenaTiles(),
  entities: [createHero()],
  supplies: 0,
  medkits: 0,
  eventLog: ['Вылазка началась. Найдите припасы и доберитесь до 🚪.'],
});
