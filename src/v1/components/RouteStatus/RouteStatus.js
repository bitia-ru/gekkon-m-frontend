import React from 'react';
import PropTypes from 'prop-types';
import RouteContext from '../../contexts/RouteContext';
import './RouteStatus.css';

const RouteStatus = ({ changeAscentResult }) => (
  <RouteContext.Consumer>
    {
      ({ route }) => {
        const { ascent_result: ascentResult } = route;
        const complete = (ascentResult && ascentResult !== 'unsuccessful');
        let resultClass = '';
        let resultText = 'Не пройдена';
        if (complete) {
          if (ascentResult === 'red_point') {
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
            style={{ outline: 'none' }}
            className={`route-status-m${complete ? ' route-status-m_complete' : ''}`}
            onClick={changeAscentResult || null}
          >
            <div className={`route-status-m__type${resultClass}`} />
            {resultText}
          </div>
        );
      }
    }
  </RouteContext.Consumer>
);

RouteStatus.propTypes = { changeAscentResult: PropTypes.func };

RouteStatus.defaultProps = { changeAscentResult: null };

export default RouteStatus;
