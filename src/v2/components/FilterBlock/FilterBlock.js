import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import moment from 'moment/moment';
import { DATE_FORMAT, dateToTextFormatter } from '@/v1/Constants/Date';
import Button from '@/v1/components/Button/Button';
import PERIOD_FILTERS from '@/v1/Constants/PeriodFilters';
import { CATEGORIES } from '@/v1/Constants/Categories';
import { DEFAULT_FILTERS } from '@/v1/Constants/DefaultFilters';
import getFilters, { prepareFilters } from '@/v1/utils/getFilters';
import { setSelectedFilter, setSelectedPage } from '@/v1/actions';
import getViewMode from '@/v1/utils/getViewMode';
import { ModalContext } from '@/v2/modules/modalable';
import Modal from '@/v2/layouts/Modal';
import CategoryRangeSelector from '@/v2/components/CategoryRangeSelector/CategoryRangeSelector';
import DropDownListSelector from '@/v2/components/DropDownListSelector/DropDownListSelector';
import DatePickerSelector from '@/v2/components/DatePickerSelector/DatePickerSelector';
import DropDownListMultipleSelector
  from '@/v2/components/DropDownListMultipleSelector/DropDownListMultipleSelector';
import RESULT_FILTERS from '@/v1/Constants/ResultFilters';
import { avail } from '@/v1/utils';
import { css, StyleSheet } from '@/v2/aphrodite';

class FilterBlock extends Component {
  constructor(props) {
    super(props);

    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    const {
      categoryFrom,
      categoryTo,
      period,
      date,
      filters,
    } = getFilters(this.props.selectedFilters, spotId, sectorId);
    this.state = {
      period,
      date,
      filters: {...filters},
      categoryFrom,
      categoryTo,
    };
  }

  getSpotId = () => {
    const { match } = this.props;
    return parseInt(match.params.id, 10);
  };

  getSectorId = () => {
    const { match } = this.props;
    return match.params.sector_id ? parseInt(match.params.sector_id, 10) : 0;
  };

  save = (closeModal) => {
    const {
      period, date, filters, categoryFrom, categoryTo,
    } = this.state;
    this.changeAllFilters(
      categoryFrom, categoryTo, period, date, filters,
    );
    closeModal();
  };

  changeAllFilters = (categoryFrom, categoryTo, period, date, filters) => {
    const {
      user,
      setSelectedFilter: setSelectedFilterProp,
      setSelectedPage: setSelectedPageProp,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    let newFilters = {};
    if (categoryFrom !== null) {
      newFilters['categoryFrom'] = categoryFrom;
    }
    if (categoryTo !== null) {
      newFilters['categoryTo'] = categoryTo;
    }
    newFilters['period'] = period;
    newFilters['date'] = date;
    let filter = R.find(R.propEq('id', 'personal'))(R.values(filters));
    const personal = filter.selected;
    filter = R.find(R.propEq('id', 'outdated'))(R.values(filters));
    if (filter) {
      newFilters['outdated'] = filter.selected;
    }
    newFilters['personal'] = personal;
    if (user) {
      filter = R.find(R.propEq('id', 'liked'))(R.values(filters));
      newFilters['liked'] = filter.selected;
    }
    R.forEach(
      (resultKey) => {
        filter = R.find(R.propEq('id', resultKey))(R.values(filters));
        newFilters[resultKey] = filter.selected;
      },
      R.keys(RESULT_FILTERS),
    )
    setSelectedFilterProp(spotId, sectorId, newFilters);
    setSelectedPageProp(spotId, sectorId, 1);
  };

  setDefaultFilters = () => {
    this.setState({
      filters: prepareFilters(DEFAULT_FILTERS).filters,
    });
  };

  setAllFiltersToDefault = (closeModal) => {
    this.setState({
      period: DEFAULT_FILTERS.period,
      date: undefined,
      categoryFrom: DEFAULT_FILTERS.categoryFrom,
      categoryTo: DEFAULT_FILTERS.categoryTo,
      filters: prepareFilters(DEFAULT_FILTERS).filters,
    }, () => this.save(closeModal));
  };

  changePeriod = (id) => {
    this.setState({ period: id });
  };

  changeDate = (date) => {
    this.setState({ date: date ? date.format() : undefined });
  };

  changeFilters = (filters) => {
    this.setState({ filters });
  };

  changeCategoryFilter = (id) => {
    switch (id) {
    case 0:
      this.setState({
        categoryFrom: CATEGORIES[0], categoryTo: CATEGORIES[CATEGORIES.length - 1],
      });
      break;
    case 1:
      this.setState({ categoryFrom: CATEGORIES[0], categoryTo: '6a+' });
      break;
    case 2:
      this.setState({ categoryFrom: '6a', categoryTo: '6b+' });
      break;
    case 3:
      this.setState({ categoryFrom: '6b', categoryTo: '6c+' });
      break;
    case 4:
      this.setState({ categoryFrom: '6c', categoryTo: '7a+' });
      break;
    case 5:
      this.setState({ categoryFrom: '7a', categoryTo: CATEGORIES[CATEGORIES.length - 1] });
      break;
    default:
      break;
    }
  };

  render() {
    const {
      categoryFrom,
      categoryTo,
      period,
      date,
      filters,
    } = this.state;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    const { sectors, selectedViewModes, user } = this.props;
    const viewMode = getViewMode(sectors, selectedViewModes, spotId, sectorId);
    const formatter = (
      viewMode === 'scheme'
        ? dateToTextFormatter
        : (d => moment(d).format(DATE_FORMAT))
    );
    const defaultFilters = R.filter(
      e => !R.contains(e.id, R.concat(R.keys(RESULT_FILTERS), ['liked'])),
      filters,
    );
    const currentFilters = (
      viewMode === 'scheme'
        ? R.filter(f => f.id !== 'outdated', avail(user) ? filters : defaultFilters)
        : avail(user) ? filters : defaultFilters
    );
    return (
      <Modal>
        <ModalContext.Consumer>
          {
            ({ closeModal }) => (
              <>
                <h3 className={css(styles.modalBlockMTitle)}>Фильтры</h3>
                <div className={css(styles.modalBlockMFilterItem)}>
                  <div>
                    <span className={css(styles.fieldSelectMTitle)}>Категория</span>
                    <CategoryRangeSelector
                      categoryTo={categoryTo}
                      categoryFrom={categoryFrom}
                      onChangeCategoryFilter={this.changeCategoryFilter}
                    />
                  </div>
                </div>
                <div className={css(styles.modalBlockMFilterItem)}>
                  <div>
                    {
                      viewMode === 'scheme'
                        ? (
                          <>
                            <span className={css(styles.fieldSelectMTitle)}>Дата</span>
                            <DatePickerSelector
                              clearable
                              formatter={formatter}
                              date={date || DEFAULT_FILTERS.date}
                              onChange={this.changeDate}
                              dateClass={css(styles.fieldSelectMSelect)}
                              defaultDate="сегодня"
                            />
                          </>
                        )
                        : (
                          <>
                            <span className={css(styles.fieldSelectMTitle)}>Период</span>
                            <div className={css(styles.fieldSelectMContainer)}>
                              <DropDownListSelector
                                value={R.find(R.propEq('id', period))(PERIOD_FILTERS).text}
                                onChange={this.changePeriod}
                                items={PERIOD_FILTERS}
                                fieldSelectClass={css(styles.fieldSelectMSelect)}
                              />
                            </div>
                          </>
                        )
                    }
                  </div>
                </div>
                <div className={css(styles.modalBlockMFilterItem)}>
                  <div>
                    <span className={css(styles.fieldSelectMTitle)}>Фильтры</span>
                    <DropDownListMultipleSelector
                      value={
                        R.join(
                          ', ',
                          R.values(
                            R.map(
                              e => R.slice(0, -2, e.text),
                              R.filter(e => e.selected, currentFilters),
                            ),
                          ),
                        )
                      }
                      save={this.changeFilters}
                      setDefault={this.setDefaultFilters}
                      items={R.values(currentFilters)}
                    />
                  </div>
                </div>
                <div className={css(styles.modalBlockMFilterButton)}>
                  <Button
                    size="big"
                    buttonStyle="normal"
                    title="Применить"
                    smallFont
                    onClick={() => this.save(closeModal)}
                  />
                </div>
                <Button
                  customClass={css(styles.modalBlockMFilterButtonCancel)}
                  title="Сбросить фильтры"
                  onClick={() => this.setAllFiltersToDefault(closeModal)}
                />
              </>
            )
          }
        </ModalContext.Consumer>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalBlockMTitle: {
    fontSize: '18px',
    color: '#1F1F1F',
    marginTop: 0,
    fontFamily: 'GilroyBold, sans-serif',
    marginBottom: '36px',
  },
  modalBlockMFilterItem: { marginBottom: '24px' },
  modalBlockMFilterButton: { marginTop: '34px' },
  modalBlockMFilterButtonCancel: {
    padding: 0,
    paddingTop: '14px',
    paddingBottom: '14px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#C2C3C8',
    fontSize: '14px',
    fontFamily: 'GilroyRegular, sans-serif',
    width: '100%',
    transition: '.4s ease-out',
    marginTop: '20px',
    ':hover': {
      backgroundColor: '#C6C7CC',
      color: '#1f1f1f',
    },
  },
  fieldSelectMTitle: {
    color: '#1f1f1f',
    fontSize: '16px',
    marginBottom: '10px',
    display: 'flex',
    fontFamily: 'GilroyRegular, sans-serif',
  },
  fieldSelectMContainer: { position: 'relative' },
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
});

FilterBlock.propTypes = {
  sectors: PropTypes.object,
  selectedViewModes: PropTypes.object,
};

const mapStateToProps = state => ({
  selectedFilters: state.selectedFilters,
  sectors: state.sectorsStore.sectors,
  selectedViewModes: state.selectedViewModes,
  user: state.usersStore.users[state.usersStore.currentUserId],
});

const mapDispatchToProps = dispatch => ({
  setSelectedFilter: (spotId, sectorId, filters) => (
    dispatch(setSelectedFilter(spotId, sectorId, filters))
  ),
  setSelectedPage: (spotId, sectorId, page) => dispatch(setSelectedPage(spotId, sectorId, page)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FilterBlock));
