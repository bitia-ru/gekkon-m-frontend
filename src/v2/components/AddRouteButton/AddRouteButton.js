import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '../../aphrodite';

const AddRouteButton = ({ onClick }) => (
  <div className={css(styles.contentMColSm6, styles.contentMColXs12)}>
    <a
      role="link"
      tabIndex="0"
      style={{ outline: 'none' }}
      onClick={onClick}
      className={css(styles.cardM, styles.cardMEdit)}
    >
      <span className={css(styles.cardMEditIcon)} />
      <span className={css(styles.cardMEditTitle)}>Добавить новую трассу</span>
    </a>
  </div>
);

const styles = StyleSheet.create({
  cardM: {
    width: '100%',
    padding: '12px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)',
    transition: 'box-shadow .4s ease-out',
    display: 'flex',
    textDecoration: 'none',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: '#FFFFFF',
    marginBottom: '20px',
    position: 'relative',
    ':hover': { boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.12)' },
    ':focus': { boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.12), 0px 0px 0px 2px rgba(0, 108, 235, 0.7)' }
  },
  cardMEdit: {
    boxShadow: 'none',
    backgroundColor: '#FDFDFD',
    border: '4px dashed #D1D5E2',
    transition: 'opacity .4s ease-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '22px',
    paddingBottom: '22px',
    ':hover': {
      boxShadow: 'none',
      opacity: 1,
    },
    '@media screen and (min-width: 720px)': { height: '156px' },
  },
  contentMColXs12: {
    width: '100%',
    maxWidth: '100%',
  },
  contentMColSm6: {
    '@media screen and (mix-width: 720px)': {
      width: 'calc(50% - 24px)',
      maxWidth: '50%',
      marginLeft: '12px',
      marginRight: '12px',
    },
  },
  cardMEditIcon: {
    display: 'flex',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '4px solid #D1D5E2',
    position: 'relative',
    marginRight: '20px',
    ':before': {
      content: '\'\'',
      position: 'absolute',
      width: '14px',
      height: '4px',
      backgroundColor: '#D1D5E2',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    },
    ':after': {
      content: '\'\'',
      position: 'absolute',
      width: '14px',
      height: '4px',
      backgroundColor: '#D1D5E2',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%) rotate(90deg)',
    },
  },
  cardMEditTitle: {
    fontFamily: 'GilroyBold, sans-serif',
    fontSize: '14px',
    color: '#D1D5E2'
  },
});

AddRouteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default AddRouteButton;
