import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import moment from 'moment/moment';
import { DATE_FORMAT, dateToTextFormatter } from '@/v1/Constants/Date';
import CloseButton from '@/v1/components/CloseButton/CloseButton';
import DropDownList from '@/v1/components/DropDownList/DropDownList';
import DatePicker from '@/v1/components/DatePicker/DatePicker';
import Button from '@/v1/components/Button/Button';
import PERIOD_FILTERS from '@/v1/Constants/PeriodFilters';
import { CATEGORIES, CATEGORIES_ITEMS, getCategoryColor } from '@/v1/Constants/Categories';
import { DEFAULT_FILTERS } from '@/v1/Constants/DefaultFilters';
import getFilters from '@/v1/utils/getFilters';
import RESULT_FILTERS from '@/v1/Constants/ResultFilters';
import { setSelectedFilter, setSelectedPage } from '@/v1/actions';
import Category from '@/v1/components/Category/Category';
import './FilterBlock.css';
import getViewMode from '@/v1/utils/getViewMode';
import { ModalContext } from '@/v2/modules/modalable';
import Modal from '@/v2/layouts/Modal';


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
    } = getFilters(spotId, sectorId);
    this.state = {
      showCategoryFilter: false,
      showPeriodFilter: false,
      showDateFilter: false,
      showFilters: false,
      period,
      date,
      filters: R.clone(filters),
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
    if (categoryFrom !== null) {
      setSelectedFilterProp(spotId, sectorId, 'categoryFrom', categoryFrom);
    }
    if (categoryTo !== null) {
      setSelectedFilterProp(spotId, sectorId, 'categoryTo', categoryTo);
    }
    setSelectedFilterProp(spotId, sectorId, 'period', period);
    setSelectedFilterProp(spotId, sectorId, 'date', date);
    let filter = R.find(R.propEq('id', 'personal'))(filters);
    const personal = filter.selected;
    filter = R.find(R.propEq('id', 'outdated'))(filters);
    let outdated = null;
    if (filter) {
      outdated = filter.selected;
      setSelectedFilterProp(spotId, sectorId, 'outdated', outdated);
    }
    setSelectedFilterProp(spotId, sectorId, 'personal', personal);
    const resultFilters = R.filter(
      e => R.contains(e.id, R.map(f => f.id, RESULT_FILTERS)),
      filters,
    );
    if (user) {
      filter = R.find(R.propEq('id', 'liked'))(filters);
      const liked = filter.selected;
      setSelectedFilterProp(spotId, sectorId, 'liked', liked);
      const result = R.map(e => e.value, R.filter(e => e.selected, resultFilters));
      setSelectedFilterProp(spotId, sectorId, 'result', result);
    }
    const filtersCopy = R.clone(getFilters(spotId, sectorId).filters);
    R.forEach(
      (f) => {
        const index = R.findIndex(R.propEq('id', f.id))(filtersCopy);
        filtersCopy[index] = f;
      },
      filters,
    );
    setSelectedFilterProp(
      spotId,
      sectorId,
      'filters',
      filtersCopy,
    );
    setSelectedPageProp(spotId, sectorId, 1);
  };

  setDefaultFilters = () => {
    this.setState({ filters: DEFAULT_FILTERS.filters });
  };

  setAllFiltersToDefault = () => {
    this.setState({
      filters: DEFAULT_FILTERS.filters,
      period: DEFAULT_FILTERS.period,
      date: undefined,
      categoryFrom: DEFAULT_FILTERS.categoryFrom,
      categoryTo: DEFAULT_FILTERS.categoryTo,
    }, () => this.save());
  };

  changePeriod = (id) => {
    this.setState({ period: id, showPeriodFilter: false });
  };

  changeDate = (date) => {
    this.setState({ date: date ? date.format() : undefined, showDateFilter: false });
  };

  changeFilters = (filters) => {
    this.setState({ filters, showFilters: false });
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
      this.setState({ categoryFrom: '6b', categoryTo: '7a+' });
      break;
    case 4:
      this.setState({ categoryFrom: '7a', categoryTo: CATEGORIES[CATEGORIES.length - 1] });
      break;
    default:
      break;
    }
    this.setState({ showCategoryFilter: false });
  };

  render() {
    const {
      categoryFrom,
      categoryTo,
      period,
      date,
      filters,
      showCategoryFilter,
      showPeriodFilter,
      showDateFilter,
      showFilters,
    } = this.state;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    const viewMode = getViewMode(spotId, sectorId);
    const formatter = (
      viewMode === 'scheme'
        ? dateToTextFormatter
        : (d => moment(d).format(DATE_FORMAT))
    );
    const currentFilters = (
      viewMode === 'scheme'
        ? R.filter(f => f.id !== 'outdated', filters)
        : filters
    );
    return (
      <Modal>
        <ModalContext.Consumer>
          {
            ({ closeModal }) => (
              <>
                <h3 className="modal-block-m__title">Фильтры</h3>
                <div className="modal-block-m__filter-item">
                  <div className="field-select-m">
                    <span className="field-select-m__title">Категория</span>
                    <div className="field-select-m__container">
                      <div
                        role="button"
                        className="field-select-m__select field-select-m__select_active"
                        onClick={() => this.setState({ showCategoryFilter: true })}
                        tabIndex="0"
                        style={{ outline: 'none' }}
                      >
                        <span className="field-select-m__placeholder">От</span>
                        <Category category={categoryFrom} color={getCategoryColor(categoryFrom)} />
                        <span className="field-select-m__placeholder">до</span>
                        <Category category={categoryTo} color={getCategoryColor(categoryTo)} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-block-m__filter-item">
                  <div className="field-select-m">
                    {
                      viewMode === 'scheme'
                        ? (
                          <>
                            <span className="field-select-m__title">Дата</span>
                            <div className="field-select-m__container">
                              <div
                                role="button"
                                tabIndex="0"
                                style={{ outline: 'none' }}
                                onClick={() => this.setState({ showDateFilter: true })}
                                className="field-select-m__select field-select-m__select_active"
                              >
                                {formatter(date || DEFAULT_FILTERS.date)}
                              </div>
                            </div>
                          </>
                        )
                        : (
                          <>
                            <span className="field-select-m__title">Период</span>
                            <div className="field-select-m__container">
                              <div
                                role="button"
                                tabIndex="0"
                                style={{ outline: 'none' }}
                                onClick={() => this.setState({ showPeriodFilter: true })}
                                className="field-select-m__select field-select-m__select_active"
                              >
                                {R.find(R.propEq('id', period))(PERIOD_FILTERS).text}
                              </div>
                            </div>
                          </>
                        )
                    }
                  </div>
                </div>
                <div className="modal-block-m__filter-item">
                  <div className="field-select-m">
                    <span className="field-select-m__title">Фильтры</span>
                    <div className="field-select-m__container">
                      <div
                        role="button"
                        tabIndex="0"
                        style={{ outline: 'none' }}
                        onClick={() => this.setState({ showFilters: true })}
                        className="field-select-m__select field-select-m__select_active"
                      >
                        {
                          R.join(
                            ', ',
                            R.map(
                              e => R.slice(0, -2, e.text),
                              R.filter(e => e.selected, currentFilters),
                            ),
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-block-m__filter-button">
                  <Button
                    size="big"
                    buttonStyle="normal"
                    title="Применить"
                    smallFont
                    onClick={() => this.save(closeModal)}
                  />
                </div>
                <Button
                  customClass="modal-block-m__filter-button-cancel"
                  title="Сбросить фильтры"
                  onClick={this.setAllFiltersToDefault}
                />
                {
                  showCategoryFilter
                    ? (
                      <DropDownList
                        hide={() => this.setState({ showCategoryFilter: false })}
                        onClick={this.changeCategoryFilter}
                        items={CATEGORIES_ITEMS}
                        textFieldName="title"
                      />
                    )
                    : ''
                }
                {
                  showPeriodFilter
                    ? (
                      <DropDownList
                        hide={() => this.setState({ showPeriodFilter: false })}
                        onClick={this.changePeriod}
                        items={PERIOD_FILTERS}
                        textFieldName="text"
                      />
                    ) : ''
                }
                {
                  showDateFilter
                    ? (
                      <DatePicker
                        hide={() => this.setState({ showDateFilter: false })}
                        date={moment(date || DEFAULT_FILTERS.date)}
                        onSelect={this.changeDate}
                      />
                    ) : ''
                }
                {
                  showFilters
                    ? (
                      <DropDownList
                        hide={() => this.setState({ showFilters: false })}
                        save={this.changeFilters}
                        setDefault={this.setDefaultFilters}
                        items={currentFilters}
                        textFieldName="text"
                        multipleSelect
                      />
                    ) : ''
                }
              </>
            )
          }
        </ModalContext.Consumer>
      </Modal>
    );
  }
}

FilterBlock.propTypes = {
};

const mapStateToProps = state => ({
  user: state.usersStore.users[state.usersStore.currentUserId],
});

const mapDispatchToProps = dispatch => ({
  setSelectedFilter: (spotId, sectorId, filterName, filterValue) => (
    dispatch(setSelectedFilter(spotId, sectorId, filterName, filterValue))
  ),
  setSelectedPage: (spotId, sectorId, page) => dispatch(setSelectedPage(spotId, sectorId, page)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FilterBlock));
