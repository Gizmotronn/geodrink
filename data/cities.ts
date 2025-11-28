// Comprehensive city database with coordinates
// This is a starter set - expand with more cities!

export interface City {
  city: string;
  country: string;
  lat: number;
  lon: number;
  continent: string;
}

export const CITIES: City[] = [
  // North America
  { city: 'New York', country: 'USA', lat: 40.7128, lon: -74.0060, continent: 'North America' },
  { city: 'Los Angeles', country: 'USA', lat: 34.0522, lon: -118.2437, continent: 'North America' },
  { city: 'Chicago', country: 'USA', lat: 41.8781, lon: -87.6298, continent: 'North America' },
  { city: 'Miami', country: 'USA', lat: 25.7617, lon: -80.1918, continent: 'North America' },
  { city: 'Toronto', country: 'Canada', lat: 43.6532, lon: -79.3832, continent: 'North America' },
  { city: 'Vancouver', country: 'Canada', lat: 49.2827, lon: -123.1207, continent: 'North America' },
  { city: 'Mexico City', country: 'Mexico', lat: 19.4326, lon: -99.1332, continent: 'North America' },
  { city: 'Havana', country: 'Cuba', lat: 23.1136, lon: -82.3666, continent: 'North America' },

  // South America
  { city: 'São Paulo', country: 'Brazil', lat: -23.5505, lon: -46.6333, continent: 'South America' },
  { city: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lon: -43.1729, continent: 'South America' },
  { city: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lon: -58.3816, continent: 'South America' },
  { city: 'Lima', country: 'Peru', lat: -12.0464, lon: -77.0428, continent: 'South America' },
  { city: 'Bogotá', country: 'Colombia', lat: 4.7110, lon: -74.0721, continent: 'South America' },
  { city: 'Santiago', country: 'Chile', lat: -33.4489, lon: -70.6693, continent: 'South America' },

  // Europe
  { city: 'London', country: 'UK', lat: 51.5074, lon: -0.1278, continent: 'Europe' },
  { city: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, continent: 'Europe' },
  { city: 'Berlin', country: 'Germany', lat: 52.5200, lon: 13.4050, continent: 'Europe' },
  { city: 'Rome', country: 'Italy', lat: 41.9028, lon: 12.4964, continent: 'Europe' },
  { city: 'Madrid', country: 'Spain', lat: 40.4168, lon: -3.7038, continent: 'Europe' },
  { city: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lon: 4.9041, continent: 'Europe' },
  { city: 'Stockholm', country: 'Sweden', lat: 59.3293, lon: 18.0686, continent: 'Europe' },
  { city: 'Moscow', country: 'Russia', lat: 55.7558, lon: 37.6173, continent: 'Europe' },
  { city: 'Athens', country: 'Greece', lat: 37.9838, lon: 23.7275, continent: 'Europe' },
  { city: 'Vienna', country: 'Austria', lat: 48.2082, lon: 16.3738, continent: 'Europe' },

  // Asia
  { city: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, continent: 'Asia' },
  { city: 'Beijing', country: 'China', lat: 39.9042, lon: 116.4074, continent: 'Asia' },
  { city: 'Shanghai', country: 'China', lat: 31.2304, lon: 121.4737, continent: 'Asia' },
  { city: 'Hong Kong', country: 'China', lat: 22.3193, lon: 114.1694, continent: 'Asia' },
  { city: 'Seoul', country: 'South Korea', lat: 37.5665, lon: 126.9780, continent: 'Asia' },
  { city: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198, continent: 'Asia' },
  { city: 'Bangkok', country: 'Thailand', lat: 13.7563, lon: 100.5018, continent: 'Asia' },
  { city: 'Mumbai', country: 'India', lat: 19.0760, lon: 72.8777, continent: 'Asia' },
  { city: 'Delhi', country: 'India', lat: 28.6139, lon: 77.2090, continent: 'Asia' },
  { city: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708, continent: 'Asia' },
  { city: 'Istanbul', country: 'Turkey', lat: 41.0082, lon: 28.9784, continent: 'Asia' },
  { city: 'Tel Aviv', country: 'Israel', lat: 32.0853, lon: 34.7818, continent: 'Asia' },

  // Africa
  { city: 'Cairo', country: 'Egypt', lat: 30.0444, lon: 31.2357, continent: 'Africa' },
  { city: 'Lagos', country: 'Nigeria', lat: 6.5244, lon: 3.3792, continent: 'Africa' },
  { city: 'Johannesburg', country: 'South Africa', lat: -26.2041, lon: 28.0473, continent: 'Africa' },
  { city: 'Cape Town', country: 'South Africa', lat: -33.9249, lon: 18.4241, continent: 'Africa' },
  { city: 'Nairobi', country: 'Kenya', lat: -1.2921, lon: 36.8219, continent: 'Africa' },
  { city: 'Casablanca', country: 'Morocco', lat: 33.5731, lon: -7.5898, continent: 'Africa' },

  // Oceania
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, continent: 'Oceania' },
  { city: 'Melbourne', country: 'Australia', lat: -37.8136, lon: 144.9631, continent: 'Oceania' },
  { city: 'Brisbane', country: 'Australia', lat: -27.4698, lon: 153.0251, continent: 'Oceania' },
  { city: 'Perth', country: 'Australia', lat: -31.9505, lon: 115.8605, continent: 'Oceania' },
  { city: 'Auckland', country: 'New Zealand', lat: -36.8485, lon: 174.7633, continent: 'Oceania' },
  { city: 'Wellington', country: 'New Zealand', lat: -41.2865, lon: 174.7762, continent: 'Oceania' },

  // Add more cities as needed!
];

export function getRandomCity(): City {
  return CITIES[Math.floor(Math.random() * CITIES.length)];
}

export function getCitiesByContinent(continent: string): City[] {
  return CITIES.filter(city => city.continent === continent);
}

export function searchCities(query: string): City[] {
  const lowerQuery = query.toLowerCase();
  return CITIES.filter(
    city =>
      city.city.toLowerCase().includes(lowerQuery) ||
      city.country.toLowerCase().includes(lowerQuery)
  );
}
