import React from 'react';
import { css, StyleSheet } from '@/v2/aphrodite';

const Avatar = ({ user }) => (
  <div
    className={css(style.container)}
    style={{
      backgroundImage: `url(${user ? user.avatar.url : require('./assets/placeholder.svg')})`,
    }}
  />
);

const style = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundSize: 'contain',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
});

export default Avatar;
