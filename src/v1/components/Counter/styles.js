import { StyleSheet } from '@/v2/aphrodite';

const styles = StyleSheet.create({
  counter: {
    fontSize: '16px',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  counterText: {
    height: '100%',
    textAlign: 'center',
    lineHeight: '28px',
  },
  counterNumContainer: { marginRight: '4px' },
  counterNumWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    height: '100%',
    width: '28px',
    borderRadius: '50%',
  },
  counterNum: { marginTop: '2px' },
  defaultCounterColor: { color: '#828282' },
  redpointsTextColor: { color: '#E24D4D' },
  flashesTextColor: { color: '#000000' },
  redpointsNumColor: { backgroundColor: '#E24D4D' },
  flashesNumColor: { backgroundColor: '#000000' },
});

export default styles;
