import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as R from 'ramda';
import { getCategoryColor } from '../Constants/Categories';
import { getUserName } from '../Constants/User';
import { ROUTE_KINDS } from '../Constants/Route';
import getColorStyle from '../Constants/RouteColorPicker';
import './RouteDataTable.css';

const RouteDataTable = ({ route, user }) => {
  const isCurrentUserRoute = user && route.author_id === user.id;
  let name = route.author ? getUserName(route.author) : null;
  name = name || 'Неизвестен';
  if (!isCurrentUserRoute && name === 'Неизвестен' && route.author_id !== null) {
    if (user.role === 'admin') {
      name = getUserName(route.author, true);
    }
    if (user.role === 'creator') {
      name = `Пользователь #${route.author.id}`;
    }
  }
  return (
    <div className="route-m__table">
      <div className="route-m__table-row">
        <div className="route-m__table-item route-m__table-item_header">
          Сложность:
        </div>
        <div className="route-m__table-item route-m__table-item-right">
          <div
            className="level"
            style={{ border: `4px solid ${getCategoryColor(route.category)}` }}
          >
            {route.category}
          </div>
        </div>
      </div>
      <div className="route-m__table-row">
        <div className="route-m__table-item route-m__table-item_header">
          Цвет зацепов:
        </div>
        <div className="route-m__table-item route-m__table-item-right">
          <div className="mark-color-picker__info">
            <div
              className="mark-color-picker__color"
              style={getColorStyle(route.holds_color)}
            />
          </div>
        </div>
      </div>
      <div className="route-m__table-row">
        <div className="route-m__table-item route-m__table-item_header">
          Цвет маркировки:
        </div>
        <div className="route-m__table-item route-m__table-item-right">
          <div className="mark-color-picker__info">
            <div
              className="mark-color-picker__color"
              style={getColorStyle(route.marks_color)}
            />
          </div>
        </div>
      </div>
      <div className="route-m__table-row">
        <div className="route-m__table-item route-m__table-item_header">
          Народная категория:
        </div>
        <div className="route-m__table-item route-m__table-item-right" />
      </div>
      <div className="route-m__table-row">
        <div className="route-m__table-item route-m__table-item_header">
          Тип:
        </div>
        <div className="route-m__table-item route-m__table-item-right">
          {R.find(R.propEq('title', route.kind), ROUTE_KINDS).text}
        </div>
      </div>
      <div className="route-m__table-row">
        <div className="route-m__table-item route-m__table-item_header">
          Дата накрутки:
        </div>
        <div className="route-m__table-item route-m__table-item-right">
          {
            route.installed_at
              ? (
                moment(route.installed_at).format('DD.MM.YYYY')
              )
              : ''
          }
        </div>
      </div>
      <div className="route-m__table-row">
        <div className="route-m__table-item route-m__table-item_header">
          Дата cкрутки:
        </div>
        <div className="route-m__table-item route-m__table-item-right">
          {
            route.installed_until
              ? (
                moment(route.installed_until).format('DD.MM.YYYY')
              )
              : ''
          }
        </div>
      </div>
      <div className="route-m__table-row">
        <div className="route-m__table-item route-m__table-item_header">
          Накрутчик:
        </div>
        <div className="route-m__table-item route-m__table-item-right">
          <div
            style={{
              color: '#006CEB',
              textDecoration: 'none',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {isCurrentUserRoute ? 'Вы' : name}
          </div>
        </div>
      </div>
    </div>
  );
};

RouteDataTable.propTypes = {
  user: PropTypes.object,
  route: PropTypes.object.isRequired,
};

export default RouteDataTable;
