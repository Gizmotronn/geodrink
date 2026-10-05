export type OnlinePartyPhase = 'lobby' | 'guessing' | 'revealed' | 'complete';

export type OnlinePartyPlayer = {
  id: string;
  name: string;
  score: number;
  connected: boolean;
  isHost: boolean;
};

export type OnlinePartyCity = {
  city: string;
  country: string;
  lat: number;
  lon: number;
  continent: string;
  temperature?: number;
};

export type OnlinePartyState = {
  roomCode: string;
  phase: OnlinePartyPhase;
  players: OnlinePartyPlayer[];
  currentPlayerId: string | null;
  currentCity: OnlinePartyCity | null;
  roundIndex: number;
  totalRounds: number;
  lastGuess: {
    playerId: string;
    guess: number;
    actual: number;
    correct: boolean;
    difference: number;
  } | null;
  updatedAt: number;
};

export type OnlinePartyServerEvent =
  | { type: 'state'; state: OnlinePartyState }
  | { type: 'error'; message: string };

export type OnlinePartyClientEvent =
  | { type: 'hello'; playerId: string }
  | { type: 'start' }
  | { type: 'submitGuess'; guess: number }
  | { type: 'next' }
  | { type: 'ping' };

export type CreateOnlineRoomResponse = {
  roomCode: string;
  playerId: string;
  state: OnlinePartyState;
};

export type JoinOnlineRoomResponse = {
  roomCode: string;
  playerId: string;
  state: OnlinePartyState;
};

export function normalizeRoomCode(code: string): string {
  return code.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 6);
}
