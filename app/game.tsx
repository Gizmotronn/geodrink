import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { useTheme } from '../contexts/ThemeContext';
import { CITIES, City } from '../data/cities';
import { loadSounds, playCorrectSound, playWrongSound, unloadSounds } from '../services/audio';
import { getCurrentTemperature } from '../services/weather';
import { celsiusToFahrenheit, fahrenheitToCelsius, getTempUnit, updateGameStats } from '../utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  // Remove timer and timeBonus

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

  const [cityOrder, setCityOrder] = useState<CityData[]>([]); // Pre-generated unique cities

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
    setCityData(cities[0]);
  };

  const loadTempUnit = async () => {
    const unit = await getTempUnit();
    setTempUnit(unit);
  };

  const startTimer = () => {
    startTimeRef.current = Date.now();
    setTimer(0);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    timerIntervalRef.current = setInterval(() => {
      setTimer(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 100);
  };

  const stopTimer = (): number => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    return (Date.now() - startTimeRef.current) / 1000;
  };

  const loadNewCity = async () => {
    if (currentCityIndex > totalCities) {
      setGameState('roundComplete');
      return;
    }
    setCityData(cityOrder[currentCityIndex - 1]);
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

    // Remove timeInSeconds and timeBonus
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

    // End round if last city
    if (currentCityIndex >= totalCities) {
      setGameState('roundComplete');
    } else {
      setGameState('revealed');
    }
  };

  const handleNextCity = () => {
    if (mode === 'party') {
      // Advance to next player/city
      if (currentCityIndex < totalCities) {
        setCurrentCityIndex(prev => prev + 1);
        setCurrentPlayerIndex((prev) => (prev + 1) % playerCount);
        loadNewCity();
      } else {
        setCurrentCityIndex(prev => prev + 1);
        setGameState('roundComplete');
      }
    } else {
      // Classic mode
      if (currentCityIndex < totalCities) {
        setCurrentCityIndex(prev => prev + 1);
        loadNewCity();
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
    //
    if (cityOrder.length > 0) setCityData(cityOrder[0]);
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
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.container} edges={['top']}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <ThemedText style={styles.loadingText}>Loading city...</ThemedText>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (gameState === 'roundComplete') {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.container} edges={['top']}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.completeContainer}>
              <Ionicons name="trophy" size={80} color="#FFD700" />
              <Text style={[styles.largeTitle, { color: isDark ? '#FFF' : '#000' }]}>Round Complete!</Text>
              <View style={styles.finalScoreCard}>
                <Text style={[styles.mediumText, { color: isDark ? '#FFF' : '#000' }]}>Final Score</Text>
                {mode === 'party' ? (
                  <View style={styles.scoreRow}>
                    {playerNames.map((name, idx) => (
                      <View key={name} style={styles.scoreColumn}>
                        <Text style={[styles.smallText, { color: isDark ? '#AAA' : '#666', fontWeight: '700' }]}>{name}</Text>
                        <Text style={[styles.largeNumber, { color: '#E24A90' }]}>{playerScores[idx]}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.scoreRow}>
                    <View style={styles.scoreColumn}>
                      <Ionicons name="checkmark-circle" size={40} color="#50C878" />
                      <Text style={[styles.largeNumber, { color: '#50C878' }]}>{score.correct}</Text>
                      <Text style={[styles.smallText, { color: isDark ? '#CCC' : '#666' }]}>Correct</Text>
                    </View>
                    <View style={styles.scoreColumn}>
                      <Ionicons name="close-circle" size={40} color="#FF6B6B" />
                      <Text style={[styles.largeNumber, { color: '#FF6B6B' }]}>{score.incorrect}</Text>
                      <Text style={[styles.smallText, { color: isDark ? '#CCC' : '#666' }]}>Wrong</Text>
                    </View>
                  </View>
                )}
                {mode === 'party' ? null : (
                  <Text style={[styles.accuracyText, { color: isDark ? '#FFF' : '#000' }]}> 
                    Accuracy: {Math.round((score.correct / totalCities) * 100)}%
                  </Text>
                )}
              </View>
              <Pressable style={styles.secondaryButton} onPress={handleExitToHome}>
                <Ionicons name="home" size={24} color="#4A90E2" />
                <Text style={[styles.buttonText, { color: '#4A90E2' }]}>Exit to Home</Text>
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
        >
          {/* Header */}
          <View style={styles.topBar}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={28} color="#4A90E2" />
            </Pressable>
            <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#000' }]}> 
              {mode === 'party' ? 'Party Mode' : 'Classic Mode'}
            </Text>
            <View style={{ width: 44 }} />
          </View>

          {/* Show current player in party mode */}
          {mode === 'party' && (
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#E24A90' }}>
                {currentPlayerName}'s turn
              </Text>
              <Text style={{ fontSize: 15, color: '#888', marginTop: 2 }}>
                ({currentCityIndex} / {totalCities})
              </Text>
            </View>
          )}

          {/* City Card */}
          {cityData && (
            <View style={styles.cityCard}>
              <Ionicons name="location" size={50} color="#4A90E2" />
              <Text style={[styles.cityTitle, { color: isDark ? '#FFF' : '#000' }]}> 
                {cityData.city}
              </Text>
              <Text style={[styles.countryText, { color: isDark ? '#AAA' : '#666' }]}> 
                {cityData.country}
              </Text>
            </View>
          )}

          {/* Question */}
          <View style={styles.questionSection}>
            <Text style={[styles.questionText, { color: isDark ? '#FFF' : '#000' }]}> 
              What is the current temperature?
            </Text>
            {/* No timer or bonus UI */}
          </View>

          {/* Input or Result */}
          {gameState === 'playing' ? (
            <View style={styles.inputSection}>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.temperatureInput, { color: isDark ? '#FFF' : '#000' }]}
                  value={userGuess}
                  onChangeText={(text) => {
                    const filtered = text.replace(/[^0-9-]/g, '');
                    if (filtered === '-' || (filtered.startsWith('-') && !filtered.slice(1).includes('-') && /^-?\d*$/.test(filtered))) {
                      setUserGuess(filtered);
                    } else if (/^\d*$/.test(filtered)) {
                      setUserGuess(filtered);
                    }
                  }}
                  keyboardType="number-pad"
                  placeholder="--"
                  placeholderTextColor="#999"
                  autoFocus
                />
                <Text style={[styles.unitText, { color: isDark ? '#AAA' : '#666' }]}> 
                  °{tempUnit}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.resultSection}>
              <Text style={[styles.resultText, { color: isDark ? '#FFF' : '#000' }]}> 
                {getResultMessage()}
              </Text>
              <View style={styles.comparisonCard}>
                <View style={styles.comparisonItem}>
                  <Text style={[styles.smallText, { color: isDark ? '#AAA' : '#666' }]}>Your Guess</Text>
                  <Text style={[styles.tempNumber, { color: isDark ? '#FFF' : '#000' }]}> 
                    {userGuess}°{tempUnit}
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={28} color="#666" />
                <View style={styles.comparisonItem}>
                  <Text style={[styles.smallText, { color: isDark ? '#AAA' : '#666' }]}>Actual</Text>
                  <Text style={[styles.tempNumber, { color: isDark ? '#FFF' : '#000' }]}> 
                    {tempUnit === 'C' 
                      ? cityData?.temperature 
                      : Math.round(celsiusToFahrenheit(cityData?.temperature || 0))}°{tempUnit}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Action Button */}
          {gameState === 'playing' ? (
            <Pressable
              style={[styles.primaryButton, !userGuess && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={!userGuess}
            >
              <Text style={styles.buttonText}>Submit Guess</Text>
            </Pressable>
          ) : (
            // Only show Next City if not at the end in classic mode
            (mode === 'classic' && currentCityIndex >= totalCities) ? null : (
              <Pressable style={styles.primaryButton} onPress={handleNextCity}>
                <Text style={styles.buttonText}>
                  {mode === 'classic' && currentCityIndex < totalCities
                    ? `Next City (${currentCityIndex}/${totalCities})`
                    : 'Next City'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </Pressable>
            )
          )}

          {/* Score at Bottom */}
          <View style={styles.scoreCard}>
            {mode === 'party' ? (
              playerNames.map((name, idx) => (
                <View key={name} style={styles.scoreItem}>
                  <Text style={[styles.smallText, { color: isDark ? '#AAA' : '#666' }]}>{name}</Text>
                  <Text style={styles.scoreNumber}>{playerScores[idx]}</Text>
                </View>
              ))
            ) : (
              <>
                <View style={styles.scoreItem}>
                  <Text style={[styles.smallText, { color: isDark ? '#AAA' : '#666' }]}>Correct</Text>
                  <Text style={styles.scoreNumber}>{score.correct}</Text>
                </View>
                <View style={styles.scoreItem}>
                  <Text style={[styles.smallText, { color: isDark ? '#AAA' : '#666' }]}>Wrong</Text>
                  <Text style={styles.scoreNumber}>{score.incorrect}</Text>
                </View>
                {mode === 'classic' && (
                  <View style={styles.scoreItem}>
                    <Text style={[styles.smallText, { color: isDark ? '#AAA' : '#666' }]}>Progress</Text>
                    <Text style={styles.scoreNumber}>{currentCityIndex - 1}/{totalCities}</Text>
                  </View>
                )}
              </>
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  cityCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(74, 144, 226, 0.08)',
    borderRadius: 20,
    marginBottom: 24,
  },
  cityTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 12,
    textAlign: 'center',
  },
  countryText: {
    fontSize: 18,
    marginTop: 6,
    textAlign: 'center',
  },
  questionSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: 20,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  bonusText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#50C878',
  },
  inputSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  temperatureInput: {
    fontSize: 48,
    fontWeight: '800',
    textAlign: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#4A90E2',
    minWidth: 140,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  unitText: {
    fontSize: 36,
    fontWeight: '600',
  },
  resultSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  comparisonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 20,
    backgroundColor: 'rgba(128, 128, 128, 0.08)',
    borderRadius: 16,
  },
  comparisonItem: {
    alignItems: 'center',
  },
  tempNumber: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#4A90E2',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 16,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  disabledButton: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  scoreCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(74, 144, 226, 0.08)',
    borderRadius: 16,
    marginTop: 8,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#4A90E2',
    marginTop: 6,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 18,
    fontWeight: '600',
  },
  largeTitle: {
    fontSize: 36,
    fontWeight: '800',
    marginVertical: 16,
    textAlign: 'center',
  },
  largeNumber: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 8,
  },
  completeContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  finalScoreCard: {
    width: '100%',
    padding: 24,
    backgroundColor: 'rgba(74, 144, 226, 0.08)',
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 24,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 40,
    marginVertical: 20,
  },
  scoreColumn: {
    alignItems: 'center',
  },
  accuracyText: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
  },
});
