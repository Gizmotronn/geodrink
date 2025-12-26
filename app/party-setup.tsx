import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PartySetupScreen() {
  const router = useRouter();
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [names, setNames] = useState<string[]>([]);

  // Step: 1 = select count, 2 = enter names
  const [step, setStep] = useState(1);

  const handleCountSelect = (count: number) => {
    setPlayerCount(count);
    setNames(Array(count).fill(''));
    setStep(2);
  };

  const handleNameChange = (idx: number, name: string) => {
    setNames(prev => {
      const updated = [...prev];
      updated[idx] = name;
      return updated;
    });
  };

  const handleStart = () => {
    if (names.some(n => !n.trim())) return;
    router.push({ pathname: '/game', params: { mode: 'party', playerCount: String(playerCount), names: JSON.stringify(names) } });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="beer" size={40} color="#E24A90" />
          <Text style={styles.title}>Party Mode Setup</Text>
        </View>
        {step === 1 && (
          <View style={styles.section}>
            <Text style={styles.label}>How many players?</Text>
            <View style={styles.countRow}>
              {[2,3,4,5,6,7,8].map(count => (
                <Pressable key={count} style={styles.countButton} onPress={() => handleCountSelect(count)}>
                  <Text style={styles.countText}>{count}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
        {step === 2 && (
          <View style={styles.section}>
            <Text style={styles.label}>Enter player names:</Text>
            {names.map((name, idx) => (
              <TextInput
                key={idx}
                style={styles.nameInput}
                value={name}
                onChangeText={text => handleNameChange(idx, text)}
                placeholder={`Player ${idx + 1}`}
                autoCapitalize="words"
              />
            ))}
            <Pressable style={[styles.startButton, names.some(n => !n.trim()) && styles.disabledButton]} onPress={handleStart} disabled={names.some(n => !n.trim())}>
              <Text style={styles.startText}>Start Game</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '800', color: '#E24A90', marginTop: 8 },
  section: { marginBottom: 32 },
  label: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  countRow: { flexDirection: 'row', gap: 16, justifyContent: 'center', marginBottom: 16 },
  countButton: { backgroundColor: '#E24A90', borderRadius: 12, paddingVertical: 18, paddingHorizontal: 24 },
  countText: { color: '#FFF', fontSize: 22, fontWeight: '700' },
  nameInput: { fontSize: 18, borderBottomWidth: 2, borderBottomColor: '#E24A90', marginBottom: 18, paddingVertical: 8, paddingHorizontal: 12 },
  startButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E24A90', borderRadius: 14, paddingVertical: 16, marginTop: 18 },
  startText: { color: '#FFF', fontSize: 20, fontWeight: '700', marginRight: 8 },
  disabledButton: { opacity: 0.5 },
});
