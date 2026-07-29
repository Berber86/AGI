export type Direction = 'up' | 'right' | 'down' | 'left';

export interface Position {
  readonly row: number;
  readonly column: number;
}

export type TileKind = 'floor' | 'rubble' | 'evacuation' | 'supplies' | 'medkit';

export interface Tile {
  readonly position: Position;
  readonly kind: TileKind;
}

export type EntityKind = 'hero' | 'mutant-rat' | 'rust-drone';

export interface Entity {
  readonly id: string;
  readonly kind: EntityKind;
  readonly position: Position;
  readonly health: number;
  readonly maxHealth: number;
  readonly attack: number;
}

export type PlayerAction =
  | { readonly type: 'move'; readonly direction: Direction }
  | { readonly type: 'attack'; readonly direction: Direction }
  | { readonly type: 'pickup' }
  | { readonly type: 'use-medkit' }
  | { readonly type: 'wait' };

export type RunStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  readonly turn: number;
  readonly status: RunStatus;
  readonly boardSize: number;
  readonly tiles: readonly Tile[];
  readonly entities: readonly Entity[];
  readonly supplies: number;
  readonly medkits: number;
  readonly eventLog: readonly string[];
}
