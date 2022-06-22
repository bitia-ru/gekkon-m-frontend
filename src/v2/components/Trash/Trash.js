import React from 'react';
import PropTypes from 'prop-types';
import { css, StyleSheet } from '@/v2/aphrodite';

const Trash = ({
  setRef, visible, bottom, active,
}) => {
  return (
    <div
      style={
        visible
          ? {}
          : { display: 'none' }
      }
      ref={setRef}
      className={
        css(
          styles.modalBlockMTrashCan,
          bottom ? styles.modalBlockMTrashCanActiveBottom : styles.modalBlockMTrashCanActiveTop,
          active && styles.modalBlockMTrashCanActiveTarget,
        )
      }
    >
      <svg aria-hidden="true">
        <use xlinkHref={`${require('./images/trash-can.svg').default}#trash-can`} />
      </svg>
    </div>
  );
};

const styles = StyleSheet.create({
  modalBlockMTrashCan: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '18px',
    paddingBottom: '18px',
    backgroundColor: 'rgba(31, 31, 31, 0.7)',
    transition: 'background-color .4s ease-out',
    '> svg': {
      width: '22px',
      height: '24px',
      fill: '#ffffff',
    }
  },
  modalBlockMTrashCanActiveTop: {
    position: 'fixed',
    zIndex: '30',
    content: '\'\'',
    top: '0',
    left: '0',
  },
  modalBlockMTrashCanActiveTarget: {
    backgroundColor: 'rgba(167, 13, 13, 0.7)',
  },
  modalBlockMTrashCanActiveBottom: {
    position: 'fixed',
    zIndex: 30,
    content: '\'\'',
    bottom: 0,
    left: 0,
  },
});

Trash.propTypes = {
  bottom: PropTypes.bool,
  visible: PropTypes.bool,
  active: PropTypes.bool,
  setRef: PropTypes.func.isRequired,
};

Trash.defaultProps = {
  visible: true,
  bottom: false,
  active: false,
};

export default Trash;
