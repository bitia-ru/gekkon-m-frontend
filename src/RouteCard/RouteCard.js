import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { SOON_END_PERIOD } from '../Constants/Route';
import RouteStatus from '../RouteStatus/RouteStatus';
import { TimeFromNow } from '../Constants/DateTimeFormatter';
import clockIcons from '../../img/route-card-sprite/card-sprite.svg';
import './RouteCard.css';

const RouteCard = ({
  ascent, route, onRouteClick,
}) => {
  moment.locale('ru');
  const date = moment().add(SOON_END_PERIOD, 'days');
  const installedUntil = route.installed_until ? moment(route.installed_until) : null;
  return (
    <div
      role="button"
      tabIndex="0"
      className="content-m__col-sm-6 content-m__col-xs-12"
      onClick={onRouteClick}
    >
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
                route.photo
                  ? (
                    <img
                      src={route.photo.thumb_url}
                      alt={route.name}
                    />
                  )
                  : ''
              }
            </div>
            <div className="card-m__route-status">
              {
                (ascent && ascent.result !== 'unsuccessful')
                  ? (
                    <div className="route-card__track-status">
                      <RouteStatus ascent={ascent} />
                    </div>
                  )
                  : ''
              }
            </div>
          </div>
          <div className="card-m__info">
            <div className="card-m__header">
              <div className="card-m__number">
                {
                  route.number
                    ? `№${route.number}`
                    : `#${route.id}`
                }
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
                  route.installed_until
                    ? (
                      <React.Fragment>
                        <span className="card-m__date-icon">
                          {
                            (installedUntil && date >= installedUntil)
                              ? (
                                <svg>
                                  <use xlinkHref={`${clockIcons}#icon-alarm`} />
                                </svg>
                              )
                              : (
                                <svg>
                                  <use xlinkHref={`${clockIcons}#icon-clock`} />
                                </svg>
                              )
                          }
                        </span>
                        {TimeFromNow(moment(route.installed_until))}
                      </React.Fragment>
                    )
                    : ''
                }
              </span>
              <span className="card-m__complexity">
                <div className="card-m__level">
                  {route.category}
                </div>
              </span>
            </div>
          </div>
        </article>
      </a>
    </div>
  );
};

RouteCard.propTypes = {
  ascent: PropTypes.object,
  route: PropTypes.object.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};

RouteCard.defaultProps = {
  ascent: null,
};

export default RouteCard;
