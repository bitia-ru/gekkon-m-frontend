import React from 'react';
import { css, StyleSheet } from '@/v2/aphrodite';
import Logo from '../../common/Logo/Logo';
import AvatarLayout from '../../common/Avatar/AvatarLayout';


const MainNavLayout = ({ user }) => (
  <div className={css(style.container)}>
    <div className={css(style.logoContainer)}>
      <Logo />
    </div>
    <div className={css(style.menuPlaceholder)}>&nbsp;</div>
    <div className={css(style.avatarContainer)}>
      <AvatarLayout user={user} />
    </div>
  </div>
);

const style = StyleSheet.create({
  container: {
    width: '100%',
    height: '32px',
    background: '#F0F0F0',
    display: 'flex',
  },
  logoContainer: {
    flex: '0 0 32px',
  },
  menuPlaceholder: {
    flex: 1,
  },
  avatarContainer: {
    flex: '0 0 32px',
  },
});

export default MainNavLayout;
