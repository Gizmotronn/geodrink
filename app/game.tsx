import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { City, getRandomCity } from '@/data/cities';
import { getCurrentTemperature } from '@/services/weather';
import { celsiusToFahrenheit, fahrenheitToCelsius, getTempUnit, updateGameStats } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';

interface CityData extends City {
  temperature: number;
}

export default function GameScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [userGuess, setUserGuess] = useState('');
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<'playing' | 'revealed'>('playing');
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [timer, setTimer] = useState(0);
  const [timeBonus, setTimeBonus] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    initGame();
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
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
    setLoading(true);
    setGameState('playing');
    setUserGuess('');
    setTimeBonus(null);
    
    try {
      const randomCity = getRandomCity();
      const temperature = await getCurrentTemperature(randomCity.lat, randomCity.lon);
      
      setCityData({
        ...randomCity,
        temperature,
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
    } else {
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    // Save stats
    await updateGameStats(differenceCelsius, timeInSeconds);
  };

  const getResultMessage = () => {
    if (!cityData || !userGuess) return '';
    
    const guess = parseFloat(userGuess);
    const actualTempCelsius = cityData.temperature;
    const guessTempCelsius = tempUnit === 'F' ? fahrenheitToCelsius(guess) : guess;
    const differenceCelsius = Math.abs(guessTempCelsius - actualTempCelsius);
    
    // Calculate difference in display unit (for Fahrenheit, just show the absolute difference between F values)
    const actualTempDisplay = tempUnit === 'F' ? celsiusToFahrenheit(actualTempCelsius) : actualTempCelsius;
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
        return `❌ Wrong by ${differenceDisplay.toFixed(1)}°${tempUnit}`;
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

  return (
    <ThemedView style={styles.container}>
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
            style={styles.input}
            value={userGuess}
            onChangeText={setUserGuess}
            keyboardType="numeric"
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
                  ? cityData?.temperature.toFixed(1) 
                  : celsiusToFahrenheit(cityData?.temperature || 0).toFixed(1)}°{tempUnit}
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
            onPress={loadNewCity}
          >
            <ThemedText style={styles.buttonText}>Next City</ThemedText>
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
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
    marginBottom: 30,
    paddingVertical: 15,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 10,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  cityContainer: {
    alignItems: 'center',
    marginVertical: 30,
    padding: 20,
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
    borderRadius: 15,
  },
  cityName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  countryName: {
    fontSize: 18,
    opacity: 0.7,
    marginTop: 5,
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  question: {
    fontSize: 20,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 40,
  },
  input: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#4A90E2',
    minWidth: 120,
    paddingVertical: 10,
  },
  unitLabel: {
    fontSize: 36,
    fontWeight: '500',
    opacity: 0.7,
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  resultMessage: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
  },
  temperatureComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    padding: 20,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: 15,
  },
  tempItem: {
    alignItems: 'center',
  },
  tempLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 5,
  },
  tempValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#50C878',
    paddingVertical: 18,
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
});