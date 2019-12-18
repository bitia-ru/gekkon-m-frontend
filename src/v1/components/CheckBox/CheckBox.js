import React from 'react';
import PropTypes from 'prop-types';
import './CheckBox.css';

const CheckBox = ({
  id, checked, title, onChange,
}) => (
  <div className="form__checkbox">
    <input id={id} type="checkbox" name={id} checked={checked} onChange={onChange} />
    <label htmlFor={id}>{title}</label>
  </div>
);

CheckBox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default CheckBox;
