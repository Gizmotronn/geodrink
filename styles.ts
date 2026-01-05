import { StyleSheet } from 'react-native';
import { Colors } from './constants/theme';

// Shared constants used by styles
export const HEADER_HEIGHT = 250;

/**
 * Create dynamic style helpers based on theme colors
 * These are used throughout the app components to maintain consistency
 */
export const getThemeStyles = (isDark: boolean) => {
  const colors = isDark ? Colors.dark : Colors.light;
  
  return {
    colors,
    // Common utility styles for theme-aware components
    primaryBackground: colors.primary,
    primaryForeground: colors.primaryForeground,
    secondaryBackground: colors.secondary,
    secondaryForeground: colors.secondaryForeground,
    accentBackground: colors.accent,
    accentForeground: colors.accentForeground,
    mutedBackground: colors.muted,
    mutedForeground: colors.mutedForeground,
    borderColor: colors.border,
    destructiveColor: colors.destructive,
  };
};

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
    headerBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    versionText: {
      fontSize: 13,
      fontWeight: '500',
      opacity: 0.6,
    },
    settingsButton: {
      padding: 8,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      paddingTop: 32,
      paddingBottom: 32,
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: 12,
      marginTop: 16,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      letterSpacing: -0.5,
      lineHeight: 40,
      includeFontPadding: false,
      textAlignVertical: 'center',
    },
    weatherCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 24,
      borderRadius: 16,
      marginBottom: 32,
      borderWidth: 1,
      borderColor: '#E0E0F0',
    },
    weatherLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    weatherIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    weatherSmallText: {
      fontSize: 13,
      marginBottom: 4,
    },
    weatherLocationText: {
      fontSize: 16,
      fontWeight: '600',
    },
    weatherRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    weatherTemp: {
      fontSize: 24,
      fontWeight: 'bold',
    },

    modesContainer: {
      gap: 16,
      marginBottom: 32,
    },
    modeButton: {
      flexDirection: 'row',
      paddingVertical: 20,
      paddingHorizontal: 32,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
      gap: 8,
    },
    modeButtonText: {
      fontSize: 18,
      fontWeight: '600',
    },
    utilityButtonsGrid: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 32,
    },
    utilityButton: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: 16,
      paddingHorizontal: 12,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderWidth: 1,
    },
    utilityButtonText: {
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'center',
    },
    buttonPressed: {
      opacity: 0.7,
      transform: [{ scale: 0.98 }],
    },
    leaderboardContainer: {
      marginVertical: 16,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
    },
    leaderboardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
      textAlign: 'center',
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 12,
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    statLabel: {
      fontSize: 12,
      marginTop: 4,
      textAlign: 'center',
      lineHeight: 14,
    },
    funFactContainer: {
      marginTop: 8,
      marginBottom: 12,
      padding: 16,
      borderRadius: 12,
      borderLeftWidth: 4,
    },
    funFactLabel: {
      fontSize: 12,
      fontWeight: '600',
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    funFact: {
      fontSize: 14,
      lineHeight: 20,
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
      borderRadius: 10,
      // Background color set dynamically via useThemeColor (muted)
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
      // Color set dynamically via useThemeColor (primary)
    },
    cityContainer: {
      alignItems: 'center',
      marginVertical: 20,
      padding: 15,
      borderRadius: 15,
      // Background color set dynamically via useThemeColor (card)
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
      // borderBottomColor set dynamically via useThemeColor (primary)
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
      borderRadius: 12,
      // Background color set dynamically via useThemeColor (muted)
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
      // backgroundColor set dynamically via useThemeColor (primary)
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    nextButton: {
      // backgroundColor set dynamically via useThemeColor (accent)
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
      borderRadius: 10,
      borderLeftWidth: 4,
      // Colors set dynamically via useThemeColor (warning colors)
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
      borderRadius: 8,
      // Background color set dynamically via useThemeColor (muted)
    },
    timerText: {
      fontSize: 16,
      fontWeight: '600',
    },
    bonusText: {
      fontSize: 12,
      // color set dynamically via useThemeColor (accent)
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
      borderRadius: 20,
      padding: 24,
      marginBottom: 30,
      // Background color set dynamically via useThemeColor (muted)
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
      lineHeight: 48,
      paddingTop: 4,
      // color set dynamically via useThemeColor (primary)
    },
    completeButtonsContainer: {
      width: '100%',
      gap: 15,
    },
    continueButton: {
      // backgroundColor set dynamically via useThemeColor (primary)
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
      // borderColor set dynamically via useThemeColor (primary)
      paddingVertical: 18,
      paddingHorizontal: 24,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    exitButtonText: {
      // color set dynamically via useThemeColor (primary)
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
      marginTop: 16,
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
      borderRadius: 8,
      // Background color set dynamically via useThemeColor (muted)
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
      marginTop: 16,
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
      borderRadius: 10,
      marginBottom: 10,
      // Background color set dynamically via useThemeColor (muted)
    },
    optionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 15,
      borderRadius: 10,
      marginBottom: 10,
      // Background color set dynamically via useThemeColor (muted)
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
      // color set dynamically via useThemeColor (primary)
    },
  }),
};

export type AppStyles = typeof S;