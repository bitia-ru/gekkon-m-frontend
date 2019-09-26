import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import moment from 'moment/moment';
import { DATE_FORMAT, dateToTextFormatter } from '../Constants/Date';
import CloseButton from '../CloseButton/CloseButton';
import DropDownList from '../DropDownList/DropDownList';
import DatePicker from '../DatePicker/DatePicker';
import Button from '../Button/Button';
import PERIOD_FILTERS from '../Constants/PeriodFilters';
import { CATEGORIES, CATEGORIES_ITEMS, getCategoryColor } from '../Constants/Categories';
import { DEFAULT_FILTERS } from '../Constants/DefaultFilters';
import Category from '../Category/Category';
import './FilterBlock.css';


export default class FilterBlock extends Component {
  constructor(props) {
    super(props);

    const {
      period, date, filters, categoryFrom, categoryTo,
    } = this.props;
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

  save = () => {
    const {
      hideFilters, changeAllFilters,
    } = this.props;
    const {
      period, date, filters, categoryFrom, categoryTo,
    } = this.state;
    changeAllFilters(
      categoryFrom, categoryTo, period, date, filters,
    );
    hideFilters();
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
      hideFilters, viewMode,
    } = this.props;
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
      <React.Fragment>
        <div className="modal-block-m">
          <div className="modal-block-m__inner">
            <div className="modal-block-m__container">
              <div className="modal-block-m__header">
                <div className="modal-block-m__header-btn">
                  <CloseButton onClick={hideFilters} />
                </div>
              </div>
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
                  onClick={this.save}
                />
              </div>
              <Button
                customClass="modal-block-m__filter-button-cancel"
                title="Сбросить фильтры"
                onClick={this.setAllFiltersToDefault}
              />
            </div>
          </div>
        </div>
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
      </React.Fragment>
    );
  }
}

FilterBlock.propTypes = {
  date: PropTypes.string,
  viewMode: PropTypes.string.isRequired,
  categoryFrom: PropTypes.string.isRequired,
  categoryTo: PropTypes.string.isRequired,
  period: PropTypes.number.isRequired,
  hideFilters: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired,
  changeAllFilters: PropTypes.func.isRequired,
};
