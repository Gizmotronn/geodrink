import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          GeoDrink
        </ThemedText>
        <ThemedText style={styles.subtitle}>TBC</ThemedText>
      </View>

      <View style={styles.globeContainer}>
        <View style={styles.globe}>
          <Ionicons name="globe-outline" size={120} color="#4A90E2" />
        </View>
        <ThemedText style={styles.globeLabel}>Geography</ThemedText>
      </View>

      <View style={styles.modesContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.modeButton,
            styles.classicButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push("/game?mode=classic")}
        >
          <ThemedText style={styles.modeButtonText}>Classic Mode</ThemedText>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.modeButton,
            styles.partyButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push("/game?mode=party")}
        >
          <ThemedText style={styles.modeButtonText}>Party/Drink Mode</ThemedText>
        </Pressable>
      </View>

      <View style={styles.bottomButtons}>
        <Pressable
          style={({ pressed }) => [styles.infoButton, pressed && styles.infoButtonPressed]}
          onPress={() => router.push("/rules")}
        >
          <Ionicons name="book-outline" size={20} color="#666" />
          <ThemedText style={styles.infoButtonText}>Rules/Help</ThemedText>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.infoButton, pressed && styles.infoButtonPressed]}
          onPress={() => router.push("/settings")}
        >
          <Ionicons name="settings-outline" size={20} color="#666" />
          <ThemedText style={styles.infoButtonText}>Settings</ThemedText>
        </Pressable>
      </View>

      <View style={styles.funFactContainer}>
        <ThemedText style={styles.funFactLabel}>Fun Fact</ThemedText>
        <ThemedText style={styles.funFact}>
          The hottest temperature ever recorded on Earth was 56.7°C in Death Valley, California!
        </ThemedText>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  globeContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  globe: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(74, 144, 226, 0.3)',
  },
  globeLabel: {
    marginTop: 15,
    fontSize: 18,
    opacity: 0.6,
  },
  modesContainer: {
    gap: 15,
    marginBottom: 30,
  },
  modeButton: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  classicButton: {
    backgroundColor: '#4A90E2',
  },
  partyButton: {
    backgroundColor: '#E24A90',
  },
  modeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  infoButtonPressed: {
    opacity: 0.6,
  },
  infoButtonText: {
    fontSize: 14,
    opacity: 0.8,
  },
  funFactContainer: {
    marginTop: 'auto',
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  funFactLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
    opacity: 0.7,
  },
  funFact: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
  },
});