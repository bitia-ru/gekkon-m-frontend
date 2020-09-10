import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import moment from 'moment';
import { ROUTE_KINDS } from '@/v1/Constants/Route';
import { DATE_FORMAT } from '@/v1/Constants/Date';
import { getUserName } from '@/v1/Constants/User';
import RouteContext from '@/v1/contexts/RouteContext';
import './RouteDataEditableTable.css';
import CategorySelector from '@/v2/components/CategorySelector/CategorySelector';
import RouteColorPickerSelector
  from '@/v2/components/RouteColorPickerSelector/RouteColorPickerSelector';
import DatePickerSelector from '@/v2/components/DatePickerSelector/DatePickerSelector';
import DropDownPersonListSelector
  from '@/v2/components/DropDownPersonListSelector/DropDownPersonListSelector';
import DropDownListSelector from '@/v2/components/DropDownListSelector/DropDownListSelector';

const RouteDataEditableTable = ({
  sectors,
  onRouteParamChange,
  routeMarkColors,
  users,
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
                  <CategorySelector
                    category={route.category}
                    onChangeCategory={category => onRouteParamChange(category, 'category')}
                  />
                </div>
                <div className="route-m__table-row">
                  <div className="route-m__table-item route-m__table-item_header">
                    Зацепы:
                  </div>
                  <div className="route-m__table-item route-m__table-item-right">
                    <RouteColorPickerSelector
                      color={route.holds_color}
                      fieldSelectClass={fieldSelectClass}
                      routeMarkColors={routeMarkColors}
                      onChange={
                        (holdsColor) => {
                          onRouteParamChange(holdsColor, 'holds_color');
                        }
                      }
                    />
                  </div>
                </div>
                <div className="route-m__table-row">
                  <div className="route-m__table-item route-m__table-item_header">
                    Маркировка:
                  </div>
                  <div className="route-m__table-item route-m__table-item-right">
                    <RouteColorPickerSelector
                      color={route.marks_color}
                      fieldSelectClass={fieldSelectClass}
                      routeMarkColors={routeMarkColors}
                      onChange={
                        (marksColor) => {
                          onRouteParamChange(marksColor, 'marks_color');
                        }
                      }
                    />
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
                              <DropDownListSelector
                                value={
                                  route.kind
                                    ? R.find(R.propEq('title', route.kind))(ROUTE_KINDS).text
                                    : ROUTE_KINDS[0].text
                                }
                                items={ROUTE_KINDS}
                                onChange={
                                  (id) => {
                                    onRouteParamChange(
                                      R.find(R.propEq('id', id), ROUTE_KINDS).title, 'kind',
                                    );
                                  }
                                }
                                fieldSelectClass="field-select-m__select field-select-m__select-transparent field-select-m__select_small"
                              />
                            </div>
                          )
                          : (
                            <>
                              {R.find(R.propEq('title', route.kind), ROUTE_KINDS).text}
                            </>
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
                      <DatePickerSelector
                        clearable
                        formatter={d => moment(d).format(DATE_FORMAT)}
                        date={route.installed_at}
                        onChange={
                          date => onRouteParamChange(date ? date.format() : null, 'installed_at')
                        }
                        dateClass={dateClass}
                      />
                    </div>
                  </div>
                </div>
                <div className="route-m__table-row">
                  <div className="route-m__table-item route-m__table-item_header">
                    Скручена:
                  </div>
                  <div className="route-m__table-item route-m__table-item-right">
                    <div className="field-select-m route-m__field-select">
                      <DatePickerSelector
                        clearable
                        formatter={d => moment(d).format(DATE_FORMAT)}
                        date={route.installed_until}
                        onChange={
                          date => onRouteParamChange(date ? date.format() : null, 'installed_until')
                        }
                        dateClass={dateClass}
                      />
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
                          <DropDownPersonListSelector
                            name={name}
                            users={users}
                            fieldSelectClass={fieldSelectClass}
                            onChange={
                              (author) => {
                                onRouteParamChange(author, 'author');
                              }
                            }
                          />
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
  onRouteParamChange: PropTypes.func,
  routeMarkColors: PropTypes.array,
  users: PropTypes.array,
};

const mapStateToProps = state => ({
  sectors: state.sectorsStore.sectors,
});

export default withRouter(connect(mapStateToProps)(RouteDataEditableTable));
