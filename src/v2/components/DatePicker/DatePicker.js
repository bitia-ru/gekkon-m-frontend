import React, { Component } from 'react';
import * as R from 'ramda';
import moment from 'moment';
import PropTypes from 'prop-types';
import CloseButton from '@/v1/components/CloseButton/CloseButton';
import Button from '@/v1/components/Button/Button';
import './DatePicker.css';

export default class DatePicker extends Component {
  constructor(props) {
    super(props);

    const { date } = this.props;
    this.state = {
      displayedDate: date ? R.clone(date) : moment(),
      selectedDate: R.clone(date),
    };
  }

  getCurrentMonth = () => {
    const { displayedDate } = this.state;
    const d = displayedDate.format('MMMM');
    return d.charAt(0).toUpperCase() + d.slice(1);
  };

  getCurrentYear = () => {
    const { displayedDate } = this.state;
    return displayedDate.format('YYYY');
  };

  showPrevMonth = (event) => {
    event.stopPropagation();
    const { displayedDate } = this.state;
    this.setState({ displayedDate: displayedDate.subtract(1, 'month') });
  };

  showNextMonth = (event) => {
    event.stopPropagation();
    const { displayedDate } = this.state;
    this.setState({ displayedDate: displayedDate.add(1, 'month') });
  };

  getDay = (week, day) => {
    const { displayedDate } = this.state;
    const d = R.clone(displayedDate);
    return d.startOf('month').startOf('week').add(week * 7 + day, 'days').format('D');
  };

  notSelectedMonth = (week, day) => {
    const { displayedDate } = this.state;
    const d = R.clone(displayedDate);
    const month = d.startOf('month').startOf('week').add(week * 7 + day, 'days').format('M');
    const displayedMonth = displayedDate.format('M');
    return month !== displayedMonth;
  };

  numOfWeeks = () => {
    const { displayedDate } = this.state;
    let d = R.clone(displayedDate);
    const start = d.startOf('month').weeks();
    d = R.clone(displayedDate);
    const end = d.endOf('month').weeks();
    if (end > start) {
      return end - start + 1;
    }
    if (end === 1) {
      d = R.clone(displayedDate);
      return d.endOf('month').subtract(7, 'days').weeks() - start + 2;
    }
    return end + 1;
  };

  isSelectedDate = (week, day) => {
    const { displayedDate, selectedDate } = this.state;
    if (selectedDate === null) {
      return false;
    }
    let d = R.clone(displayedDate);
    d = d.startOf('month').startOf('week').add(week * 7 + day, 'days');
    if (d.format('D') !== R.clone(selectedDate).format('D')) {
      return false;
    }
    if (d.format('MM') !== R.clone(selectedDate).format('MM')) {
      return false;
    }
    if (d.format('YYYY') !== R.clone(selectedDate).format('YYYY')) {
      return false;
    }
    return true;
  };

  isCurrentDate = (week, day) => {
    const { displayedDate } = this.state;
    let d = R.clone(displayedDate);
    d = d.startOf('month').startOf('week').add(week * 7 + day, 'days');
    if (d.format('D') !== moment().format('D')) {
      return false;
    }
    if (d.format('MM') !== moment().format('MM')) {
      return false;
    }
    if (d.format('YYYY') !== moment().format('YYYY')) {
      return false;
    }
    return true;
  };

  selectDate = (week, day) => {
    const { displayedDate } = this.state;
    const { onSelect, hide } = this.props;
    const d = R.clone(displayedDate);
    onSelect(d.startOf('month').startOf('week').add(week * 7 + day, 'days'));
    hide();
  };

  removeDate = () => {
    const { onSelect, hide } = this.props;
    onSelect(null);
    hide();
  };

  render() {
    const { hide } = this.props;
    return (
      <div
        role="button"
        tabIndex="0"
        style={{ outline: 'none' }}
        className="modal-block-m modal-block-m_dark"
        onClick={hide}
      >
        <div className="modal-block-m__inner">
          <div className="modal-block-m__container">
            <div className="modal-block-m__header">
              <div className="modal-block-m__close">
                <CloseButton onClick={hide} light />
              </div>
            </div>
            <div className="calendar">
              <div
                role="button"
                tabIndex="0"
                style={{ outline: 'none' }}
                className="calendar__current-month"
                onClick={e => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={this.showPrevMonth}
                  className="calendar__current-month-prev"
                />
                <div className="calendar__current-month-text">
                  {`${this.getCurrentMonth()} ${this.getCurrentYear()}`}
                </div>
                <button
                  type="button"
                  onClick={this.showNextMonth}
                  className="calendar__current-month-next"
                />
              </div>
              <div
                role="button"
                tabIndex="0"
                style={{ outline: 'none' }}
                className="calendar__month"
                onClick={e => e.stopPropagation()}
              >
                <div className="calendar__month-header">
                  <div className="calendar__month-header-item">Пн</div>
                  <div className="calendar__month-header-item">Вт</div>
                  <div className="calendar__month-header-item">Ср</div>
                  <div className="calendar__month-header-item">Чт</div>
                  <div className="calendar__month-header-item">Пт</div>
                  <div className="calendar__month-header-item">Сб</div>
                  <div className="calendar__month-header-item">Вс</div>
                </div>
                <div className="calendar__month-wrapper">
                  {
                    R.map(
                      week => (
                        <div key={week} className="calendar__month-week">
                          {
                            R.map(
                              day => (
                                <div
                                  key={day}
                                  role="button"
                                  tabIndex="0"
                                  style={{ outline: 'none' }}
                                  onClick={() => this.selectDate(week, day)}
                                  className={`calendar__month-week-day${
                                    this.notSelectedMonth(week, day)
                                      ? ' calendar__month-week-day_unactive'
                                      : ''
                                  }${
                                    this.isCurrentDate(week, day)
                                      ? ' calendar__month-week-day_current'
                                      : ''
                                  }${
                                    this.isSelectedDate(week, day)
                                      ? ' calendar__month-week-day_active'
                                      : ''
                                  }`}
                                >
                                  {this.getDay(week, day)}
                                </div>
                              ),
                              R.range(0, 7),
                            )
                          }
                        </div>
                      ),
                      R.range(0, this.numOfWeeks()),
                    )
                  }
                </div>
              </div>
              <Button
                customClass="calendar__button"
                title="Сбросить дату"
                onClick={this.removeDate}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DatePicker.propTypes = {
  date: PropTypes.object,
  hide: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

DatePicker.defaultProps = {
  date: null,
};
