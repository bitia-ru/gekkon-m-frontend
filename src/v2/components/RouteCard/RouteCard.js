import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { SOON_END_PERIOD } from '@/v1/Constants/Route';
import RouteStatus from '@/v1/components/RouteStatus/RouteStatus';
import timeFromNow from '@/v1/Constants/DateTimeFormatter';
import RouteContext from '@/v1/contexts/RouteContext';
import Category from '@/v1/components/Category/Category';
import { css } from '../../aphrodite';
import styles from './styles';

class RouteCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageIsLoading: true,
    };
  }

  render() {
    const { route } = this.props;
    const { imageIsLoading } = this.state;
    moment.locale('ru');
    const date = moment().add(SOON_END_PERIOD, 'days');
    const installedUntil = route.installed_until ? moment(route.installed_until) : null;
    const clockIcons = require('./images/card-sprite.svg');
    const { ascent_result: ascentResult } = route;
    const ascentIsSuccess = ascentResult && ascentResult !== 'unsuccessful';
    const endSoon = installedUntil && date >= installedUntil;
    return (
      <RouteContext.Provider value={{ route }}>
        <a
          className={
            css(
              styles.cardM,
              ascentIsSuccess && styles.cardMDone,
            )
          }
        >
          <article className={css(styles.cardMInner)}>
            <div className={css(styles.cardMImage)}>
              <div className={css(styles.cardMImageInner)}>
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
              <div className={css(styles.cardMRouteStatus)}>
                {
                  ascentIsSuccess && (
                    <div>
                      <RouteStatus />
                    </div>
                  )
                }
              </div>
            </div>
            <div className={css(styles.cardMInfo)}>
              <div className={css(styles.cardMHeader)}>
                <div className={css(styles.cardMNumber)}>
                  {route.number ? `№${route.number}` : `#${route.id}`}
                </div>
                <h1 className={css(styles.cardMTitle)}>{route.name}</h1>
              </div>
              <div className={css(styles.cardMFooter)}>
                <span
                  className={
                    css(
                      styles.cardMDate,
                      endSoon && styles.cardMDateEndSoon,
                    )
                  }
                >
                  {
                    route.installed_until && (
                      <>
                        <span
                          className={
                            css(
                              styles.cardMDateIcon,
                              endSoon && styles.cardMDateIconEndSoon,
                            )
                          }
                        >
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
                <span className={css(styles.cardMComplexity)}>
                  <Category
                    category={route.category}
                    size="small"
                    position="right"
                    color={route.marks_color?.color || 'rgba(0, 0, 0, 0)'}
                  />
                  {
                    route.holds_color && (
                      <div
                        className={css(styles.cardMRouteHoldsColor)}
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
