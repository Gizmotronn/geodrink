import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/contexts/ThemeContext';
import { S } from '@/styles';
import { getTempUnit, setTempUnit } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Switch, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, toggleDarkMode } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [celsiusEnabled, setCelsiusEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const unit = await getTempUnit();
    setCelsiusEnabled(unit === 'C');
  };

  const toggleTempUnit = async (value: boolean) => {
    setCelsiusEnabled(value);
    await setTempUnit(value ? 'C' : 'F');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4A90E2" />
        </Pressable>
        <ThemedText style={styles.title}>Settings</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Game Settings */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Game Settings</ThemedText>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="thermometer-outline" size={24} color="#4A90E2" />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingLabel}>Temperature Unit</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  {celsiusEnabled ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
                </ThemedText>
              </View>
            </View>
            <Switch
              value={celsiusEnabled}
              onValueChange={toggleTempUnit}
              trackColor={{ false: '#767577', true: '#4A90E2' }}
            />
          </View>
        </View>

        {/* Audio & Haptics */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Audio & Haptics</ThemedText>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-high-outline" size={24} color="#4A90E2" />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingLabel}>Sound Effects</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Play sounds for correct/incorrect answers
                </ThemedText>
              </View>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#767577', true: '#4A90E2' }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="phone-portrait-outline" size={24} color="#4A90E2" />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingLabel}>Haptic Feedback</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Vibrate on button presses
                </ThemedText>
              </View>
            </View>
            <Switch
              value={hapticEnabled}
              onValueChange={setHapticEnabled}
              trackColor={{ false: '#767577', true: '#4A90E2' }}
            />
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Appearance</ThemedText>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={24} color="#4A90E2" />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingLabel}>Dark Mode</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Invert all colors (experimental)
                </ThemedText>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#767577', true: '#4A90E2' }}
            />
          </View>
        </View>

        {/* Difficulty Settings */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Difficulty</ThemedText>
          
          <Pressable style={styles.optionItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="speedometer-outline" size={24} color="#50C878" />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingLabel}>Tolerance Range</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Currently: ±2°C
                </ThemedText>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </Pressable>

          <Pressable style={styles.optionItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="globe-outline" size={24} color="#50C878" />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingLabel}>City Selection</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  All cities worldwide
                </ThemedText>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </Pressable>
        </View>

        {/* About */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>About</ThemedText>
          
          <Pressable style={styles.optionItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="information-circle-outline" size={24} color="#9C27B0" />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingLabel}>Version</ThemedText>
                <ThemedText style={styles.settingDescription}>1.0.0</ThemedText>
              </View>
            </View>
          </Pressable>

          <Pressable style={styles.optionItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="heart-outline" size={24} color="#E24A90" />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingLabel}>Rate App</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Enjoying GeoDrink?
                </ThemedText>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </Pressable>

          <Pressable style={styles.optionItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="share-social-outline" size={24} color="#4A90E2" />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingLabel}>Share with Friends</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Tell others about the game
                </ThemedText>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = S.settings;
