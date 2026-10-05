import assert from 'node:assert/strict';
import { getBalancedRandomCities } from '../utils/city-selection';
import { LANGUAGE_OPTIONS, translate } from '../utils/i18n';
import {
  evaluateTemperatureGuess,
  isCompleteTemperatureGuess,
  sanitizeTemperatureGuess,
  toggleMinusInGuess,
} from '../utils/temperature-guess';
import { parsePartyConfiguration } from '../utils/party-configuration';

type TestCase = {
  name: string;
  run: () => void;
};

function cityKey(city: { city: string; country: string }): string {
  return `${city.city}|${city.country}`;
}

function timezoneBand(city: { lon: number }): number {
  return Math.round(city.lon / 15);
}

const tests: TestCase[] = [
  {
    name: 'balanced city selection returns requested count without duplicate cities',
    run: () => {
      const cities = getBalancedRandomCities(80, 8);
      const keys = cities.map(cityKey);

      assert.equal(cities.length, 80);
      assert.equal(new Set(keys).size, keys.length);
    },
  },
  {
    name: 'balanced city selection diversifies each achievable four-player batch',
    run: () => {
      const playerCount = 2;
      const batchSize = playerCount * 4;
      const cities = getBalancedRandomCities(batchSize * 3, playerCount);

      for (let i = 0; i < cities.length; i += batchSize) {
        const batch = cities.slice(i, i + batchSize);
        assert.equal(new Set(batch.map(city => city.country)).size, batch.length);
        assert.equal(new Set(batch.map(timezoneBand)).size, batch.length);
      }
    },
  },
  {
    name: 'balanced city selection caps oversized requests at available data',
    run: () => {
      const cities = getBalancedRandomCities(10_000, 8);
      assert.equal(new Set(cities.map(cityKey)).size, cities.length);
      assert.ok(cities.length < 10_000);
    },
  },
  {
    name: 'temperature input sanitizer keeps one leading minus and digits only',
    run: () => {
      assert.equal(sanitizeTemperatureGuess('12'), '12');
      assert.equal(sanitizeTemperatureGuess('-12'), '-12');
      assert.equal(sanitizeTemperatureGuess('--12'), '-12');
      assert.equal(sanitizeTemperatureGuess('1-2'), '12');
      assert.equal(sanitizeTemperatureGuess('-1a2°C'), '-12');
    },
  },
  {
    name: 'temperature minus toggle and completeness match submit behavior',
    run: () => {
      assert.equal(toggleMinusInGuess(''), '-');
      assert.equal(toggleMinusInGuess('12'), '-12');
      assert.equal(toggleMinusInGuess('-12'), '12');
      assert.equal(isCompleteTemperatureGuess(''), false);
      assert.equal(isCompleteTemperatureGuess('-'), false);
      assert.equal(isCompleteTemperatureGuess('-3'), true);
      assert.equal(isCompleteTemperatureGuess('0'), true);
    },
  },
  {
    name: 'temperature scoring uses Celsius and Fahrenheit tolerances',
    run: () => {
      assert.equal(evaluateTemperatureGuess(21, 20, 'C').isCorrect, true);
      assert.equal(evaluateTemperatureGuess(23, 20, 'C').isCorrect, false);
      assert.equal(evaluateTemperatureGuess(68, 20, 'F').isCorrect, true);
      assert.equal(evaluateTemperatureGuess(75, 20, 'F').isCorrect, false);
    },
  },
  {
    name: 'party configuration accepts a complete player list',
    run: () => {
      assert.deepEqual(
        parsePartyConfiguration('2', JSON.stringify([' Alex ', 'Sam'])),
        { playerCount: 2, names: ['Alex', 'Sam'] }
      );
    },
  },
  {
    name: 'party configuration rejects removed or malformed players safely',
    run: () => {
      assert.equal(parsePartyConfiguration('1', JSON.stringify(['Alex'])), null);
      assert.equal(parsePartyConfiguration('2', JSON.stringify(['Alex'])), null);
      assert.equal(parsePartyConfiguration('2', '{'), null);
      assert.equal(parsePartyConfiguration('2', JSON.stringify(['Alex', ''])), null);
    },
  },
  {
    name: 'translations cover every language option and interpolate values',
    run: () => {
      for (const option of LANGUAGE_OPTIONS) {
        assert.notEqual(translate(option.code, 'submitGuess'), '');
        assert.equal(translate(option.code, 'nextCityProgress', { current: 2, total: 10 }).includes('2'), true);
        assert.equal(translate(option.code, 'nextCityProgress', { current: 2, total: 10 }).includes('10'), true);
      }
    },
  },
];

let passed = 0;

for (const test of tests) {
  try {
    test.run();
    passed += 1;
    console.log(`ok ${passed} - ${test.name}`);
  } catch (error) {
    console.error(`not ok ${passed + 1} - ${test.name}`);
    throw error;
  }
}

console.log(`\n${passed}/${tests.length} tests passed`);
