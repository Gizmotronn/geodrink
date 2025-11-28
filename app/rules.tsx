import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function RulesScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
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
              Party/Drink Mode
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
    marginBottom: 10,
  },
  rulesList: {
    gap: 10,
  },
  rule: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
  },
  referenceList: {
    gap: 12,
  },
  referenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: 8,
  },
  referenceTemp: {
    fontSize: 16,
    fontWeight: '600',
  },
  referenceDesc: {
    fontSize: 16,
    opacity: 0.7,
  },
});
