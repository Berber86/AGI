import { BOARD_SIZE, EVACUATION_POSITION, HERO_START } from './config';
import type { Position, Tile, TileKind } from './types';

const RUBBLE = new Set(['2:2', '2:3', '3:5', '4:2', '5:5', '6:5']);

const keyOf = (position: Position): string => `${position.row}:${position.column}`;

const samePosition = (first: Position, second: Position): boolean =>
  first.row === second.row && first.column === second.column;

export const tileKindAt = (position: Position): TileKind => {
  if (RUBBLE.has(keyOf(position))) return 'rubble';
  if (samePosition(position, EVACUATION_POSITION)) return 'evacuation';
  if (samePosition(position, HERO_START)) return 'supplies';
  if (position.row === 4 && position.column === 6) return 'medkit';
  return 'floor';
};

export const createArenaTiles = (size = BOARD_SIZE): readonly Tile[] => {
  const tiles: Tile[] = [];
  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      const position = { row, column };
      tiles.push({ position, kind: tileKindAt(position) });
    }
  }
  return tiles;
};

export const isInsideBoard = (position: Position, size = BOARD_SIZE): boolean =>
  position.row >= 0 && position.row < size && position.column >= 0 && position.column < size;

export const isWalkable = (tile: Tile): boolean => tile.kind !== 'rubble';
