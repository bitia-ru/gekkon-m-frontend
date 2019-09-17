import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { SOON_END_PERIOD } from '../Constants/Route';
import RouteStatus from '../RouteStatus/RouteStatus';
import timeFromNow from '../Constants/DateTimeFormatter';
import Category from '../Category/Category';
import clockIcons from '../../img/route-card-sprite/card-sprite.svg';
import './RouteCard.css';

export default class RouteCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageIsLoading: true,
    };
  }

  render() {
    const {
      ascent, route,
    } = this.props;
    const { imageIsLoading } = this.state;
    moment.locale('ru');
    const date = moment().add(SOON_END_PERIOD, 'days');
    const installedUntil = route.installed_until ? moment(route.installed_until) : null;
    return (
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
                    <RouteStatus ascent={ascent} />
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
                <Category category={route.category} size="small" position="right" />
              </span>
            </div>
          </div>
        </article>
      </a>
    );
  }
}

RouteCard.propTypes = {
  ascent: PropTypes.object,
  route: PropTypes.object.isRequired,
};

RouteCard.defaultProps = {
  ascent: null,
};
