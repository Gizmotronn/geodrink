import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";
import { getRandomFunFact } from "../data/funFacts";
import { S } from "../styles";
import { Colors } from "../constants/theme";
import { useTheme } from "../contexts/ThemeContext";
import type { GameStats } from "../utils/storage";
import { getGameStats, getTempUnit, setTempUnit } from "../utils/storage";
const styles = S.home;

export default function HomeScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
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
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.headerBar}>
          <ThemedText style={styles.versionText}>v1.0</ThemedText>
          <Pressable
            style={({ pressed }) => [styles.settingsButton, pressed && styles.buttonPressed]}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={24} color={colors.foreground} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} bounces={false}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <ThemedText style={[styles.title, { color: colors.foreground }]}>
              Weathr
            </ThemedText>
          </View>

          {/* Weather/Location Widget */}
          <View style={[styles.weatherCard, { backgroundColor: colors.card, borderColor: colors.accent }]}>
            <View style={styles.weatherLeft}>
              <View style={[styles.weatherIcon, { backgroundColor: `${colors.accent}33` }]}>
                <Ionicons name="location-outline" size={24} color={colors.accent} />
              </View>
              <View>
                <ThemedText style={[styles.weatherSmallText, { color: colors.mutedForeground }]}>
                  Current Location
                </ThemedText>
                <ThemedText style={[styles.weatherLocationText, { color: colors.foreground }]}>
                  Auto-detected
                </ThemedText>
              </View>
            </View>
            <View style={styles.weatherRight}>
              <Ionicons name="thermometer-outline" size={20} color={colors.accent} />
              <ThemedText style={[styles.weatherTemp, { color: colors.foreground }]}>--°</ThemedText>
            </View>
          </View>


          {/* Mode Buttons */}
          <View style={styles.modesContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.modeButton,
                { backgroundColor: colors.primary, shadowColor: colors.primary },
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push('/game?mode=classic')}
            >
              <ThemedText style={[styles.modeButtonText, { color: colors.primaryForeground }]}>
                Classic Mode
              </ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.modeButton,
                { backgroundColor: colors.secondary, shadowColor: colors.secondary },
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push('/party-setup')}
            >
              <Ionicons name="people" size={20} color={colors.secondaryForeground} />
              <ThemedText style={[styles.modeButtonText, { color: colors.secondaryForeground }]}>
                Party Mode
              </ThemedText>
            </Pressable>
          </View>

          {/* Utility Buttons Grid */}
          <View style={styles.utilityButtonsGrid}>
            <Pressable
              style={({ pressed }) => [
                styles.utilityButton,
                { backgroundColor: colors.card, borderColor: colors.border },
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push('/rules')}
            >
              <Ionicons name="book-outline" size={20} color={colors.accent} />
              <ThemedText style={[styles.utilityButtonText, { color: colors.foreground }]}>
                Rules/Help
              </ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.utilityButton,
                { backgroundColor: colors.card, borderColor: colors.border },
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push('/settings')}
            >
              <Ionicons name="settings-outline" size={20} color={colors.accent} />
              <ThemedText style={[styles.utilityButtonText, { color: colors.foreground }]}>
                Settings
              </ThemedText>
            </Pressable>
          </View>

          {/* Fun Fact Card */}
          <View style={[styles.funFactContainer, { backgroundColor: colors.card, borderLeftColor: colors.primary }]}>
            <ThemedText style={[styles.funFactLabel, { color: colors.primary }]}>Fun Fact</ThemedText>
            <ThemedText style={[styles.funFact, { color: colors.cardForeground }]}>{funFact}</ThemedText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}