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
import CategorySelector from '@/v2/components/CategorySelector/CategorySelector';
import RouteColorPickerSelector
  from '@/v2/components/RouteColorPickerSelector/RouteColorPickerSelector';
import DatePickerSelector from '@/v2/components/DatePickerSelector/DatePickerSelector';
import DropDownPersonListSelector
  from '@/v2/components/DropDownPersonListSelector/DropDownPersonListSelector';
import DropDownListSelector from '@/v2/components/DropDownListSelector/DropDownListSelector';
import { css, StyleSheet } from '@/v2/aphrodite';

const RouteDataEditableTable = ({
  sectors,
  onRouteParamChange,
  routeMarkColors,
  users,
  match,
  spots,
}) => {
  const fieldSelectClass = css(
    styles.fieldSelectMSelect,
    styles.fieldSelectMSelectTransparent,
    styles.fieldSelectMSelectSmall,
    styles.routeMLink,
    styles.routeMLinkEdit,
  );
  const dateClass = css(
    styles.fieldSelectMSelect,
    styles.fieldSelectMSelectTransparent,
    styles.fieldSelectMSelectSmall,
  );
  const onMarksColorSelect = (marksColor) => {
    const spotId = match.params.id;
    const spot = spots[spotId];
    const { markColorToCategory } = spot.data;
    onRouteParamChange(marksColor, 'marks_color');
    if (markColorToCategory && markColorToCategory[marksColor.id]) {
      onRouteParamChange(markColorToCategory[marksColor.id], 'category');
    }
  };
  return (
    <RouteContext.Consumer>
      {
        ({ route }) => {
          const sector = sectors[route.sector_id];
          const name = route.author ? getUserName(route.author) : 'Неизвестен';
          return (
            <>
              <div className={css(styles.routeMTable)}>
                <div className={css(styles.routeMTableRow)}>
                  <div className={css(styles.routeMTableItem, styles.routeMTableItemHeader)}>
                    Категория:
                  </div>
                  <CategorySelector
                    category={route.category}
                    onChangeCategory={category => onRouteParamChange(category, 'category')}
                  />
                </div>
                <div className={css(styles.routeMTableRow)}>
                  <div className={css(styles.routeMTableItem, styles.routeMTableItemHeader)}>
                    Зацепы:
                  </div>
                  <div className={css(styles.routeMTableItem, styles.routeMTableItemRight)}>
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
                <div className={css(styles.routeMTableRow)}>
                  <div className={css(styles.routeMTableItem, styles.routeMTableItemHeader)}>
                    Маркировка:
                  </div>
                  <div className={css(styles.routeMTableItem, styles.routeMTableItemRight)}>
                    <RouteColorPickerSelector
                      color={route.marks_color}
                      fieldSelectClass={fieldSelectClass}
                      routeMarkColors={routeMarkColors}
                      onChange={onMarksColorSelect}
                    />
                  </div>
                </div>
                {
                  sector && <div className={css(styles.routeMTableRow)}>
                    <div className={css(styles.routeMTableItem, styles.routeMTableItemHeader)}>
                      Тип:
                    </div>
                    <div className={css(styles.routeMTableItem, styles.routeMTableItemRight)}>
                      {
                        sector.kind === 'mixed'
                          ? (
                            <div className={css(styles.fieldSelectMSelect)}>
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
                                fieldSelectClass={
                                  css(
                                    styles.fieldSelectMSelect,
                                    styles.fieldSelectMSelectTransparent,
                                    styles.fieldSelectMSelectSmall,
                                  )
                                }
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
                <div className={css(styles.routeMTableRow)}>
                  <div className={css(styles.routeMTableItem, styles.routeMTableItemHeader)}>
                    Накручена:
                  </div>
                  <div className={css(styles.routeMTableItem, styles.routeMTableItemRight)}>
                    <div>
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
                <div className={css(styles.routeMTableRow)}>
                  <div className={css(styles.routeMTableItem, styles.routeMTableItemHeader)}>
                    Скручена:
                  </div>
                  <div className={css(styles.routeMTableItem, styles.routeMTableItemRight)}>
                    <div>
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
                      <div className={css(styles.routeMTableRow)}>
                        <div className={css(styles.routeMTableItem, styles.routeMTableItemHeader)}>
                          Накрутчик:
                        </div>
                        <div className={css(styles.routeMTableItem, styles.routeMTableItemRight)}>
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
  fieldSelectMSelect: {
    width: '100%',
    height: '54px',
    lineHeight: '1.3em',
    display: 'flex',
    alignItems: 'center',
    border: '2px solid #DDE2EF',
    borderRadius: 0,
    padding: '14px 40px 14px 20px',
    backgroundColor: '#ffffff',
    outline: 'none',
    transition: 'box-shadow .4s ease-out',
    fontFamily: 'GilroyRegular',
    fontSize: '14px',
    boxSizing: 'border-box',
    position: 'relative',
    maxWidth: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    ':before': {
      content: '\'\'',
      position: 'absolute',
      right: '20px',
      top: '50%',
      width: '14px',
      height: '9px',
      transform: 'translateY(-50%)',
      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2214%22%20height%3D%229%22%20viewBox%3D%220%200%2014%209%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20d%3D%22M7%209L0.0717972%20-1.30507e-06L13.9282%20-9.36995e-08L7%209Z%22%20fill%3D%22%231A1A1A%22/%3E%0A%3C/svg%3E%0A")',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% auto',
      pointerEvents: 'none',
      zIndex: 2,
    },
    ':after': {
      width: '45px',
      height: '100%',
      backgroundColor: '#ffffff',
      position: 'absolute',
      content: '\'\'',
      right: 0,
      top: 0,
      zIndex: 1,
    },
    ':focus': { boxShadow: '0px 0px 0px 2px rgba(0, 108, 235, 0.7)' },
  },
  fieldSelectMSelectTransparent: {
    border: '2px solid transparent',
    transition: 'box-shadow .4s ease-out, border .4s ease-out',
    ':before': {
      opacity: 0,
      transition: 'opacity .4s ease-out',
    },
    ':hover': {
      border: '2px solid #DDE2EF',
      ':before': { opacity: 1 },
    },
    ':focus': {
      border: '2px solid #DDE2EF',
      ':before': { opacity: 1 }
    },
  },
  fieldSelectMSelectSmall: {
    height: '29px',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: '7px',
    paddingRight: '16px',
    width: '100%',
    maxWidth: '220px',
    fontSize: '14px',
    ':before': {
      width: '6px',
      height: '4px',
      right: '5px',
    },
    ':after': { width: '15px' },
  },
  routeMLink: {
    color: '#006CEB',
    textDecoration: 'none',
    ':hover': { textDecoration: 'underline' },
  },
  routeMLinkEdit: {
    width: '100%',
    ':hover': { textDecoration: 'none' },
  },
});

RouteDataEditableTable.propTypes = {
  sectors: PropTypes.object.isRequired,
  spots: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  onRouteParamChange: PropTypes.func,
  routeMarkColors: PropTypes.array,
  users: PropTypes.array,
};

const mapStateToProps = state => ({
  sectors: state.sectorsStore.sectors,
  spots: state.spotsStoreV2.spots,
});

export default withRouter(connect(mapStateToProps)(RouteDataEditableTable));
