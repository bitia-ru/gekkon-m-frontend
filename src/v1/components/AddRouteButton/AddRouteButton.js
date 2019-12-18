import React from 'react';
import PropTypes from 'prop-types';
import './AddRouteButton.css';

const AddRouteButton = ({ onClick }) => (
  <div className="content-m__col-sm-6 content-m__col-xs-12">
    <a
      role="link"
      tabIndex="0"
      style={{ outline: 'none' }}
      onClick={onClick}
      className="card-m card-m__edit"
    >
      <span className="card-m__edit-icon" />
      <span className="card-m__edit-title">Добавить новую трассу</span>
    </a>
  </div>
);

AddRouteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default AddRouteButton;
