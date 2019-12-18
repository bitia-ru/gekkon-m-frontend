import React from 'react';
import PropTypes from 'prop-types';
import getColorStyle from '../../Constants/RouteColorPicker';
import './RouteColor.css';

const RouteColor = ({
  route,
  fieldName,
}) => (
  <div
    className="hook"
    style={getColorStyle(route[fieldName])}
  />
);

RouteColor.propTypes = {
  route: PropTypes.object.isRequired,
  fieldName: PropTypes.string.isRequired,
};

export default RouteColor;
