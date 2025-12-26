import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/contexts/ThemeContext';
import { City, getRandomCity } from '@/data/cities';
import { loadSounds, playCorrectSound, playWrongSound, unloadSounds } from '@/services/audio';
import { getCurrentTemperature } from '@/services/weather';
import { celsiusToFahrenheit, fahrenheitToCelsius, getTempUnit, updateGameStats } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CityData extends City {
  temperature: number;
}

export default function GameScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [userGuess, setUserGuess] = useState('');
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<'playing' | 'revealed' | 'roundComplete'>('playing');
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [currentCityIndex, setCurrentCityIndex] = useState(1);
  const [totalCities] = useState(10);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [timer, setTimer] = useState(0);
  const [timeBonus, setTimeBonus] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
      const runInit = async () => {
        await initGame();
      };
      runInit();
      loadSounds();
      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
        unloadSounds();
      };
    }, []);

  const initGame = async () => {
    await loadTempUnit();
    await loadNewCity();
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
    if (mode === 'classic' && currentCityIndex > totalCities) {
      setGameState('roundComplete');
      return;
    }

    setLoading(true);
    setGameState('playing');
    setUserGuess('');
    setTimeBonus(null);
    
    try {
      const randomCity = getRandomCity();
      const temperature = await getCurrentTemperature(randomCity.lat, randomCity.lon);
      
      setCityData({
        ...randomCity,
        temperature: Math.round(temperature),
      });
      startTimer();
    } catch {
      Alert.alert('Error', 'Failed to load city data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!userGuess || !cityData) return;

    const guess = parseFloat(userGuess);
    if (isNaN(guess)) {
      Alert.alert('Invalid Input', 'Please enter a valid number');
      return;
    }

    const timeInSeconds = stopTimer();
    
    const actualTempCelsius = cityData.temperature;
    const guessTempCelsius = tempUnit === 'F' ? fahrenheitToCelsius(guess) : guess;
    
    const differenceCelsius = Math.abs(guessTempCelsius - actualTempCelsius);
    
    const threshold = tempUnit === 'F' ? (6 * 5/9) : 2;
    const isCorrect = differenceCelsius <= threshold;

    let bonus = 0;
    if (mode === 'party') {
      if (timeInSeconds <= 2) {
        bonus = 25;
      } else if (timeInSeconds <= 5) {
        bonus = 10;
      }
    }
    setTimeBonus(bonus);

    // Update score first
    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
      playCorrectSound();
    } else {
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      playWrongSound();
    }

    await updateGameStats(differenceCelsius, timeInSeconds);

    // If this is the last city in classic mode, end the round immediately
    if (mode === 'classic' && currentCityIndex >= totalCities) {
      setGameState('roundComplete');
    } else {
      setGameState('revealed');
    }
  };

  const handleNextCity = () => {
    if (mode === 'classic') {
      // Only allow advancing if not at the end
      if (currentCityIndex < totalCities) {
        setCurrentCityIndex(prev => prev + 1);
        loadNewCity();
      } else {
        setGameState('roundComplete');
      }
    } else {
      loadNewCity();
    }
  };

  const handleContinueRound = () => {
    setScore({ correct: 0, incorrect: 0 });
    setCurrentCityIndex(1);
    setGameState('playing');
    setCityData(null);
    setUserGuess('');
    setTimeBonus(null);
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

    const bonusText = timeBonus ? ` (+${timeBonus}% time bonus!)` : '';
    
    if (mode === 'party') {
      if (isCorrect) {
        return `🎉 Within ${tempUnit === 'F' ? '6°F' : '2°C'}! Everyone else drinks!${bonusText}`;
      } else {
        return `😅 More than ${tempUnit === 'F' ? '6°F' : '2°C'} off. You drink!`;
      }
    } else {
      if (isCorrect) {
        return `✅ Correct! Within ${tempUnit === 'F' ? '6°F' : '2°C'}!${bonusText}`;
      } else {
        return `❌ Wrong by ${Math.round(differenceDisplay)}°${tempUnit}`;
      }
    }
  };

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
                <Text style={[styles.accuracyText, { color: isDark ? '#FFF' : '#000' }]}>
                  Accuracy: {Math.round((score.correct / totalCities) * 100)}%
                </Text>
              </View>

              <Pressable style={styles.primaryButton} onPress={handleContinueRound}>
                <Ionicons name="refresh" size={24} color="#FFF" />
                <Text style={styles.buttonText}>Play Again</Text>
              </Pressable>

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
            {gameState === 'playing' && (
              <View style={styles.timerBadge}>
                <Ionicons name="timer-outline" size={18} color="#666" />
                <Text style={styles.timerText}>{timer}s</Text>
                {timer <= 2 && <Text style={styles.bonusText}>+25% bonus!</Text>}
                {timer > 2 && timer <= 5 && <Text style={styles.bonusText}>+10% bonus</Text>}
              </View>
            )}
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
            mode === 'classic' && currentCityIndex >= totalCities ? null : (
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
