import { Audio } from 'expo-av';

let correctSound: Audio.Sound | null = null;
let wrongSound: Audio.Sound | null = null;

export async function loadSounds() {
  try {
    const { sound: correct } = await Audio.Sound.createAsync(
      require('../assets/sounds/correct.mp3')
    );
    correctSound = correct;

    const { sound: wrong } = await Audio.Sound.createAsync(
      require('../assets/sounds/wrong.mp3')
    );
    wrongSound = wrong;
  } catch (error) {
    console.error('Error loading sounds:', error);
  }
}

export async function playCorrectSound() {
  try {
    if (correctSound) {
      await correctSound.replayAsync();
    }
  } catch (error) {
    console.error('Error playing correct sound:', error);
  }
}

export async function playWrongSound() {
  try {
    if (wrongSound) {
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
