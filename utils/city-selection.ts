import { CITIES, City } from '../data/cities';

const CITY_KEY_SEPARATOR = '|';

function cityKey(city: City): string {
  return `${city.city}${CITY_KEY_SEPARATOR}${city.country}`;
}

function timezoneBand(city: City): number {
  return Math.round(city.lon / 15);
}

function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function takeBalancedBatch(
  pool: City[],
  batchSize: number,
  usedCityKeys: Set<string>
): City[] {
  const batch: City[] = [];
  const usedCountries = new Set<string>();
  const usedTimezoneBands = new Set<number>();

  const priorities = [
    (city: City) => !usedCountries.has(city.country) && !usedTimezoneBands.has(timezoneBand(city)),
    (city: City) => !usedCountries.has(city.country),
    (city: City) => !usedTimezoneBands.has(timezoneBand(city)),
    () => true,
  ];

  for (const canUse of priorities) {
    while (batch.length < batchSize) {
      const next = pool.find(
        city => !usedCityKeys.has(cityKey(city)) && !batch.some(selected => cityKey(selected) === cityKey(city)) && canUse(city)
      );

      if (!next) {
        break;
      }

      batch.push(next);
      usedCountries.add(next.country);
      usedTimezoneBands.add(timezoneBand(next));
    }
  }

  return batch;
}

export function getBalancedRandomCities(count: number, playerCount = 1): City[] {
  const targetCount = Math.min(count, CITIES.length);
  const batchSize = Math.max(1, playerCount * 4);
  const pool = shuffled(CITIES);
  const selected: City[] = [];
  const usedCityKeys = new Set<string>();

  while (selected.length < targetCount) {
    const remaining = targetCount - selected.length;
    const batch = takeBalancedBatch(pool, Math.min(batchSize, remaining), usedCityKeys);

    if (batch.length === 0) {
      break;
    }

    batch.forEach(city => {
      selected.push(city);
      usedCityKeys.add(cityKey(city));
    });
  }

  if (selected.length < targetCount) {
    shuffled(CITIES)
      .filter(city => !usedCityKeys.has(cityKey(city)))
      .slice(0, targetCount - selected.length)
      .forEach(city => selected.push(city));
  }

  return selected;
}
