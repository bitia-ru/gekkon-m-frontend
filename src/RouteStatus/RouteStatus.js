import React from 'react';
import PropTypes from 'prop-types';
import './RouteStatus.css';

const RouteStatus = ({
  ascent, changeAscentResult,
}) => {
  const complete = (ascent && ascent.result !== 'unsuccessful');
  let resultClass = '';
  let resultText = 'Не пройдена';
  if (complete) {
    if (ascent.result === 'red_point') {
      resultClass = ' route-status-m__type_redpoint';
      resultText = 'Пролез';
    } else {
      resultClass = ' route-status-m__type_flash';
      resultText = 'Флешанул';
    }
  }
  return (
    <div
      role="button"
      tabIndex="0"
      className={`route-status-m${complete ? ' route-status-m_complete' : ''}`}
      onClick={changeAscentResult || null}
    >
      <div className={`route-status-m__type${resultClass}`} />
      {resultText}
    </div>
  );
};

RouteStatus.propTypes = {
  ascent: PropTypes.object,
  changeAscentResult: PropTypes.func,
};

RouteStatus.defaultProps = {
  ascent: null,
  changeAscentResult: null,
};

export default RouteStatus;
