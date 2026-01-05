import { StyleSheet } from 'react-native';

export const gameStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  cityCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    // backgroundColor set dynamically via theme colors
  },
  cityTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 12,
    textAlign: 'center',
  },
  countryText: {
    fontSize: 18,
    marginTop: 6,
    textAlign: 'center',
  },
  questionSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  inputSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  temperatureInput: {
    fontSize: 48,
    fontWeight: '800',
    textAlign: 'center',
    borderBottomWidth: 4,
    minWidth: 140,
    paddingVertical: 12,
    paddingHorizontal: 16,
    // borderBottomColor set dynamically via theme colors
  },
  minusButton: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 180,
  },
  minusButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 200,
    // backgroundColor set dynamically via theme colors
  },
  submitButtonText: {
    fontSize: 20,
    fontWeight: '700',
    // color set dynamically via theme colors
  },
  unitText: {
    fontSize: 36,
    fontWeight: '600',
  },
  resultSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  comparisonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 20,
    borderRadius: 16,
    // backgroundColor set dynamically via theme colors
  },
  comparisonItem: {
    alignItems: 'center',
  },
  tempNumber: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 50,
    marginTop: 16,
    // backgroundColor set dynamically via theme colors
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    // backgroundColor set dynamically via theme colors
  },
  disabledButton: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    // color set dynamically via theme colors
  },
  scoreCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderRadius: 16,
    marginTop: 8,
    // backgroundColor set dynamically via theme colors
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 6,
    // color set dynamically via theme colors
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 18,
    fontWeight: '600',
  },
  largeTitle: {
    fontSize: 36,
    fontWeight: '800',
    marginVertical: 16,
    textAlign: 'center',
  },
  largeNumber: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 8,
  },
  completeContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  finalScoreCard: {
    width: '100%',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 24,
    // backgroundColor set dynamically via theme colors
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 40,
    marginVertical: 20,
  },
  scoreColumn: {
    alignItems: 'center',
  },
  accuracyText: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
  },
});
