import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";
import { getRandomFunFact } from "../data/funFacts";
import { S } from "../styles";
import type { GameStats } from "../utils/storage";
import { getGameStats, getTempUnit, setTempUnit } from "../utils/storage";
const styles = S.home;

export default function HomeScreen() {
  const router = useRouter();
  const [tempUnit, setTempUnitState] = useState<'C' | 'F'>('C');
  const [stats, setStats] = useState<GameStats | null>(null);
  const [funFact, setFunFact] = useState<string>('');

  useEffect(() => {
    loadSettings();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Load a new fun fact each time the screen comes into focus
      setFunFact(getRandomFunFact());
    }, [])
  );

  const loadSettings = async () => {
    const unit = await getTempUnit();
    const gameStats = await getGameStats();
    setTempUnitState(unit);
    setStats(gameStats);
  };

  const toggleTempUnit = async () => {
    const newUnit = tempUnit === 'C' ? 'F' : 'C';
    setTempUnitState(newUnit);
    await setTempUnit(newUnit);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} bounces={false}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          GeoDrink
        </ThemedText>
            <ThemedText style={styles.subtitle}>TBC</ThemedText>
            <Pressable
              style={({ pressed }) => [styles.tempToggle, pressed && styles.buttonPressed]}
              onPress={toggleTempUnit}
            >
              <Ionicons name="thermometer-outline" size={20} color="#4A90E2" />
              <ThemedText style={styles.tempToggleText}>
                {tempUnit === 'C' ? '°C' : '°F'}
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.globeContainer}>
            <View style={styles.globe}>
              <Ionicons name="earth" size={100} color="#4A90E2" />
            </View>
            <ThemedText style={styles.globeLabel}>Geography</ThemedText>
          </View>

          <View style={styles.modesContainer}>
            <Pressable
              style={({ pressed }) => [styles.modeButton, styles.classicButton, pressed && styles.buttonPressed]}
              onPress={() => router.push('/game?mode=classic')}
            >
              <ThemedText style={styles.modeButtonText}>Classic Mode</ThemedText>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.modeButton, styles.partyButton, pressed && styles.buttonPressed]}
              onPress={() => router.push('/party-setup')}
            >
              <ThemedText style={styles.modeButtonText}>Party Mode</ThemedText>
            </Pressable>
          </View>

          <View style={styles.bottomButtons}>
            <Pressable
              style={({ pressed }) => [styles.infoButton, pressed && styles.infoButtonPressed]}
              onPress={() => router.push('/rules')}
            >
              <Ionicons name="book-outline" size={20} color="#666" />
              <ThemedText style={styles.infoButtonText}>Rules/Help</ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.infoButton, pressed && styles.infoButtonPressed]}
              onPress={() => router.push('/settings')}
            >
              <Ionicons name="settings-outline" size={20} color="#666" />
              <ThemedText style={styles.infoButtonText}>Settings</ThemedText>
            </Pressable>
          </View>

          {stats && stats.totalRounds > 0 && (
            <View style={styles.leaderboardContainer}>
              <ThemedText style={styles.leaderboardTitle}>Your Stats</ThemedText>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <ThemedText style={styles.statValue}>{Math.round(stats.averageScore)}°</ThemedText>
                  <ThemedText style={styles.statLabel}>Avg Difference</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText style={styles.statValue}>{Math.round(stats.timeWeightedScore)}°</ThemedText>
                  <ThemedText style={styles.statLabel}>Time-Weighted</ThemedText>
                </View>
              </View>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <ThemedText style={styles.statValue}>{stats.perfectAnswers}</ThemedText>
                  <ThemedText style={styles.statLabel}>Perfect (≤2°C)</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText style={styles.statValue}>{stats.totalRounds}</ThemedText>
                  <ThemedText style={styles.statLabel}>Total Rounds</ThemedText>
                </View>
              </View>
            </View>
          )}

          <View style={styles.funFactContainer}>
            <ThemedText style={styles.funFactLabel}>Fun Fact</ThemedText>
            <ThemedText style={styles.funFact}>{funFact}</ThemedText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}