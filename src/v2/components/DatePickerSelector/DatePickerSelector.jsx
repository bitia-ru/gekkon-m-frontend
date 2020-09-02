import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import DatePicker from '@/v2/components/DatePicker/DatePicker';
import { css, StyleSheet } from '@/v2/aphrodite';

class DatePickerSelector extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };
  }

  render() {
    const { expanded } = this.state;
    const {
      date, formatter, onChange, dateClass, clearable,
    } = this.props;
    return (
      <>
        <div className={css(styles.fieldSelectMContainer)}>
          <div
            role="button"
            tabIndex="0"
            style={{ outline: 'none' }}
            onClick={() => this.setState({ expanded: true })}
            className={dateClass}
          >
            {date ? formatter(date) : 'сегодня'}
          </div>
        </div>
        {
          expanded
            ? (
              <DatePicker
                clearable={clearable}
                hide={() => this.setState({ expanded: false })}
                date={date ? moment(date) : null}
                onSelect={onChange}
              />
            )
            : ''
        }
      </>
    );
  }
}

const styles = StyleSheet.create({
  fieldSelectMContainer: {
    position: 'relative',
  },
});

DatePickerSelector.propTypes = {
  date: PropTypes.string,
  formatter: PropTypes.func,
  onChange: PropTypes.func,
  dateClass: PropTypes.string,
  clearable: PropTypes.bool,
};

export default DatePickerSelector;
