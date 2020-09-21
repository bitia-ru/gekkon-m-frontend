import {StyleSheet} from '../../aphrodite';


const styles = StyleSheet.create({
  contentMInnerMapCard: {
    marginTop: '20px',
    display: 'flex',
  },
  contentMInnerMap: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  contentMColSm6: {
    '@media screen and (mix-width: 720px)': {
      width: 'calc(50% - 24px)',
      maxWidth: '50%',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  contentMColXs12: {
    width: '100%',
    maxWidth: '100%',
  },
  schemeContainer: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #F0F0F0',
    height: '280px',
    overflow: 'scroll',
    position: 'relative',
    userSelect: 'none',
  },
  scalingButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '12px',
    '> div': {
      flex: '0 0 52px',
    },
  },
  scalingButtonWrapper: {
    display: 'flex',
    '> button': {
      width: '50px',
      marginLeft: '10px',
    },
  },
});

export default styles;
