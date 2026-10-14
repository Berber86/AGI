import type { GameInput, GameState, MoveVector, OrganId } from './simulation';

declare global {
  interface Window {
    __READY__?: boolean;
    __GAME_TEST__?: {
      start(): void;
      snapshot(): GameState;
      setAxes(x: number, z: number): void;
      setPosition(x: number, z: number): void;
      setHealth(health: number): void;
      setDNA(dna: number): void;
      setBiomass(biomass: number): void;
      setLoadout(organs: Array<OrganId | null>): void;
      organVisible(organ: OrganId): boolean;
      exitVisible(): boolean;
      effects(): ReturnType<typeof import('./simulation').getOrganEffects>;
      teleportToEntity(id: string): boolean;
      entities(): GameState['entities'];
      step(seconds: number, actions?: Partial<GameInput>): GameState;
      axes(): MoveVector;
    };
  }
}

export {};
