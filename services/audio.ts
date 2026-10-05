import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { getSoundEffectsEnabled } from '../utils/storage';

let correctSound: Audio.Sound | null = null;
let wrongSound: Audio.Sound | null = null;

export async function loadSounds() {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
      playsInSilentModeIOS: false,
      staysActiveInBackground: false,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
    });

    const { sound: correct } = await Audio.Sound.createAsync(
      require('../assets/sounds/correct.mp3'),
      { volume: 0.45 }
    );
    correctSound = correct;

    const { sound: wrong } = await Audio.Sound.createAsync(
      require('../assets/sounds/wrong.mp3'),
      { volume: 0.45 }
    );
    wrongSound = wrong;
  } catch (error) {
    console.error('Error loading sounds:', error);
  }
}

export async function playCorrectSound() {
  try {
    if (correctSound && await getSoundEffectsEnabled()) {
      await correctSound.replayAsync();
    }
  } catch (error) {
    console.error('Error playing correct sound:', error);
  }
}

export async function playWrongSound() {
  try {
    if (wrongSound && await getSoundEffectsEnabled()) {
      await wrongSound.replayAsync();
    }
  } catch (error) {
    console.error('Error playing wrong sound:', error);
  }
}

export async function unloadSounds() {
  try {
    if (correctSound) {
      await correctSound.unloadAsync();
      correctSound = null;
    }
    if (wrongSound) {
      await wrongSound.unloadAsync();
      wrongSound = null;
    }
  } catch (error) {
    console.error('Error unloading sounds:', error);
  }
}
