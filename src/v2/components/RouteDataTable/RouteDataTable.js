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
import { StyleSheet, css } from '@/v2/aphrodite';

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
    <div className={css(styles.routeMTable)}>
      <div className={css(styles.routeMTableRow)}>
        <div className={css(styles.routeMTableItem, styles.routeMTableItemHeader)}>
          Категория:
        </div>
        <div className={css(styles.routeMTableItem, styles.routeMTableItemRight)}>
          <Category category={route.category} color={getCategoryColor(route.category)} />
        </div>
      </div>
      <div className={css(styles.routeMTableRow)}>
        <div className={css(styles.routeMTableItem, styles.routeMTableItemHeader)}>
          Зацепы:
        </div>
        <div className={css(styles.routeMTableItem, styles.routeMTableItemRight)}>
          <div className={css(styles.markColorPickerInfo)}>
            <div
              className={css(styles.markColorPickerColor)}
              style={getColorStyle(route.holds_color)}
            />
          </div>
        </div>
      </div>
      {
        route.marks_color && (
          <div className={css(styles.routeMTableRow)}>
            <div className={css(styles.routeMTableItem, styles.routeMTableItemHeader)}>
              Маркировка:
            </div>
            <div className={css(styles.routeMTableItem, styles.routeMTableItemRight)}>
              <div className={css(styles.markColorPickerInfo)}>
                <div
                  className={css(styles.markColorPickerColor)}
                  style={getColorStyle(route.marks_color)}
                />
              </div>
            </div>
          </div>
        )
      }
      <div className={css(styles.routeMTableRow)}>
        <div className={css(styles.routeMTableItem, styles.routeMTableItemHeader)}>
          Тип:
        </div>
        <div className={css(styles.routeMTableItem, styles.routeMTableItemRight)}>
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
          <div className={css(styles.routeMTableRow)}>
            <div className={css(styles.routeMTableItem, styles.routeMTableItemHeader)}>
              Накручена:
            </div>
            <div className={css(styles.routeMTableItem, styles.routeMTableItemRight)}>
              {moment(route.installed_at).format('DD.MM.YYYY')}
            </div>
          </div>
        </>)
      }
      {
        route.installed_until && (<>
          <div className={css(styles.routeMTableRow)}>
            <div className={css(styles.routeMTableItem, styles.routeMTableItemHeader)}>
              Cкручена:
            </div>
            <div className={css(styles.routeMTableItem, styles.routeMTableItemRight)}>
              {moment(route.installed_until).format('DD.MM.YYYY')}
            </div>
          </div>
        </>)
      }
      {
        name && (<>
          <div className={css(styles.routeMTableRow)}>
            <div className={css(styles.routeMTableItem, styles.routeMTableItemHeader)}>
              Накрутчик:
            </div>
            <div className={css(styles.routeMTableItem, styles.routeMTableItemRight)}>
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

const styles = StyleSheet.create({
  routeMTable: {
    marginBottom: '22px',
    paddingTop: '22px',
  },
  routeMTableRow: {
    display: 'flex',
    padding: '5px 0 5px',
  },
  routeMTableItem: {
    width: '50%',
    fontSize: '14px',
  },
  routeMTableItemHeader: { color: '#828282' },
  routeMTableItemRight: {
    paddingLeft: '20px',
    boxSizing: 'border-box',
  },
  markColorPickerInfo: { cursor: 'pointer' },
  markColorPickerColor: {
    display: 'inline-block',
    width: '60px',
    height: '20px',
    verticalAlign: 'middle',
    marginLeft: '15px',
  },
});

RouteDataTable.propTypes = {
  user: PropTypes.object,
  route: PropTypes.object.isRequired,
};

export default RouteDataTable;
