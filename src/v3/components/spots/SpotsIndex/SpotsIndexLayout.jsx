import React from 'react';
import * as R from 'ramda';
import SpotIcon from '../SpotIcon/SpotIcon';
import { css, StyleSheet } from '@/v2/aphrodite';


const SpotsIndexLayout = ({ spots }) => (
  <div className={css(style.containerWrapper)}>
    <div className={css(style.container)}>
      {
        R.map(
          spot => (
            <SpotIcon key={spot.id} spot={spot} />
          ),
        )(Object.values(spots))
      }
    </div>
  </div>
);

const style = StyleSheet.create({
  containerWrapper: {
    backgroundColor: '#FAFAFA',
    borderBottom: 'solid 1px rgba(0, 0, 0, 0.1)',
  },
  container: {
    display: 'flex',
    overflowX: 'scroll',
    scrollX: 'auto',
    margin: '16px',

    '> div': {
      marginRight: '15px',
    },
  },
});

export default SpotsIndexLayout;
