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
});

export default styles;
