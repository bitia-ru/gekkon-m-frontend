import React from 'react';
import PropTypes from 'prop-types';
import Scheme from '../Scheme/Scheme';
import CloseButton from '../CloseButton/CloseButton';
import './SchemeModal.css';

const SchemeModal = ({ close, diagram, currentRoute }) => (
  <div className="modal-block-m modal-block-m_dark">
    <div className="modal-block-m__inner modal-block-m__inner_no-pb">
      <div className="modal-block-m__container">
        <div className="modal-block-m__header">
          <div className="modal-block-m__header-btn">
            <CloseButton onClick={close} light />
          </div>
        </div>
      </div>
      <div className="modal-block-m__map">
        <Scheme
          routes={[currentRoute]}
          showCards={false}
          diagram={diagram}
        />
      </div>
    </div>
  </div>
);

SchemeModal.propTypes = {
  diagram: PropTypes.string,
  currentRoute: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
};

export default SchemeModal;
