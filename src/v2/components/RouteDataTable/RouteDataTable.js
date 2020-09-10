import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as R from 'ramda';
import { getUserName } from '@/v1/Constants/User';
import { ROUTE_KINDS } from '@/v1/Constants/Route';
import getColorStyle from '@/v1/Constants/RouteColorPicker';
import { getCategoryColor } from '@/v1/Constants/Categories';
import Category from '@/v2/components/Category/Category';
import './RouteDataTable.css';

const RouteDataTable = ({ route, user }) => {
  const isCurrentUserRoute = user && route.author_id === user.id;
  let name = route.author ? getUserName(route.author) : null;
  if (!isCurrentUserRoute && name === null && route.author_id !== null) {
    if (user && user.role === 'admin') {
      name = getUserName(route.author, true);
    }
    if (user && user.role === 'creator') {
      name = `Пользователь #${route.author.id}`;
    }
  } else if (isCurrentUserRoute) {
    name = 'Вы';
  }

  return (
    <div className="route-m__table">
      <div className="route-m__table-row">
        <div className="route-m__table-item route-m__table-item_header">
          Категория:
        </div>
        <div className="route-m__table-item route-m__table-item-right">
          <Category category={route.category} color={getCategoryColor(route.category)} />
        </div>
      </div>
      <div className="route-m__table-row">
        <div className="route-m__table-item route-m__table-item_header">
          Зацепы:
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
      {
        route.marks_color && (
          <div className="route-m__table-row">
            <div className="route-m__table-item route-m__table-item_header">
              Маркировка:
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
        )
      }
      <div className="route-m__table-row">
        <div className="route-m__table-item route-m__table-item_header">
          Тип:
        </div>
        <div className="route-m__table-item route-m__table-item-right">
          {
            (() => {
              const kind = R.find(R.propEq('title', route.kind), ROUTE_KINDS);
              return kind ? kind.text : '';
            })()
          }
        </div>
      </div>
      {
        route.installed_at && (<>
          <div className="route-m__table-row">
            <div className="route-m__table-item route-m__table-item_header">
              Накручена:
            </div>
            <div className="route-m__table-item route-m__table-item-right">
              {moment(route.installed_at).format('DD.MM.YYYY')}
            </div>
          </div>
        </>)
      }
      {
        route.installed_until && (<>
          <div className="route-m__table-row">
            <div className="route-m__table-item route-m__table-item_header">
              Cкручена:
            </div>
            <div className="route-m__table-item route-m__table-item-right">
              {moment(route.installed_until).format('DD.MM.YYYY')}
            </div>
          </div>
        </>)
      }
      {
        name && (<>
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
        </>)
      }
    </div>
  );
};

RouteDataTable.propTypes = {
  user: PropTypes.object,
  route: PropTypes.object.isRequired,
};

export default RouteDataTable;
