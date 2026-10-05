import { fahrenheitToCelsius } from './storage';

export type TempUnit = 'C' | 'F';

export function sanitizeTemperatureGuess(text: string): string {
  let filtered = text.replace(/[^0-9-]/g, '');

  if (filtered.includes('-')) {
    const digits = filtered.replace(/-/g, '');
    filtered = filtered.startsWith('-') ? `-${digits}` : digits;
  }

  return filtered;
}

export function toggleMinusInGuess(guess: string): string {
  return guess.startsWith('-') ? guess.substring(1) : `-${guess}`;
}

export function isCompleteTemperatureGuess(guess: string): boolean {
  return guess.length > 0 && guess !== '-';
}

export function evaluateTemperatureGuess(
  guess: number,
  actualTempCelsius: number,
  tempUnit: TempUnit
): { differenceCelsius: number; isCorrect: boolean } {
  const guessTempCelsius = tempUnit === 'F' ? fahrenheitToCelsius(guess) : guess;
  const differenceCelsius = Math.abs(guessTempCelsius - actualTempCelsius);
  const threshold = tempUnit === 'F' ? (6 * 5 / 9) : 2;

  return {
    differenceCelsius,
    isCorrect: differenceCelsius <= threshold,
  };
}
