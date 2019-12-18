import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import moment from 'moment';
import { ROUTE_KINDS } from '../../Constants/Route';
import { DATE_FORMAT } from '../../Constants/Date';
import getColorStyle from '../../Constants/RouteColorPicker';
import { getUserName } from '../../Constants/User';
import { getCategoryColor } from '../../Constants/Categories';
import Category from '../Category/Category';
import RouteContext from '../../contexts/RouteContext';
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
  const fieldSelectClass = 'field-select-m__select field-select-m__select-transparent field-select-m__select_small route-m__link route-m__link_edit';
  const dateClass = 'field-select-m__select field-select-m__select-transparent field-select-m__select_small';
  return (
    <RouteContext.Consumer>
      {
        ({ route }) => {
          const sector = sectors[route.sector_id];
          const name = route.author ? getUserName(route.author) : 'Неизвестен';
          return (
            <>
              <div className="route-m__table">
                <div className="route-m__table-row">
                  <div className="route-m__table-item route-m__table-item_header">
                    Категория:
                  </div>
                  <div className="route-m__table-item route-m__table-item-right">
                    <Category
                      category={route.category}
                      color={getCategoryColor(route.category)}
                      onClick={showCategorySlider}
                    />
                  </div>
                </div>
                <div className="route-m__table-row">
                  <div className="route-m__table-item route-m__table-item_header">
                    Зацепы:
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
                    Маркировка:
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
                {
                  sector && <div className="route-m__table-row">
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
                                style={{ outline: 'none' }}
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
                }
                <div className="route-m__table-row">
                  <div className="route-m__table-item route-m__table-item_header">
                    Накручена:
                  </div>
                  <div className="route-m__table-item route-m__table-item-right">
                    <div className="field-select-m route-m__field-select">
                      <div className="field-select-m__container">
                        <button
                          type="button"
                          onClick={showInstalledAtSelect}
                          className={dateClass}
                        >
                          {route.installed_at ? moment(route.installed_at)
                            .format(DATE_FORMAT) : null}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="route-m__table-row">
                  <div className="route-m__table-item route-m__table-item_header">
                    Скручена:
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
                              ? moment(route.installed_until)
                                .format(DATE_FORMAT)
                              : null
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {
                  (!route.data.personal)
                    ? (
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
                    )
                    : ''
                }
              </div>
            </>
          );
        }
      }
    </RouteContext.Consumer>
  );
};

RouteDataEditableTable.propTypes = {
  sectors: PropTypes.object.isRequired,
  showCategorySlider: PropTypes.func.isRequired,
  showKindSelect: PropTypes.func.isRequired,
  showAuthorSelect: PropTypes.func.isRequired,
  showRouteHoldsColorPicker: PropTypes.func.isRequired,
  showRouteMarksColorPicker: PropTypes.func.isRequired,
  showInstalledAtSelect: PropTypes.func.isRequired,
  showInstalledUntilSelect: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  sectors: state.sectorsStore.sectors,
});

export default withRouter(connect(mapStateToProps)(RouteDataEditableTable));
