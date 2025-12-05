import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GameStats {
  totalRounds: number;
  totalDifference: number;
  averageScore: number;
  timeWeightedScore: number;
  perfectAnswers: number; // Within 2°C
  bestStreak: number;
  gamesPlayed: number;
}

const STATS_KEY = '@geodrink_stats';
const TEMP_UNIT_KEY = '@geodrink_temp_unit';
const DARK_MODE_KEY = '@geodrink_dark_mode';

export async function getGameStats(): Promise<GameStats> {
  try {
    const stats = await AsyncStorage.getItem(STATS_KEY);
    if (stats) {
      return JSON.parse(stats);
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
  
  return {
    totalRounds: 0,
    totalDifference: 0,
    averageScore: 0,
    timeWeightedScore: 0,
    perfectAnswers: 0,
    bestStreak: 0,
    gamesPlayed: 0,
  };
}

export async function updateGameStats(
  difference: number,
  timeInSeconds: number
): Promise<GameStats> {
  const stats = await getGameStats();
  
  stats.totalRounds += 1;
  stats.totalDifference += difference;
  stats.averageScore = stats.totalDifference / stats.totalRounds;
  
  // Calculate time bonus
  let timeBonus = 1.0;
  if (timeInSeconds <= 2) {
    timeBonus = 1.25; // 25% bonus
  } else if (timeInSeconds <= 5) {
    timeBonus = 1.10; // 10% bonus
  }
  
  // Time-weighted score (lower is better, so we invert the bonus)
  const timeWeightedDiff = difference / timeBonus;
  const prevTotal = stats.timeWeightedScore * (stats.totalRounds - 1);
  stats.timeWeightedScore = (prevTotal + timeWeightedDiff) / stats.totalRounds;
  
  // Check if within 2°C
  if (difference <= 2.0) {
    stats.perfectAnswers += 1;
  }
  
  await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
  return stats;
}

export async function resetGameStats(): Promise<void> {
  const emptyStats: GameStats = {
    totalRounds: 0,
    totalDifference: 0,
    averageScore: 0,
    timeWeightedScore: 0,
    perfectAnswers: 0,
    bestStreak: 0,
    gamesPlayed: 0,
  };
  await AsyncStorage.setItem(STATS_KEY, JSON.stringify(emptyStats));
}

export async function getTempUnit(): Promise<'C' | 'F'> {
  try {
    const unit = await AsyncStorage.getItem(TEMP_UNIT_KEY);
    return (unit as 'C' | 'F') || 'C';
  } catch {
    return 'C';
  }
}

export async function setTempUnit(unit: 'C' | 'F'): Promise<void> {
  await AsyncStorage.setItem(TEMP_UNIT_KEY, unit);
}

export async function getDarkMode(): Promise<boolean> {
  try {
    const darkMode = await AsyncStorage.getItem(DARK_MODE_KEY);
    return darkMode === 'true';
  } catch {
    return false;
  }
}

export async function setDarkMode(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(DARK_MODE_KEY, enabled ? 'true' : 'false');
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9/5) + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * 5/9;
}
