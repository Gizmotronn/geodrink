import {
  CreateOnlineRoomResponse,
  JoinOnlineRoomResponse,
  OnlinePartyClientEvent,
  OnlinePartyServerEvent,
  OnlinePartyState,
  normalizeRoomCode,
} from '../shared/online-party';

type OnlinePartyConnectionHandlers = {
  onState: (state: OnlinePartyState) => void;
  onError: (message: string) => void;
  onStatusChange?: (connected: boolean) => void;
};

export type OnlinePartyConnection = {
  send: (event: OnlinePartyClientEvent) => void;
  close: () => void;
};

const RAW_BASE_URL = process.env.EXPO_PUBLIC_WEATHR_PARTY_SERVER_URL || '';

export function getOnlinePartyServerUrl(): string {
  return RAW_BASE_URL.replace(/\/+$/, '');
}

export function isOnlinePartyConfigured(): boolean {
  return getOnlinePartyServerUrl().length > 0;
}

function assertConfigured(): string {
  const baseUrl = getOnlinePartyServerUrl();
  if (!baseUrl) {
    throw new Error('Online party server is not configured. Set EXPO_PUBLIC_WEATHR_PARTY_SERVER_URL.');
  }
  return baseUrl;
}

function getWebSocketUrl(baseUrl: string, roomCode: string, playerId: string): string {
  const url = new URL(`${baseUrl}/rooms/${normalizeRoomCode(roomCode)}/connect`);
  url.searchParams.set('playerId', playerId);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  return url.toString();
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.message || 'Online party request failed.');
  }
  return body as T;
}

export async function createOnlinePartyRoom(playerName: string): Promise<CreateOnlineRoomResponse> {
  const baseUrl = assertConfigured();
  const response = await fetch(`${baseUrl}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerName }),
  });
  return parseResponse<CreateOnlineRoomResponse>(response);
}

export async function joinOnlinePartyRoom(
  roomCode: string,
  playerName: string
): Promise<JoinOnlineRoomResponse> {
  const baseUrl = assertConfigured();
  const response = await fetch(`${baseUrl}/rooms/${normalizeRoomCode(roomCode)}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerName }),
  });
  return parseResponse<JoinOnlineRoomResponse>(response);
}

export function connectOnlinePartyRoom(
  roomCode: string,
  playerId: string,
  handlers: OnlinePartyConnectionHandlers
): OnlinePartyConnection {
  const baseUrl = assertConfigured();
  const ws = new WebSocket(getWebSocketUrl(baseUrl, roomCode, playerId));

  ws.onopen = () => {
    handlers.onStatusChange?.(true);
    ws.send(JSON.stringify({ type: 'hello', playerId } satisfies OnlinePartyClientEvent));
  };

  ws.onclose = () => {
    handlers.onStatusChange?.(false);
  };

  ws.onerror = () => {
    handlers.onError('Connection to the online party room failed.');
  };

  ws.onmessage = (event) => {
    try {
      const message = JSON.parse(String(event.data)) as OnlinePartyServerEvent;
      if (message.type === 'state') {
        handlers.onState(message.state);
      } else if (message.type === 'error') {
        handlers.onError(message.message);
      }
    } catch {
      handlers.onError('Received an invalid room update.');
    }
  };

  return {
    send: (event) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(event));
      }
    },
    close: () => ws.close(),
  };
}
