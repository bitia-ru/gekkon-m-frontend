import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import moment from 'moment';
import { SOON_END_PERIOD } from '../../Constants/Route';
import RouteStatus from '../RouteStatus/RouteStatus';
import timeFromNow from '../../Constants/DateTimeFormatter';
import RouteContext from '../../contexts/RouteContext';
import { avail, notAvail } from '../../utils';
import getArrayFromObject from '../../utils/getArrayFromObject';
import Category from '../Category/Category';
import './RouteCard.css';
import { routeCategoryToString } from '@/lib/routeHelpers';

class RouteCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageIsLoading: true,
    };
  }

  render() {
    const {
      user, route,
    } = this.props;
    const { imageIsLoading } = this.state;
    moment.locale('ru');
    const date = moment().add(SOON_END_PERIOD, 'days');
    const installedUntil = route.installed_until ? moment(route.installed_until) : null;
    const clockIcons = require('./images/card-sprite.svg').default;
    const ascents = avail(route.ascents) && getArrayFromObject(route.ascents);
    const ascent = (
      notAvail(user) || notAvail(ascents)
        ? null
        : (R.find(R.propEq('user_id', user.id))(ascents))
    );
    return (
      <RouteContext.Provider value={{ route }}>
        <a
          className={`card-m${
            (ascent && ascent.result !== 'unsuccessful')
              ? ' card-m_done'
              : ''
          }`}
        >
          <article className="card-m__inner">
            <div className="card-m__image">
              <div className="card-m__image-inner">
                {
                  route.photo && (
                    <img
                      src={route.photo.thumb_url}
                      alt={route.name}
                      onLoad={() => this.setState({ imageIsLoading: false })}
                      style={{ visibility: imageIsLoading ? 'hidden' : 'visible' }}
                    />
                  )
                }
              </div>
              <div className="card-m__route-status">
                {
                  (ascent && ascent.result !== 'unsuccessful') && (
                    <div className="route-card__track-status">
                      <RouteStatus />
                    </div>
                  )
                }
              </div>
            </div>
            <div className="card-m__info">
              <div className="card-m__header">
                <div className="card-m__number">
                  {route.number ? `№${route.number}` : `#${route.id}`}
                </div>
                <h1 className="card-m__title">{route.name}</h1>
              </div>
              <div className="card-m__footer">
                <span
                  className={
                    `card-m__date${(installedUntil && date >= installedUntil)
                      ? ' card-m__date_end-soon'
                      : ''
                    }`}
                >
                  {
                    route.installed_until && (
                      <>
                        <span className="card-m__date-icon">
                          <svg>
                            <use
                              xlinkHref={
                                (installedUntil && date >= installedUntil)
                                  ? `${clockIcons}#icon-alarm`
                                  : `${clockIcons}#icon-clock`
                              }
                            />
                          </svg>
                        </span>
                        {timeFromNow(moment(route.installed_until))}
                      </>
                    )
                  }
                </span>
                <span className="card-m__complexity">
                  <Category
                    category={routeCategoryToString(route)}
                    size="small"
                    position="right"
                    color={route.marks_color?.color || 'rgba(0, 0, 0, 0)'}
                  />
                  {
                    route.holds_color && (
                      <div
                        className="card-m__route_holds_color"
                        style={{ backgroundColor: route.holds_color?.color || 'rgba(0, 0, 0, 0)' }}
                      />
                    )
                  }
                </span>
              </div>
            </div>
          </article>
        </a>
      </RouteContext.Provider>
    );
  }
}

RouteCard.propTypes = {
  route: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.usersStore.users[state.usersStore.currentUserId],
});

export default withRouter(connect(mapStateToProps)(RouteCard));
