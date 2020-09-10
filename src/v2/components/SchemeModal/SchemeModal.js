import React from 'react';
import PropTypes from 'prop-types';
import Scheme from '@/v1/components/Scheme/Scheme';
import CloseButton from '@/v1/components/CloseButton/CloseButton';
import { StyleSheet, css } from '@/v2/aphrodite';

const SchemeModal = ({ close, currentRoute }) => (
  <div className={css(styles.modalBlockM, styles.modalBlockMDark)}>
    <div className={css(styles.modalBlockMInner)}>
      <div className={css(styles.modalBlockMContainer)}>
        <div className={css(styles.modalBlockMHeader)}>
          <div className={css(styles.modalBlockMHeaderBtn)}>
            <CloseButton onClick={close} light />
          </div>
        </div>
      </div>
      <div className={css(styles.modalBlockMMap)}>
        <Scheme
          currentRoutes={[currentRoute]}
          showCards={false}
        />
      </div>
    </div>
  </div>
);

const styles = StyleSheet.create({
  modalBlockM: {
    backgroundColor: '#ffffff',
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: 20,
  },
  modalBlockMDark: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
  modalBlockMInner: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    paddingBottom: '50px',
    boxSizing: 'border-box',
  },
  modalBlockMContainer: {
    paddingLeft: '24px',
    paddingRight: '24px',
    width: '100%',
    boxSizing: 'border-box',
  },
  modalBlockMHeader: {
    paddingTop: '20px',
    paddingBottom: '20px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  modalBlockMHeaderBtn: {
    width: '16px',
    height: '16px',
    position: 'static',
    zIndex: 20,
    marginLeft: '18px',
  },
  modalBlockMMap: { width: '100%' },
});

SchemeModal.propTypes = {
  currentRoute: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
};

export default SchemeModal;
