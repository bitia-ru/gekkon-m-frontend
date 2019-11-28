import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { notAvail, avail } from '../Utils';
import RouteContext from '../contexts/RouteContext';
import getArrayFromObject from '../../v1/utils/getArrayFromObject';
import './RouteStatus.css';

const RouteStatus = ({
  user, changeAscentResult,
}) => (
  <RouteContext.Consumer>
    {
      ({ route }) => {
        const ascents = avail(route.ascents) && getArrayFromObject(route.ascents);
        const ascent = (
          notAvail(user.id) || notAvail(ascents)
            ? null
            : (R.find(R.propEq('user_id', user.id))(ascents))
        );
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

RouteStatus.propTypes = {
  changeAscentResult: PropTypes.func,
};

RouteStatus.defaultProps = {
  changeAscentResult: null,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default withRouter(connect(mapStateToProps)(RouteStatus));
