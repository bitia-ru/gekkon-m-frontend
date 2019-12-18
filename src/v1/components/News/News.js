import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import moment from 'moment';
import classNames from 'classnames';
import { getUserName } from '../../Constants/User';
import { MAX_LENGTH } from '../../Constants/News';
import { routeCategoriesDiff } from '../../Constants/Categories';
import timeFromNow from '../../Constants/DateTimeFormatter';
import RouteColor from '../RouteColor/RouteColor';
import './News.css';

const News = ({ data }) => {
  const {
    user,
    title,
    routes,
    time,
    message,
  } = data;
  const categories = R.map(route => route.category, routes);
  let routesSorted;
  let category;
  let route;
  if (categories.length === 1) {
    [category] = categories;
    [route] = routes;
  } else {
    routesSorted = R.sort(routeCategoriesDiff, routes);
  }
  moment.locale('ru');

  return (
    <article className="news-card-m">
      <div className="news-card-m__author-block">
        <div className="news-card-m__author-avatar">
          {user && user.avatar && <img src={user.avatar.url} alt={getUserName(user)} />}
        </div>
        <div className="news-card-m__author-info">
          <div className="news-card-m__author-name">{user && getUserName(user)}</div>
          <div className="news-card-m__author-data">{message}</div>
          <div className="news-card-m__author-date">{timeFromNow(moment(time))}</div>
        </div>
      </div>
      <h1 className="news-card-m__title">
        <div
          className={
            classNames({
              'news-card-m__title-link': true,
              'news-card-m__title-link_small': title.length > MAX_LENGTH,
            })
          }
        >
          {title}
        </div>
      </h1>
      <div className="news-card-m__level-block">
        {
          category
            ? (
              <>
                <div className="news-card-m__level-block-col">
                  <div className="level level_5c">
                    {category}
                  </div>
                </div>
                <div className="news-card-m__level-block-col">
                  <RouteColor size="medium" route={route} fieldName="holds_color" />
                </div>
              </>
            )
            : (
              <>
                <div className="news-card-m__level-block-col">
                  <div className="news-card-m__level-prefix">от</div>
                  <div className="level">
                    {routesSorted[0].category}
                  </div>
                </div>
                <div className="news-card-m__level-block-col">
                  <div className="news-card-m__level-prefix">до</div>
                  <div className="level">
                    {R.last(routesSorted).category}
                  </div>
                </div>
              </>
            )
        }
      </div>
    </article>
  );
};

News.propTypes = {
  data: PropTypes.object.isRequired,
};

export default News;
