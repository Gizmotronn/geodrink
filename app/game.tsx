import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { useTheme } from '../contexts/ThemeContext';
import { Colors } from '../constants/theme';
import { CITIES, City } from '../data/cities';
import { loadSounds, playCorrectSound, playWrongSound, unloadSounds } from '../services/audio';
import { getCurrentTemperature } from '../services/weather';
import { celsiusToFahrenheit, fahrenheitToCelsius, getTempUnit, updateGameStats } from '../utils/storage';
import { getThemeStyles, toRgba } from '../utils/theme-colors';
import { gameStyles } from './game.styles';

interface CityData extends City {
  temperature: number;
}

export default function GameScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { mode, playerCount: playerCountParam, names: namesParam } = useLocalSearchParams<{ mode: string, playerCount?: string, names?: string }>();
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [userGuess, setUserGuess] = useState('');
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<'playing' | 'revealed' | 'roundComplete'>('playing');
  // Party mode state
  const playerCount = mode === 'party' && playerCountParam ? parseInt(playerCountParam, 10) : 1;
  const playerNames: string[] = mode === 'party' && namesParam ? JSON.parse(namesParam) : ['Player 1'];
  const totalCities = mode === 'party' ? 10 * playerCount : 10;
  const [currentCityIndex, setCurrentCityIndex] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0); // 0-based
  const [playerScores, setPlayerScores] = useState<number[]>(Array(playerCount).fill(0));
  const [score, setScore] = useState({ correct: 0, incorrect: 0 }); // legacy/classic
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const inputRef = useRef<TextInput>(null);

  const colors = isDark ? Colors.dark : Colors.light;
  const themeStyles = getThemeStyles(isDark);
  const styles = gameStyles;

  const [cityOrder, setCityOrder] = useState<CityData[]>([]); // Pre-generated unique cities

  useEffect(() => {
    const runInit = async () => {
      await initGame();
    };
    runInit();
    loadSounds();
    return () => {
      unloadSounds();
    };
  }, []);

  // Load the first city once cityOrder is populated
  useEffect(() => {
    if (cityOrder.length > 0 && !cityData && currentCityIndex === 1 && gameState === 'playing') {
      const firstCity = cityOrder[0];
      setCityData(firstCity);
      setLoading(false);
    }
  }, [cityOrder, cityData, currentCityIndex, gameState]);

  const getUniqueRandomCities = (count: number): City[] => {
    const shuffled = [...CITIES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const initGame = async () => {
    await loadTempUnit();
    // Pre-generate unique cities for all modes
    const uniqueCities = getUniqueRandomCities(totalCities);
    const cities: CityData[] = [];
    for (let i = 0; i < uniqueCities.length; i++) {
      const city = uniqueCities[i];
      const temperature = await getCurrentTemperature(city.lat, city.lon);
      cities.push({ ...city, temperature: Math.round(temperature) });
    }
    setCityOrder(cities);
    // The useEffect will handle setting the first city
  };

  const loadTempUnit = async () => {
    const unit = await getTempUnit();
    setTempUnit(unit);
  };

  const loadNewCity = async (cityIndex?: number) => {
    const indexToUse = cityIndex !== undefined ? cityIndex : currentCityIndex;
    if (indexToUse > totalCities) {
      setGameState('roundComplete');
      return;
    }
    setCityData(cityOrder[indexToUse - 1]);
    setGameState('playing');
    setUserGuess('');
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!userGuess || !cityData) return;

    const guess = parseFloat(userGuess);
    if (isNaN(guess)) {
      Alert.alert('Invalid Input', 'Please enter a valid number');
      return;
    }

    const actualTempCelsius = cityData.temperature;
    const guessTempCelsius = tempUnit === 'F' ? fahrenheitToCelsius(guess) : guess;
    const differenceCelsius = Math.abs(guessTempCelsius - actualTempCelsius);
    const threshold = tempUnit === 'F' ? (6 * 5/9) : 2;
    const isCorrect = differenceCelsius <= threshold;



    if (mode === 'party') {
      // Update current player's score
      setPlayerScores(prev => {
        const updated = [...prev];
        if (isCorrect) updated[currentPlayerIndex] += 1;
        return updated;
      });
      if (isCorrect) playCorrectSound(); else playWrongSound();
    } else {
      // Classic mode
      if (isCorrect) {
        setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
        playCorrectSound();
      } else {
        setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
        playWrongSound();
      }
      await updateGameStats(differenceCelsius, 0);
    }

    // Always show result first, regardless of whether it's the last city
    setGameState('revealed');
  };

  const handleNextCity = () => {
    if (mode === 'party') {
      // Advance to next player/city
      if (currentCityIndex < totalCities) {
        const nextIndex = currentCityIndex + 1;
        setCurrentCityIndex(nextIndex);
        setCurrentPlayerIndex((prev) => (prev + 1) % playerCount);
        loadNewCity(nextIndex);
      } else {
        setCurrentCityIndex(prev => prev + 1);
        setGameState('roundComplete');
      }
    } else {
      // Classic mode
      if (currentCityIndex < totalCities) {
        const nextIndex = currentCityIndex + 1;
        setCurrentCityIndex(nextIndex);
        loadNewCity(nextIndex);
      } else {
        setGameState('roundComplete');
      }
    }
  };

  const handleContinueRound = () => {
    setScore({ correct: 0, incorrect: 0 });
    setCurrentCityIndex(1);
    setCurrentPlayerIndex(0);
    setPlayerScores(Array(playerCount).fill(0));
    setGameState('playing');
    setCityData(null);
    setUserGuess('');
    // Load the first city for the new round
    loadNewCity();
  };

  const handleExitToHome = () => {
    router.push('/');
  };

  const getResultMessage = () => {
    if (!cityData || !userGuess) return '';
    
    const guess = parseFloat(userGuess);
    const actualTempCelsius = cityData.temperature;
    const guessTempCelsius = tempUnit === 'F' ? fahrenheitToCelsius(guess) : guess;
    const differenceCelsius = Math.abs(guessTempCelsius - actualTempCelsius);
    
    const actualTempDisplay = tempUnit === 'F' ? Math.round(celsiusToFahrenheit(actualTempCelsius)) : actualTempCelsius;
    const differenceDisplay = Math.abs(guess - actualTempDisplay);
    
    const threshold = tempUnit === 'F' ? (6 * 5/9) : 2;
    const isCorrect = differenceCelsius <= threshold;

    if (mode === 'party') {
      if (isCorrect) {
        return `🎉 Within ${tempUnit === 'F' ? '6°F' : '2°C'}! Everyone else drinks!`;
      } else {
        return `😅 More than ${tempUnit === 'F' ? '6°F' : '2°C'} off. You drink!`;
      }
    } else {
      if (isCorrect) {
        return `✅ Correct! Within ${tempUnit === 'F' ? '6°F' : '2°C'}!`;
      } else {
        return `❌ Wrong by ${Math.round(differenceDisplay)}°${tempUnit}`;
      }
    }
  };

  // Show current player in party mode
  const currentPlayerName = mode === 'party' ? playerNames[currentPlayerIndex] : undefined;

  if (loading && !cityData) {
    const colors = isDark ? Colors.dark : Colors.light;
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.container} edges={['top']}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <ThemedText style={styles.loadingText}>Loading city...</ThemedText>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (gameState === 'roundComplete') {
    const themeStyles = getThemeStyles(isDark);
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.container} edges={['top']}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.completeContainer}>
              <Ionicons name="trophy" size={80} color={colors.chart2} />
              <Text style={[styles.largeTitle, { color: colors.foreground }]}>Round Complete!</Text>
              <View style={[styles.finalScoreCard, { backgroundColor: themeStyles.primaryBackgroundLight }]}>
                <Text style={[styles.mediumText, { color: colors.foreground }]}>Final Score</Text>
                {mode === 'party' ? (
                  <View style={styles.scoreRow}>
                    {playerNames.map((name, idx) => (
                      <View key={name} style={styles.scoreColumn}>
                        <Text style={[styles.smallText, { color: colors.mutedForeground, fontWeight: '700' }]}>{name}</Text>
                        <Text style={[styles.largeNumber, { color: colors.secondary }]}>{playerScores[idx]}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.scoreRow}>
                    <View style={styles.scoreColumn}>
                      <Ionicons name="checkmark-circle" size={40} color={colors.chart3} />
                      <Text style={[styles.largeNumber, { color: colors.chart3 }]}>{score.correct}</Text>
                      <Text style={[styles.smallText, { color: colors.mutedForeground }]}>Correct</Text>
                    </View>
                    <View style={styles.scoreColumn}>
                      <Ionicons name="close-circle" size={40} color={colors.destructive} />
                      <Text style={[styles.largeNumber, { color: colors.destructive }]}>{score.incorrect}</Text>
                      <Text style={[styles.smallText, { color: colors.mutedForeground }]}>Wrong</Text>
                    </View>
                  </View>
                )}
                {mode === 'party' ? null : (
                  <Text style={[styles.accuracyText, { color: colors.foreground }]}> 
                    Accuracy: {Math.round((score.correct / totalCities) * 100)}%
                  </Text>
                )}
              </View>
              <Pressable style={styles.secondaryButton} onPress={handleExitToHome}>
                <Ionicons name="home" size={24} color={colors.primary} />
                <Text style={[styles.buttonText, { color: colors.primary }]}>Exit to Home</Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets={true}
          contentInsetAdjustmentBehavior="automatic"
        >
          {/* Header */}
          <View style={styles.topBar}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={28} color={isDark ? Colors.dark.primary : Colors.light.primary} />
            </Pressable>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}> 
              {mode === 'party' ? 'Party Mode' : 'Classic Mode'}
            </Text>
            <View style={{ width: 44 }} />
          </View>

          {/* Show current player in party mode */}
          {mode === 'party' && (
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: colors.secondary }}>
                {currentPlayerName}&apos;s turn
              </Text>
              <Text style={{ fontSize: 15, color: '#888', marginTop: 2 }}>
                ({currentCityIndex} / {totalCities})
              </Text>
            </View>
          )}

          {/* City Card */}
          {cityData && (
            <View style={[styles.cityCard, { backgroundColor: toRgba(colors.primary, 0.05) }]}>
              <Ionicons name="location" size={50} color={colors.primary} />
              <Text style={[styles.cityTitle, { color: colors.foreground }]}> 
                {cityData.city}
              </Text>
              <Text style={[styles.countryText, { color: colors.mutedForeground }]}> 
                {cityData.country}
              </Text>
            </View>
          )}

          {/* Question */}
          <View style={styles.questionSection}>
            <Text style={[styles.questionText, { color: colors.foreground }]}> 
              What is the current temperature?
            </Text>
            {/* No timer or bonus UI */}
          </View>

          {/* Input or Result */}
          {gameState === 'playing' ? (
            <View style={styles.inputSection}>
              <View style={styles.inputRow}>
                <TextInput
                  ref={inputRef}
                  style={[styles.temperatureInput, { color: colors.foreground, borderBottomColor: colors.primary }]}
                  value={userGuess}
                  onChangeText={(text) => {
                    // Allow negative sign, digits, and handle proper negative number formatting
                    let filtered = text.replace(/[^0-9-]/g, '');
                    
                    // Handle negative sign rules
                    if (filtered.includes('-')) {
                      // Only allow negative sign at the beginning
                      const parts = filtered.split('-');
                      if (parts[0] === '' && parts.length === 2) {
                        // Valid negative number format: -123
                        filtered = '-' + parts[1].replace(/\D/g, '');
                      } else {
                        // Remove all negative signs and keep only digits
                        filtered = filtered.replace(/-/g, '');
                      }
                    }
                    
                    // Set the cleaned value
                    setUserGuess(filtered);
                  }}
                  keyboardType="number-pad"
                  placeholder="--"
                  placeholderTextColor={colors.mutedForeground}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    inputRef.current?.blur();
                    if (userGuess) {
                      handleSubmit();
                    }
                  }}
                />
                <Text style={[styles.unitText, { color: colors.mutedForeground }]}> 
                  °{tempUnit}
                </Text>
              </View>
              
              {/* Custom minus button for iOS since numeric keyboard doesn't have one */}
              <Pressable 
                style={[styles.minusButton, { backgroundColor: toRgba(colors.muted, 0.5) }]}
                onPress={() => {
                  if (userGuess.startsWith('-')) {
                    // Remove minus sign
                    setUserGuess(userGuess.substring(1));
                  } else if (userGuess) {
                    // Add minus sign
                    setUserGuess('-' + userGuess);
                  } else {
                    // Start with minus
                    setUserGuess('-');
                  }
                }}
              >
                <Text style={[styles.minusButtonText, { color: colors.foreground }]}>
                  {userGuess.startsWith('-') ? '✕ Remove Minus' : '➖ Add Minus'}
                </Text>
              </Pressable>

              {/* Submit button moved here so it's always visible */}
              <Pressable
                style={[styles.submitButton, !userGuess && styles.disabledButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  inputRef.current?.blur();
                  handleSubmit();
                }}
                disabled={!userGuess}
              >
                <Text style={[styles.submitButtonText, { color: colors.primaryForeground }]}>Submit Guess</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.resultSection}>
              <Text style={[styles.resultText, { color: colors.foreground }]}> 
                {getResultMessage()}
              </Text>
              <View style={styles.comparisonCard}>
                <View style={styles.comparisonItem}>
                  <Text style={[styles.smallText, { color: colors.mutedForeground }]}>Your Guess</Text>
                  <Text style={[styles.tempNumber, { color: colors.foreground }]}>
                    {userGuess}°{tempUnit}
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={28} color={colors.primary} />
                <View style={styles.comparisonItem}>
                  <Text style={[styles.smallText, { color: colors.mutedForeground }]}>Actual</Text>
                  <Text style={[styles.tempNumber, { color: colors.foreground }]}>
                    {tempUnit === 'C' 
                      ? cityData?.temperature 
                      : Math.round(celsiusToFahrenheit(cityData?.temperature || 0))}°{tempUnit}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Action Button - only for non-playing states */}
          {gameState !== 'playing' && (
            // Only show Next City if not at the end in classic mode
            (mode === 'classic' && currentCityIndex >= totalCities) ? null : (
              <Pressable style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={handleNextCity}>
                <Text style={[styles.buttonText, { color: colors.primaryForeground }]}>
                  {mode === 'classic' && currentCityIndex < totalCities
                    ? `Next City (${currentCityIndex}/${totalCities})`
                    : 'Next City'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color={colors.primaryForeground} />
              </Pressable>
            )
          )}

          {/* Score at Bottom */}
          <View style={[styles.scoreCard, { backgroundColor: themeStyles.mutedBackground }]}>
            {mode === 'party' ? (
              playerNames.map((name, idx) => (
                <View key={name} style={styles.scoreItem}>
                  <Text style={[styles.smallText, { color: isDark ? '#AAA' : '#666' }]}>{name}</Text>
                  <Text style={[styles.scoreNumber, { color: colors.primary }]}>{playerScores[idx]}</Text>
                </View>
              ))
            ) : (
              <>
                <View style={styles.scoreItem}>
                  <Text style={[styles.smallText, { color: isDark ? '#AAA' : '#666' }]}>Correct</Text>
                  <Text style={[styles.scoreNumber, { color: colors.primary }]}>{score.correct}</Text>
                </View>
                <View style={styles.scoreItem}>
                  <Text style={[styles.smallText, { color: isDark ? '#AAA' : '#666' }]}>Wrong</Text>
                  <Text style={styles.scoreNumber}>{score.incorrect}</Text>
                </View>
                {mode === 'classic' && (
                  <View style={styles.scoreItem}>
                    <Text style={[styles.smallText, { color: isDark ? '#AAA' : '#666' }]}>Progress</Text>
                    <Text style={styles.scoreNumber}>{currentCityIndex}/{totalCities}</Text>
                  </View>
                )}
              </>
            )}
          </View>

        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

