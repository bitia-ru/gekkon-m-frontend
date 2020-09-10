import React, { Component } from 'react';
import * as R from 'ramda';
import moment from 'moment';
import PropTypes from 'prop-types';
import CloseButton from '@/v1/components/CloseButton/CloseButton';
import Button from '@/v1/components/Button/Button';
import { StyleSheet, css } from '../../aphrodite';

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
    const { hide, clearable } = this.props;
    return (
      <div
        role="button"
        tabIndex="0"
        style={{ outline: 'none' }}
        className={css(styles.modalBlockM, styles.modalBlockMDark)}
        onClick={hide}
      >
        <div className={css(styles.modalBlockMInner)}>
          <div className={css(styles.modalBlockMContainer)}>
            <div className={css(styles.modalBlockMHeader)}>
              <div className={css(styles.modalBlockMClose)}>
                <CloseButton onClick={hide} light />
              </div>
            </div>
            <div className={css(styles.calendar)}>
              <div
                role="button"
                tabIndex="0"
                style={{ outline: 'none' }}
                className={css(styles.calendarCurrentMonth)}
                onClick={e => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={this.showPrevMonth}
                  className={css(styles.calendarCurrentMonthPrev)}
                />
                <div className={css(styles.calendarCurrentMonthText)}>
                  {`${this.getCurrentMonth()} ${this.getCurrentYear()}`}
                </div>
                <button
                  type="button"
                  onClick={this.showNextMonth}
                  className={css(styles.calendarCurrentMonthNext)}
                />
              </div>
              <div
                role="button"
                tabIndex="0"
                style={{ outline: 'none' }}
                className={css(styles.calendarMonth)}
                onClick={e => e.stopPropagation()}
              >
                <div className={css(styles.calendarMonthHeader)}>
                  <div className={css(styles.calendarMonthHeaderItem)}>Пн</div>
                  <div className={css(styles.calendarMonthHeaderItem)}>Вт</div>
                  <div className={css(styles.calendarMonthHeaderItem)}>Ср</div>
                  <div className={css(styles.calendarMonthHeaderItem)}>Чт</div>
                  <div className={css(styles.calendarMonthHeaderItem)}>Пт</div>
                  <div className={css(styles.calendarMonthHeaderItem)}>Сб</div>
                  <div className={css(styles.calendarMonthHeaderItem)}>Вс</div>
                </div>
                <div className={css(styles.calendarMonthWrapper)}>
                  {
                    R.map(
                      week => (
                        <div key={week} className={css(styles.calendarMonthWeek)}>
                          {
                            R.map(
                              day => (
                                <div
                                  key={day}
                                  role="button"
                                  tabIndex="0"
                                  style={{ outline: 'none' }}
                                  onClick={() => this.selectDate(week, day)}
                                  className={
                                    css(
                                      styles.calendarMonthWeekDay,
                                      this.notSelectedMonth(week, day) && (
                                        styles.calendarMonthWeekDayUnactive
                                      ),
                                      this.isCurrentDate(week, day) && (
                                        styles.calendarMonthWeekDayCurrent
                                      ),
                                      this.isSelectedDate(week, day) && (
                                        styles.calendarMonthWeekDayActive
                                      ),
                                      this.isCurrentDate(week, day) && (
                                        this.isSelectedDate(week, day) && (
                                          styles.calendarMonthWeekDayCurrentAndActive
                                        )
                                      ),
                                    )
                                  }
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
              {
                clearable && (
                  <Button
                    customClass={css(styles.calendarButton)}
                    title="Сбросить дату"
                    onClick={this.removeDate}
                  />
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  modalBlockM: {
    backgroundColor: '#ffffff',
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: 20,
  },
  modalBlockMDark: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
  modalBlockMInner: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    paddingBottom: '50px',
    boxSizing: 'border-box',
  },
  modalBlockMContainer: {
    paddingLeft: '24px',
    paddingRight: '24px',
    width: '100%',
    boxSizing: 'border-box',
  },
  modalBlockMHeader: {
    paddingTop: '20px',
    paddingBottom: '20px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  modalBlockMClose: {
    width: '16px',
    height: '16px',
  },
  calendar: {
    backgroundColor: '#ffffff',
    maxWidth: '420px',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block'
  },
  calendarCurrentMonth: {
    paddingLeft: '18px',
    paddingRight: '18px',
    paddingTop: '18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  calendarCurrentMonthNext: {
    border: 'none',
    padding: '4px',
    backgroundColor: 'transparent',
    width: '8px',
    height: '12px',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%228%22%20height%3D%2212%22%20viewBox%3D%220%200%208%2012%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20d%3D%22M0.255482%206.38488L5.99202%2011.6338C6.1247%2011.7553%206.30181%2011.8223%206.49066%2011.8223C6.67952%2011.8223%206.85663%2011.7553%206.98931%2011.6338L7.41177%2011.2474C7.68666%2010.9955%207.68666%2010.5863%207.41177%2010.3348L2.59466%205.92708L7.41711%201.51443C7.54979%201.39293%207.62305%201.23097%207.62305%201.05826C7.62305%200.885358%207.54979%200.723391%207.41711%200.601794L6.99466%200.21543C6.86187%200.0939312%206.68486%200.0269956%206.49601%200.0269956C6.30716%200.0269956%206.13004%200.0939312%205.99736%200.21543L0.255482%205.46917C0.122489%205.59106%200.049442%205.75379%200.0498612%205.92679C0.049442%206.10046%200.122489%206.26309%200.255482%206.38488Z%22%20fill%3D%22%231F1F1F%22/%3E%0A%3C/svg%3E%0A")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    transform: 'rotate(180deg)',
  },
  calendarCurrentMonthPrev: {
    border: 'none',
    padding: '4px',
    backgroundColor: 'transparent',
    width: '8px',
    height: '12px',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%228%22%20height%3D%2212%22%20viewBox%3D%220%200%208%2012%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20d%3D%22M0.255482%206.38488L5.99202%2011.6338C6.1247%2011.7553%206.30181%2011.8223%206.49066%2011.8223C6.67952%2011.8223%206.85663%2011.7553%206.98931%2011.6338L7.41177%2011.2474C7.68666%2010.9955%207.68666%2010.5863%207.41177%2010.3348L2.59466%205.92708L7.41711%201.51443C7.54979%201.39293%207.62305%201.23097%207.62305%201.05826C7.62305%200.885358%207.54979%200.723391%207.41711%200.601794L6.99466%200.21543C6.86187%200.0939312%206.68486%200.0269956%206.49601%200.0269956C6.30716%200.0269956%206.13004%200.0939312%205.99736%200.21543L0.255482%205.46917C0.122489%205.59106%200.049442%205.75379%200.0498612%205.92679C0.049442%206.10046%200.122489%206.26309%200.255482%206.38488Z%22%20fill%3D%22%231F1F1F%22/%3E%0A%3C/svg%3E%0A")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
  },
  calendarCurrentMonthText: {
    fontFamily: 'GilroyBold, sans-serif',
    fontSize: '14px',
    color: '#1f1f1f',
  },
  calendarMonth: {
    padding: '18px',
    paddingBottom: 0,
  },
  calendarMonthWrapper: {
    marginTop: '12px',
    borderBottom: '1px solid #F1F2F6',
    paddingBottom: '6px',
  },
  calendarMonthHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #F1F2F6',
    paddingBottom: '12px'
  },
  calendarMonthHeaderItem: {
    fontSize: '12px',
    color: '#C2C3C8',
    width: '26px',
    height: '26px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarMonthWeek: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: '6px',
    marginBottom: '6px',
  },
  calendarMonthWeekDay: {
    fontSize: '12px',
    color: '#1f1f1f',
    width: '26px',
    height: '26px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: '.4s ease-out',
    ':hover': {
      backgroundColor: '#C6C7CC',
      color: '#1f1f1f',
    },
  },
  calendarMonthWeekDayActive: {
    backgroundColor: '#006CEB',
    color: '#ffffff',
  },
  calendarMonthWeekDayUnactive: { color: '#C6C7CC' },
  calendarMonthWeekDayCurrent: { color: '#006CEB' },
  calendarMonthWeekDayCurrentAndActive: { color: '#ffffff' },
  calendarButton: {
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
    ':hover': {
      backgroundColor: '#C6C7CC',
      color: '#1f1f1f',
    },
  },
});

DatePicker.propTypes = {
  date: PropTypes.object,
  hide: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  clearable: PropTypes.bool,
};

DatePicker.defaultProps = {
  date: null,
};
