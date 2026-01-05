import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { S } from '../styles';

export default function RulesScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#4A90E2" />
          </Pressable>
          <ThemedText style={styles.title}>Rules & Help</ThemedText>
          <View style={styles.placeholder} />
        </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Classic Mode */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={24} color="#4A90E2" />
            <ThemedText style={styles.sectionTitle}>Classic Mode</ThemedText>
          </View>
          <ThemedText style={styles.paragraph}>
            Test your geography and weather knowledge solo!
          </ThemedText>
          <View style={styles.rulesList}>
            <ThemedText style={styles.rule}>
              • The app shows you a random city from anywhere in the world
            </ThemedText>
            <ThemedText style={styles.rule}>
              • Guess the current temperature in Celsius
            </ThemedText>
            <ThemedText style={styles.rule}>
              • Get within 2°C to score a point
            </ThemedText>
            <ThemedText style={styles.rule}>
              • Track your accuracy over time
            </ThemedText>
          </View>
        </View>

        {/* Party/Drink Mode */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="beer" size={24} color="#E24A90" />
            <ThemedText style={[styles.sectionTitle, { color: '#E24A90' }]}>
              Party Mode
            </ThemedText>
          </View>
          <ThemedText style={styles.paragraph}>
            The social drinking game version!
          </ThemedText>
          <View style={styles.rulesList}>
            <ThemedText style={styles.rule}>
              • Take turns guessing the temperature
            </ThemedText>
            <ThemedText style={styles.rule}>
              • Within 2°C? Everyone else drinks! 🎉
            </ThemedText>
            <ThemedText style={styles.rule}>
              • More than 2°C off? You drink! 😅
            </ThemedText>
            <ThemedText style={styles.rule}>
              • Pass the phone around the group
            </ThemedText>
          </View>
        </View>

        {/* Tips & Strategy */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bulb" size={24} color="#FFC107" />
            <ThemedText style={[styles.sectionTitle, { color: '#FFC107' }]}>
              Tips & Strategy
            </ThemedText>
          </View>
          <View style={styles.rulesList}>
            <ThemedText style={styles.rule}>
              🌍 Consider the hemisphere - is it summer or winter there?
            </ThemedText>
            <ThemedText style={styles.rule}>
              📍 Latitude matters - closer to equator = warmer
            </ThemedText>
            <ThemedText style={styles.rule}>
              🏔️ Altitude affects temperature (mountains are cooler)
            </ThemedText>
            <ThemedText style={styles.rule}>
              🌊 Coastal cities vs inland cities have different climates
            </ThemedText>
            <ThemedText style={styles.rule}>
              🕐 Time of day - remember different time zones!
            </ThemedText>
          </View>
        </View>

        {/* Temperature Reference */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="thermometer" size={24} color="#FF5722" />
            <ThemedText style={[styles.sectionTitle, { color: '#FF5722' }]}>
              Temperature Reference
            </ThemedText>
          </View>
          <View style={styles.referenceList}>
            <View style={styles.referenceItem}>
              <ThemedText style={styles.referenceTemp}>-20°C</ThemedText>
              <ThemedText style={styles.referenceDesc}>Arctic cold</ThemedText>
            </View>
            <View style={styles.referenceItem}>
              <ThemedText style={styles.referenceTemp}>0°C</ThemedText>
              <ThemedText style={styles.referenceDesc}>Freezing point</ThemedText>
            </View>
            <View style={styles.referenceItem}>
              <ThemedText style={styles.referenceTemp}>10°C</ThemedText>
              <ThemedText style={styles.referenceDesc}>Cool/Chilly</ThemedText>
            </View>
            <View style={styles.referenceItem}>
              <ThemedText style={styles.referenceTemp}>20°C</ThemedText>
              <ThemedText style={styles.referenceDesc}>Room temperature</ThemedText>
            </View>
            <View style={styles.referenceItem}>
              <ThemedText style={styles.referenceTemp}>30°C</ThemedText>
              <ThemedText style={styles.referenceDesc}>Hot summer day</ThemedText>
            </View>
            <View style={styles.referenceItem}>
              <ThemedText style={styles.referenceTemp}>40°C</ThemedText>
              <ThemedText style={styles.referenceDesc}>Extreme heat</ThemedText>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={[styles.section, { marginBottom: 40 }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={24} color="#9C27B0" />
            <ThemedText style={[styles.sectionTitle, { color: '#9C27B0' }]}>
              About GeoDrink
            </ThemedText>
          </View>
          <ThemedText style={styles.paragraph}>
            GeoDrink combines geography knowledge with real-time weather data to create
            a fun and educational game. Perfect for parties, pre-drinks, or solo play to
            test your world geography skills!
          </ThemedText>
          <ThemedText style={[styles.paragraph, { marginTop: 10 }]}>
            Temperature data is fetched in real-time, so the game is always current and
            challenging.
          </ThemedText>
        </View>
      </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = S.rules;
