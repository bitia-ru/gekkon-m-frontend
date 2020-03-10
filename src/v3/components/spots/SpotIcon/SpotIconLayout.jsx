import React from 'react';
import { css, StyleSheet } from '@/v2/aphrodite';


const SpotIconLayout = ({ spot }) => (
  <div className={css(style.container)}>
    <img src={spot?.photo?.url} />
    <span>{spot.name}</span>
  </div>
);

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexFlow: 'column',
    width: '68px',
    height: '68px',
    alignItems: 'center',

    '> img': {
      display: 'block',
      flex: '0 0 48px',
      width: '48px',
      height: '48px',
    },
    '> span': {
      display: 'block',
      flex: '0 0 20px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      width: '100%',
      textAlign: 'center',
    },
  },
});

export default SpotIconLayout;
