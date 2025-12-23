import { StyleSheet } from 'react-native';

// Shared constants used by styles
export const HEADER_HEIGHT = 250;

// Single source of truth for all app styles
export const S = {
  // Home screen styles (app/index.tsx)
  home: StyleSheet.create({
    container: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 0,
      paddingBottom: 20,
    },
    header: {
      alignItems: 'center',
      marginTop: 0,
      marginBottom: 12,
      paddingTop: 0,
    },
    title: {
      fontSize: 36,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      opacity: 0.7,
    },
    tempToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 20,
      backgroundColor: 'rgba(74, 144, 226, 0.15)',
      marginTop: 6,
    },
    tempToggleText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#4A90E2',
    },
    leaderboardContainer: {
      marginVertical: 10,
      padding: 12,
      borderRadius: 12,
      backgroundColor: 'rgba(80, 200, 120, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(80, 200, 120, 0.3)',
    },
    leaderboardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 8,
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#50C878',
    },
    statLabel: {
      fontSize: 11,
      opacity: 0.7,
      marginTop: 2,
      textAlign: 'center',
    },
    globeContainer: {
      alignItems: 'center',
      marginVertical: 10,
    },
    globe: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(74, 144, 226, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'rgba(74, 144, 226, 0.3)',
    },
    globeLabel: {
      marginTop: 8,
      fontSize: 16,
      opacity: 0.6,
    },
    modesContainer: {
      gap: 12,
      marginBottom: 12,
    },
    modeButton: {
      paddingVertical: 16,
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
      marginVertical: 10,
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
      marginTop: 10,
      marginBottom: 5,
      padding: 12,
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
  }),

  // Game screen styles (app/game.tsx)
  game: StyleSheet.create({
    container: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    completeScrollContent: {
      paddingHorizontal: 20,
      paddingTop: 30,
      paddingBottom: 40,
      flexGrow: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 0,
      marginBottom: 15,
      paddingTop: 5,
    },
    backButton: {
      padding: 8,
    },
    modeTitle: {
      fontSize: 20,
      fontWeight: '600',
      paddingVertical: 4,
    },
    placeholder: {
      width: 40,
    },
    scoreContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
      paddingVertical: 12,
      backgroundColor: 'rgba(74, 144, 226, 0.1)',
      borderRadius: 10,
    },
    scoreItem: {
      alignItems: 'center',
    },
    scoreLabel: {
      fontSize: 13,
      opacity: 0.7,
      marginBottom: 4,
    },
    scoreValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#4A90E2',
    },
    cityContainer: {
      alignItems: 'center',
      marginVertical: 20,
      padding: 15,
      backgroundColor: 'rgba(74, 144, 226, 0.05)',
      borderRadius: 15,
    },
    cityName: {
      fontSize: 28,
      fontWeight: 'bold',
      marginTop: 8,
      paddingVertical: 5,
    },
    countryName: {
      fontSize: 16,
      opacity: 0.7,
      marginTop: 4,
    },
    questionContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    question: {
      fontSize: 18,
      fontWeight: '500',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      marginBottom: 25,
    },
    input: {
      fontSize: 40,
      fontWeight: 'bold',
      textAlign: 'center',
      borderBottomWidth: 3,
      borderBottomColor: '#4A90E2',
      minWidth: 120,
      paddingVertical: 8,
      paddingHorizontal: 10,
      lineHeight: 50,
      includeFontPadding: false,
    },
    unitLabel: {
      fontSize: 32,
      fontWeight: '500',
      opacity: 0.7,
    },
    resultContainer: {
      alignItems: 'center',
      marginBottom: 25,
    },
    resultMessage: {
      fontSize: 20,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    temperatureComparison: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
      padding: 15,
      backgroundColor: 'rgba(128, 128, 128, 0.1)',
      borderRadius: 12,
    },
    tempItem: {
      alignItems: 'center',
    },
    tempLabel: {
      fontSize: 12,
      opacity: 0.7,
      marginBottom: 4,
    },
    tempValue: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    buttonContainer: {
      marginBottom: 15,
    },
    submitButton: {
      backgroundColor: '#4A90E2',
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    nextButton: {
      backgroundColor: '#50C878',
      paddingVertical: 16,
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
    completeContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    trophyIcon: {
      marginTop: 20,
    },
    completeTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 30,
      lineHeight: 40,
      paddingTop: 5,
    },
    finalScoreContainer: {
      width: '100%',
      backgroundColor: 'rgba(74, 144, 226, 0.1)',
      borderRadius: 20,
      padding: 24,
      marginBottom: 30,
    },
    finalScoreLabel: {
      fontSize: 20,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 28,
      paddingTop: 3,
    },
    finalScoreRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginBottom: 20,
    },
    finalScoreItem: {
      alignItems: 'center',
      flex: 1,
    },
    finalScoreDivider: {
      width: 1,
      height: 60,
      backgroundColor: 'rgba(128, 128, 128, 0.3)',
      marginHorizontal: 10,
    },
    finalScoreValue: {
      fontSize: 36,
      fontWeight: 'bold',
      marginTop: 8,
      lineHeight: 44,
      paddingTop: 4,
    },
    finalScoreText: {
      fontSize: 14,
      opacity: 0.7,
      marginTop: 4,
      lineHeight: 20,
      paddingTop: 2,
    },
    accuracyContainer: {
      alignItems: 'center',
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: 'rgba(128, 128, 128, 0.2)',
    },
    accuracyLabel: {
      fontSize: 16,
      opacity: 0.7,
      marginBottom: 8,
      lineHeight: 22,
      paddingTop: 2,
    },
    accuracyValue: {
      fontSize: 40,
      fontWeight: 'bold',
      color: '#4A90E2',
      lineHeight: 48,
      paddingTop: 4,
    },
    completeButtonsContainer: {
      width: '100%',
      gap: 15,
    },
    continueButton: {
      backgroundColor: '#4A90E2',
      paddingVertical: 18,
      paddingHorizontal: 24,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    continueButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
    },
    exitButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: '#4A90E2',
      paddingVertical: 18,
      paddingHorizontal: 24,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    exitButtonText: {
      color: '#4A90E2',
      fontSize: 18,
      fontWeight: '600',
    },
  }),

  // Rules screen styles (app/rules.tsx)
  rules: StyleSheet.create({
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
      lineHeight: 28,
      includeFontPadding: false,
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
      lineHeight: 30,
      includeFontPadding: false,
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
  }),

  // Settings screen styles (app/settings.tsx)
  settings: StyleSheet.create({
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
      lineHeight: 28,
      includeFontPadding: false,
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
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 15,
      opacity: 0.7,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 15,
      backgroundColor: 'rgba(128, 128, 128, 0.1)',
      borderRadius: 10,
      marginBottom: 10,
    },
    optionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 15,
      backgroundColor: 'rgba(128, 128, 128, 0.1)',
      borderRadius: 10,
      marginBottom: 10,
    },
    settingInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
      flex: 1,
    },
    settingText: {
      flex: 1,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 3,
    },
    settingDescription: {
      fontSize: 13,
      opacity: 0.6,
    },
  }),

  // Modal screen styles (app/modal.tsx)
  modal: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    link: {
      marginTop: 15,
      paddingVertical: 15,
    },
  }),

  // Parallax component styles (components/parallax-scroll-view.tsx)
  parallaxScrollView: StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      height: HEADER_HEIGHT,
      overflow: 'hidden',
    },
    content: {
      flex: 1,
      padding: 32,
      gap: 16,
      overflow: 'hidden',
    },
  }),

  // Collapsible component styles (components/ui/collapsible.tsx)
  collapsible: StyleSheet.create({
    heading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    content: {
      marginTop: 6,
      marginLeft: 24,
    },
  }),

  // ThemedText component styles (components/themed-text.tsx)
  text: StyleSheet.create({
    default: {
      fontSize: 16,
      lineHeight: 24,
    },
    defaultSemiBold: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    link: {
      lineHeight: 30,
      fontSize: 16,
      color: '#0a7ea4',
    },
  }),
};

export type AppStyles = typeof S;