# GeoDrink - Geography Temperature Guessing Game

A React Native Expo app where players guess the current temperature of random cities around the world. Perfect for parties and testing your geography knowledge!

## 🎮 Game Modes

- **Classic Mode**: Solo play - test your knowledge and track your accuracy
- **Party/Drink Mode**: Social drinking game - within 2°C everyone else drinks, more than 2°C off and you drink!

## 📱 Features Implemented

✅ Home screen with mode selection
✅ Game screen with temperature guessing
✅ Rules/Help screen with comprehensive instructions
✅ Settings screen with preferences
✅ 50+ cities from all continents
✅ Real-time weather API integration (with fallback mock data)
✅ Score tracking
✅ Beautiful UI with themed components

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Weather API Key (Required for real data)

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api) (free tier available)
2. Get your API key
3. Open `services/weather.ts`
4. Replace `YOUR_API_KEY_HERE` with your actual API key:

```typescript
const WEATHER_API_KEY = 'your_actual_api_key_here';
```

**Note**: The app will work without an API key using mock temperature data based on latitude and season.

### 3. Run the App

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## 📁 Project Structure

```
app/
├── (tabs)/
│   └── index.tsx          # Home screen with mode selection
├── game.tsx               # Main game screen
├── rules.tsx              # Rules and help information
└── settings.tsx           # Settings and preferences

data/
└── cities.ts              # Database of 50+ cities with coordinates

services/
└── weather.ts             # Weather API integration

components/
└── [existing components]  # Themed UI components
```

## 🎯 How to Play

### Classic Mode
1. A random city is displayed
2. Guess the current temperature in Celsius
3. Get within 2°C to score a point
4. Track your accuracy over time

### Party Mode
1. Pass the phone around the group
2. Each player guesses the temperature
3. Within 2°C? Everyone else drinks! 🎉
4. More than 2°C off? You drink! 😅

## 🌍 Cities Database

The app includes 50+ major cities from:
- North America (8 cities)
- South America (6 cities)
- Europe (10 cities)
- Asia (12 cities)
- Africa (6 cities)
- Oceania (6 cities)

**To add more cities**: Edit `data/cities.ts` and add entries to the `CITIES` array.

## 🔧 Customization

### Change Temperature Tolerance
In `app/game.tsx`, line 57:
```typescript
const isCorrect = difference <= 2; // Change 2 to your desired tolerance
```

### Add More Cities
In `data/cities.ts`, add to the `CITIES` array:
```typescript
{ city: 'Your City', country: 'Country', lat: 0.0, lon: 0.0, continent: 'Continent' }
```

### Customize Colors
Main colors used:
- Primary Blue: `#4A90E2`
- Party Pink: `#E24A90`
- Success Green: `#50C878`
- Warning Yellow: `#FFC107`

## 🎨 Future Enhancements

- [ ] 3D globe visualization using react-native-svg or expo-gl
- [ ] Leaderboards with AsyncStorage or Firebase
- [ ] Real-time multiplayer
- [ ] Achievements system
- [ ] Difficulty levels
- [ ] Regional filtering
- [ ] Sound effects
- [ ] Haptic feedback
- [ ] Temperature unit conversion (Celsius/Fahrenheit)
- [ ] Historical temperature data

## 📦 Dependencies

Core dependencies already in package.json:
- expo
- react-native
- expo-router
- @expo/vector-icons

## 🐛 Troubleshooting

### "Failed to load city data"
- Check your internet connection
- Verify your weather API key is correct
- The app will fall back to mock data if API fails

### Cities not loading
- Ensure `data/cities.ts` is properly imported
- Check that the cities array is exported correctly

## 📝 License

Created for personal use. Weather data provided by OpenWeatherMap.

---

**Have fun playing GeoDrink! 🌍🍺**
