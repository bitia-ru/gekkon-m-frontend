import React from 'react';
import PropTypes from 'prop-types';
import Scheme from '@/v1/components/Scheme/Scheme';
import CloseButton from '@/v1/components/CloseButton/CloseButton';
import { StyleSheet, css } from '@/v2/aphrodite';

const SchemeModal = ({ close, currentRoute }) => (
  <div className="modal-block-m modal-block-m_dark">
    <div className="modal-block-m__inner modal-block-m__inner_no-pb">
      <div className="modal-block-m__container">
        <div className="modal-block-m__header">
          <div className="modal-block-m__header-btn">
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
  modalBlockMMap: { width: '100%' },
});

SchemeModal.propTypes = {
  currentRoute: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
};

export default SchemeModal;
