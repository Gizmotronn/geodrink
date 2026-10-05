const MIN_PARTY_PLAYERS = 2;
const MAX_PARTY_PLAYERS = 8;

type SearchParam = string | string[] | undefined;

export type PartyConfiguration = {
  playerCount: number;
  names: string[];
};

function firstValue(value: SearchParam): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Treat navigation params as untrusted input. This keeps a transient player-list
 * update (or a stale deep link) from creating an invalid score array in the game.
 */
export function parsePartyConfiguration(
  playerCountParam: SearchParam,
  namesParam: SearchParam
): PartyConfiguration | null {
  const countValue = firstValue(playerCountParam);
  const namesValue = firstValue(namesParam);

  if (!countValue || !namesValue || !/^\d+$/.test(countValue)) {
    return null;
  }

  const playerCount = Number(countValue);
  if (!Number.isSafeInteger(playerCount) || playerCount < MIN_PARTY_PLAYERS || playerCount > MAX_PARTY_PLAYERS) {
    return null;
  }

  try {
    const parsedNames: unknown = JSON.parse(namesValue);
    if (!Array.isArray(parsedNames) || parsedNames.length !== playerCount) {
      return null;
    }

    const names = parsedNames.map(name => typeof name === 'string' ? name.trim() : '');
    if (names.some(name => !name)) {
      return null;
    }

    return { playerCount, names };
  } catch {
    return null;
  }
}
