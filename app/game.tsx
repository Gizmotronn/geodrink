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
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
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
  const [totalCities] = useState(10); // 10 cities per round for single player
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [timer, setTimer] = useState(0);
  const [timeBonus, setTimeBonus] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    initGame();
    loadSounds(); // Load sound effects
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      unloadSounds(); // Clean up sound effects
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
    // Check if we've completed 10 cities in single player mode
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
    
    // Always normalize to Celsius for comparison and storage
    const actualTempCelsius = cityData.temperature;
    const guessTempCelsius = tempUnit === 'F' ? fahrenheitToCelsius(guess) : guess;
    
    const differenceCelsius = Math.abs(guessTempCelsius - actualTempCelsius);
    
    // Correct threshold: 2°C or 6°F (6°F difference = 3.33°C difference)
    const threshold = tempUnit === 'F' ? (6 * 5/9) : 2;
    const isCorrect = differenceCelsius <= threshold;

    // Calculate time bonus (only for party mode)
    let bonus = 0;
    if (mode === 'party') {
      if (timeInSeconds <= 2) {
        bonus = 25;
      } else if (timeInSeconds <= 5) {
        bonus = 10;
      }
    }
    setTimeBonus(bonus);

    setGameState('revealed');

    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
      playCorrectSound(); // Play correct answer sound
    } else {
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      playWrongSound(); // Play wrong answer sound
    }

    // Save stats
    await updateGameStats(differenceCelsius, timeInSeconds);
  };

  const handleNextCity = () => {
    if (mode === 'classic') {
      setCurrentCityIndex(prev => prev + 1);
    }
    loadNewCity();
  };

  const handleContinueRound = () => {
    setScore({ correct: 0, incorrect: 0 });
    setCurrentCityIndex(1);
    setGameState('playing');
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
    
    // Calculate difference in display unit (for Fahrenheit, just show the absolute difference between F values)
    const actualTempDisplay = tempUnit === 'F' ? Math.round(celsiusToFahrenheit(actualTempCelsius)) : actualTempCelsius;
    const differenceDisplay = Math.abs(guess - actualTempDisplay);
    
    // Correct threshold: 2°C or 6°F (6°F difference = 3.33°C difference)
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
        <ActivityIndicator size="large" color="#4A90E2" />
        <ThemedText style={styles.loadingText}>Loading city...</ThemedText>
      </ThemedView>
    );
  }

  // Round Complete Screen
  if (gameState === 'roundComplete') {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.completeScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.completeContainer}>
              <Ionicons name="trophy" size={80} color="#FFD700" style={styles.trophyIcon} />
              <ThemedText style={styles.completeTitle}>Round Complete!</ThemedText>
              
              <View style={styles.finalScoreContainer}>
                <ThemedText style={styles.finalScoreLabel}>Final Score</ThemedText>
                <View style={styles.finalScoreRow}>
                  <View style={styles.finalScoreItem}>
                    <Ionicons name="checkmark-circle" size={40} color="#50C878" />
                    <ThemedText style={styles.finalScoreValue}>{score.correct}</ThemedText>
                    <ThemedText style={styles.finalScoreText}>Correct</ThemedText>
                  </View>
                  <View style={styles.finalScoreDivider} />
                  <View style={styles.finalScoreItem}>
                    <Ionicons name="close-circle" size={40} color="#FF6B6B" />
                    <ThemedText style={styles.finalScoreValue}>{score.incorrect}</ThemedText>
                    <ThemedText style={styles.finalScoreText}>Wrong</ThemedText>
                  </View>
                </View>
                <View style={styles.accuracyContainer}>
                  <ThemedText style={styles.accuracyLabel}>Accuracy</ThemedText>
                  <ThemedText style={styles.accuracyValue}>
                    {Math.round((score.correct / totalCities) * 100)}%
                  </ThemedText>
                </View>
              </View>

              <View style={styles.completeButtonsContainer}>
                <Pressable
                  style={({ pressed }) => [
                    styles.continueButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={handleContinueRound}
                >
                  <Ionicons name="refresh" size={24} color="#FFF" />
                  <ThemedText style={styles.continueButtonText}>Play Another Round</ThemedText>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.exitButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={handleExitToHome}
                >
                  <Ionicons name="home" size={24} color="#4A90E2" />
                  <ThemedText style={styles.exitButtonText}>Exit to Home</ThemedText>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4A90E2" />
        </Pressable>
        <ThemedText style={styles.modeTitle}>
          {mode === 'party' ? 'Party Mode' : 'Classic Mode'}
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      {/* Score */}
      <View style={styles.scoreContainer}>
        <View style={styles.scoreItem}>
          <ThemedText style={styles.scoreLabel}>Correct</ThemedText>
          <ThemedText style={styles.scoreValue}>{score.correct}</ThemedText>
        </View>
        <View style={styles.scoreItem}>
          <ThemedText style={styles.scoreLabel}>Wrong</ThemedText>
          <ThemedText style={styles.scoreValue}>{score.incorrect}</ThemedText>
        </View>
        {mode === 'classic' && (
          <View style={styles.scoreItem}>
            <ThemedText style={styles.scoreLabel}>Progress</ThemedText>
            <ThemedText style={styles.scoreValue}>{currentCityIndex - 1}/{totalCities}</ThemedText>
          </View>
        )}
      </View>

      {/* City Display */}
      {cityData && (
        <View style={styles.cityContainer}>
          <Ionicons name="location" size={40} color="#4A90E2" />
          <ThemedText style={styles.cityName}>{cityData.city}</ThemedText>
          <ThemedText style={styles.countryName}>{cityData.country}</ThemedText>
        </View>
      )}

      {/* Question */}
      <View style={styles.questionContainer}>
        <ThemedText style={styles.question}>
          What&apos;s the current temperature?
        </ThemedText>
        {gameState === 'playing' && (
          <View style={styles.timerContainer}>
            <Ionicons name="timer-outline" size={16} color="#666" />
            <ThemedText style={styles.timerText}>{timer}s</ThemedText>
            {timer <= 2 && <ThemedText style={styles.bonusText}>+25% bonus!</ThemedText>}
            {timer > 2 && timer <= 5 && <ThemedText style={styles.bonusText}>+10% bonus</ThemedText>}
          </View>
        )}
      </View>

      {/* Input or Result */}
      {gameState === 'playing' ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { color: isDark ? '#FFFFFF' : '#000000' }]}
            value={userGuess}
            onChangeText={(text) => {
              // Only allow whole numbers (positive and negative)
              const filtered = text.replace(/[^0-9-]/g, '');
              // Prevent multiple minus signs and ensure minus is only at start
              if (filtered === '-' || (filtered.startsWith('-') && !filtered.slice(1).includes('-') && /^-?\d*$/.test(filtered))) {
                setUserGuess(filtered);
              } else if (/^\d*$/.test(filtered)) {
                setUserGuess(filtered);
              }
            }}
            keyboardType="number-pad"
            placeholder="Enter temperature"
            placeholderTextColor="#999"
            autoFocus
          />
          <ThemedText style={styles.unitLabel}>°{tempUnit}</ThemedText>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <ThemedText style={styles.resultMessage}>{getResultMessage()}</ThemedText>
          <View style={styles.temperatureComparison}>
            <View style={styles.tempItem}>
              <ThemedText style={styles.tempLabel}>Your Guess</ThemedText>
              <ThemedText style={styles.tempValue}>{userGuess}°{tempUnit}</ThemedText>
            </View>
            <Ionicons name="arrow-forward" size={24} color="#666" />
            <View style={styles.tempItem}>
              <ThemedText style={styles.tempLabel}>Actual</ThemedText>
              <ThemedText style={styles.tempValue}>
                {tempUnit === 'C' 
                  ? cityData?.temperature 
                  : Math.round(celsiusToFahrenheit(cityData?.temperature || 0))}°{tempUnit}
              </ThemedText>
            </View>
          </View>
        </View>
      )}

      {/* Action Button */}
      <View style={styles.buttonContainer}>
        {gameState === 'playing' ? (
          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.buttonPressed,
              !userGuess && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!userGuess}
          >
            <ThemedText style={styles.buttonText}>Submit Guess</ThemedText>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.nextButton, pressed && styles.buttonPressed]}
            onPress={handleNextCity}
          >
            <ThemedText style={styles.buttonText}>
              {mode === 'classic' && currentCityIndex <= totalCities ? `Next City (${currentCityIndex}/${totalCities})` : 'Next City'}
            </ThemedText>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </Pressable>
        )}
      </View>

      {/* Hint */}
      {gameState === 'playing' && (
        <View style={styles.hintContainer}>
          <ThemedText style={styles.hint}>
            💡 Tip: Consider the hemisphere, season, and latitude!
          </ThemedText>
        </View>
      )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  completeScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 15,
    paddingTop: 5,
  },
  backButton: {
    padding: 8,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 10,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  cityContainer: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 15,
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
    borderRadius: 15,
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  countryName: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 25,
  },
  input: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#4A90E2',
    minWidth: 120,
    paddingVertical: 5,
    paddingHorizontal: 10,
    includeFontPadding: false,
  },
  unitLabel: {
    fontSize: 32,
    fontWeight: '500',
    opacity: 0.7,
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  resultMessage: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  temperatureComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 15,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: 12,
  },
  tempItem: {
    alignItems: 'center',
  },
  tempLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  tempValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#50C878',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  hintContainer: {
    padding: 15,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  hint: {
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.8,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    opacity: 0.7,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bonusText: {
    fontSize: 12,
    color: '#50C878',
    fontWeight: '600',
    marginLeft: 8,
  },
  completeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyIcon: {
    marginTop: 20,
  },
  completeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 30,
    lineHeight: 40,
    paddingTop: 5,
  },
  finalScoreContainer: {
    width: '100%',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
  },
  finalScoreLabel: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 28,
    paddingTop: 3,
  },
  finalScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  finalScoreItem: {
    alignItems: 'center',
    flex: 1,
  },
  finalScoreDivider: {
    width: 1,
    height: 60,
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
    marginHorizontal: 10,
  },
  finalScoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
    lineHeight: 44,
    paddingTop: 4,
  },
  finalScoreText: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
    lineHeight: 20,
    paddingTop: 2,
  },
  accuracyContainer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  accuracyLabel: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 8,
    lineHeight: 22,
    paddingTop: 2,
  },
  accuracyValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4A90E2',
    lineHeight: 48,
    paddingTop: 4,
  },
  completeButtonsContainer: {
    width: '100%',
    gap: 15,
  },
  continueButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  exitButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4A90E2',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  exitButtonText: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: '600',
  },
});