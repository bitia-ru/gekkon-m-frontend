import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import moment from 'moment';
import { GetCategoryColor } from '../Constants/Categories';
import { ROUTE_KINDS } from '../Constants/Route';
import { DATE_FORMAT } from '../Constants/Date';
import getColorStyle from '../Constants/RouteColorPicker';
import { GetUserName } from '../Constants/User';
import './RouteDataEditableTable.css';

const RouteDataEditableTable = ({
  sector,
  route,
  showCategorySlider,
  showKindSelect,
  showAuthorSelect,
  showRouteHoldsColorPicker,
  showRouteMarksColorPicker,
  showInstalledAtSelect,
  showInstalledUntilSelect,
}) => {
  const name = route.author ? GetUserName(route.author) : 'Неизвестен';
  const fieldSelectClass = 'field-select-m__select field-select-m__select-transparent field-select-m__select_small route-m__link route-m__link_edit';
  const dateClass = 'field-select-m__select field-select-m__select-transparent field-select-m__select_small';
  return (
    <React.Fragment>
      <div className="route-m__table">
        <div className="route-m__table-row">
          <div className="route-m__table-item route-m__table-item_header">
            Сложность:
          </div>
          <div className="route-m__table-item route-m__table-item-right">
            <div
              role="button"
              tabIndex="0"
              className="level"
              onClick={showCategorySlider}
              style={{ border: `4px solid ${GetCategoryColor(route.category)}` }}
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
            <div className="route-m__field-select">
              <button
                type="button"
                onClick={showRouteHoldsColorPicker}
                className={fieldSelectClass}
              >
                <div className="mark-color-picker__info">
                  <div
                    className="mark-color-picker__color"
                    style={getColorStyle(route.holds_color)}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="route-m__table-row">
          <div className="route-m__table-item route-m__table-item_header">
              Цвет маркировки:
          </div>
          <div className="route-m__table-item route-m__table-item-right">
            <div className="route-m__field-select">
              <button
                type="button"
                onClick={showRouteMarksColorPicker}
                className={fieldSelectClass}
              >
                <div className="mark-color-picker__info">
                  <div
                    className="mark-color-picker__color"
                    style={getColorStyle(route.marks_color)}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="route-m__table-row">
          <div className="route-m__table-item route-m__table-item_header">
            Тип:
          </div>
          <div className="route-m__table-item route-m__table-item-right">
            {
              sector.kind === 'mixed'
                ? (
                  <div className="route-m__field-select">
                    <button
                      type="button"
                      tabIndex="0"
                      onClick={showKindSelect}
                      className="field-select-m__select field-select-m__select-transparent field-select-m__select_small"
                    >
                      {
                        route.kind
                          ? R.find(R.propEq('title', route.kind))(ROUTE_KINDS).text
                          : ROUTE_KINDS[0].text
                      }
                    </button>
                  </div>
                )
                : (
                  <React.Fragment>
                    {R.find(R.propEq('title', route.kind), ROUTE_KINDS).text}
                  </React.Fragment>
                )
            }
          </div>
        </div>
        <div className="route-m__table-row">
          <div className="route-m__table-item route-m__table-item_header">
            Дата накрутки:
          </div>
          <div className="route-m__table-item route-m__table-item-right">
            <div className="field-select-m route-m__field-select">
              <div className="field-select-m__container">
                <button
                  type="button"
                  onClick={showInstalledAtSelect}
                  className={dateClass}
                >
                  {route.installed_at ? moment(route.installed_at).format(DATE_FORMAT) : null}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="route-m__table-row">
          <div className="route-m__table-item route-m__table-item_header">
            Дата cкрутки:
          </div>
          <div className="route-m__table-item route-m__table-item-right">
            <div className="field-select-m route-m__field-select">
              <div className="field-select-m__container">
                <button
                  type="button"
                  onClick={showInstalledUntilSelect}
                  className={dateClass}
                >
                  {
                    route.installed_until
                      ? moment(route.installed_until).format(DATE_FORMAT)
                      : null
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="route-m__table-row">
          <div className="route-m__table-item route-m__table-item_header">
            Накрутчик:
          </div>
          <div className="route-m__table-item route-m__table-item-right">
            <div className="route-m__field-select">
              <button
                type="button"
                onClick={showAuthorSelect}
                className={fieldSelectClass}
              >
                {name === null ? 'Неизвестен' : name}
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

RouteDataEditableTable.propTypes = {
  route: PropTypes.object.isRequired,
  sector: PropTypes.object.isRequired,
  showCategorySlider: PropTypes.func.isRequired,
  showKindSelect: PropTypes.func.isRequired,
  showAuthorSelect: PropTypes.func.isRequired,
  showRouteHoldsColorPicker: PropTypes.func.isRequired,
  showRouteMarksColorPicker: PropTypes.func.isRequired,
  showInstalledAtSelect: PropTypes.func.isRequired,
  showInstalledUntilSelect: PropTypes.func.isRequired,
};

export default RouteDataEditableTable;
