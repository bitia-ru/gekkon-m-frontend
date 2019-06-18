import React from 'react';
import PropTypes from 'prop-types';
import trashImage from '../../img/trash-img/trash-can.svg';
import './Trash.css';

const Trash = ({
  setRef, visible, bottom, active,
}) => {
  const defaultClass = 'modal-block-m__trash-can modal-block-m__trash-can_active-';
  const activeClass = active ? ' modal-block-m__trash-can_active-target' : '';
  return (
    <div
      style={
        visible
          ? {}
          : { display: 'none' }
      }
      ref={setRef}
      className={
        `${defaultClass}${bottom ? 'bottom' : 'top'}${activeClass}`
      }
    >
      <svg aria-hidden="true">
        <use xlinkHref={`${trashImage}#trash-can`} />
      </svg>
    </div>
  );
};

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
