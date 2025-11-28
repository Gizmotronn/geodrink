// Weather API Service
// Replace with your actual weather API (OpenWeatherMap, WeatherAPI, etc.)

const WEATHER_API_KEY = 'YOUR_API_KEY_HERE'; // Get from openweathermap.org
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

export async function getCurrentTemperature(
  lat: number,
  lon: number
): Promise<number> {
  try {
    const response = await fetch(
      `${WEATHER_API_BASE}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }
    
    const data = await response.json();
    return Math.round(data.main.temp * 10) / 10; // Round to 1 decimal
  } catch (error) {
    console.error('Error fetching weather:', error);
    // Fallback to mock data for development
    return getMockTemperature(lat);
  }
}

export async function getDetailedWeather(
  lat: number,
  lon: number
): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${WEATHER_API_BASE}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }
    
    const data = await response.json();
    
    return {
      temperature: Math.round(data.main.temp * 10) / 10,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return {
      temperature: getMockTemperature(lat),
      description: 'Clear sky',
      humidity: 60,
      windSpeed: 5,
    };
  }
}

// Mock temperature generator for development/testing
function getMockTemperature(lat: number): number {
  // Simple latitude-based temperature estimation
  const absLat = Math.abs(lat);
  
  // Current month (November 2025)
  const month = 11; // November
  const isNorthernHemisphere = lat >= 0;
  
  // Seasonal adjustment
  let seasonalAdjustment = 0;
  if (month >= 3 && month <= 5) {
    // Spring in NH, Autumn in SH
    seasonalAdjustment = isNorthernHemisphere ? 5 : -5;
  } else if (month >= 6 && month <= 8) {
    // Summer in NH, Winter in SH
    seasonalAdjustment = isNorthernHemisphere ? 10 : -15;
  } else if (month >= 9 && month <= 11) {
    // Autumn in NH, Spring in SH
    seasonalAdjustment = isNorthernHemisphere ? -5 : 5;
  } else {
    // Winter in NH, Summer in SH
    seasonalAdjustment = isNorthernHemisphere ? -15 : 10;
  }
  
  if (absLat < 23.5) {
    // Tropical zone
    return Math.floor(Math.random() * 10) + 25 + seasonalAdjustment; // 25-35°C base
  } else if (absLat < 66.5) {
    // Temperate zone
    return Math.floor(Math.random() * 20) + 10 + seasonalAdjustment; // 10-30°C base
  } else {
    // Polar zone
    return Math.floor(Math.random() * 20) - 20 + seasonalAdjustment; // -20 to 0°C base
  }
}
