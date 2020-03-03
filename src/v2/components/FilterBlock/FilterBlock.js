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
import getFilters from '@/v1/utils/getFilters';
import RESULT_FILTERS from '@/v1/Constants/ResultFilters';
import { setSelectedFilter, setSelectedPage } from '@/v1/actions';
import './FilterBlock.css';
import getViewMode from '@/v1/utils/getViewMode';
import { ModalContext } from '@/v2/modules/modalable';
import Modal from '@/v2/layouts/Modal';
import CategoryRangeSelector from '@/v2/components/CategoryRangeSelector/CategoryRangeSelector';
import DropDownListSelector from '@/v2/components/DropDownListSelector/DropDownListSelector';
import DatePickerSelector from '@/v2/components/DatePickerSelector/DatePickerSelector';
import DropDownListMultipleSelector
  from '@/v2/components/DropDownListMultipleSelector/DropDownListMultipleSelector';


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

  setAllFiltersToDefault = (closeModal) => {
    this.setState({
      filters: DEFAULT_FILTERS.filters,
      period: DEFAULT_FILTERS.period,
      date: undefined,
      categoryFrom: DEFAULT_FILTERS.categoryFrom,
      categoryTo: DEFAULT_FILTERS.categoryTo,
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
      this.setState({ categoryFrom: '6b', categoryTo: '7a+' });
      break;
    case 4:
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
                    <CategoryRangeSelector
                      categoryTo={categoryTo}
                      categoryFrom={categoryFrom}
                      onChangeCategoryFilter={this.changeCategoryFilter}
                    />
                  </div>
                </div>
                <div className="modal-block-m__filter-item">
                  <div className="field-select-m">
                    {
                      viewMode === 'scheme'
                        ? (
                          <>
                            <span className="field-select-m__title">Дата</span>
                            <DatePickerSelector
                              formatter={formatter}
                              date={date || DEFAULT_FILTERS.date}
                              onChange={this.changeDate}
                              dateClass="field-select-m__select"
                            />
                          </>
                        )
                        : (
                          <>
                            <span className="field-select-m__title">Период</span>
                            <div className="field-select-m__container">
                              <DropDownListSelector
                                value={R.find(R.propEq('id', period))(PERIOD_FILTERS).text}
                                onChange={this.changePeriod}
                                items={PERIOD_FILTERS}
                                fieldSelectClass="field-select-m__select"
                              />
                            </div>
                          </>
                        )
                    }
                  </div>
                </div>
                <div className="modal-block-m__filter-item">
                  <div className="field-select-m">
                    <span className="field-select-m__title">Фильтры</span>
                    <DropDownListMultipleSelector
                      value={
                        R.join(
                          ', ',
                          R.map(
                            e => R.slice(0, -2, e.text),
                            R.filter(e => e.selected, currentFilters),
                          ),
                        )
                      }
                      save={this.changeFilters}
                      setDefault={this.setDefaultFilters}
                      items={currentFilters}
                    />
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
