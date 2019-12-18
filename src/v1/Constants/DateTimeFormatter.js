import moment from 'moment';
import * as R from 'ramda';

const LOOK_UP_PAST_DATE_FORMATTER = [
  { 0: () => 'только что' }, // 45 seconds
  { 45: datetime => datetime.fromNow() }, // 1 day
  { 86400: () => 'день назад' }, // 2 days
  { 172800: () => 'два дня назад' }, // 3 days
  { 259200: () => 'три дня назад' }, // 4 days
  {
    345600: (datetime) => {
      const d = datetime.format('dd');
      switch (d) {
      case 'пн':
        return 'в понедельник';
      case 'вт':
        return 'во вторник';
      case 'ср':
        return 'в среду';
      case 'чт':
        return 'в четверг';
      case 'пт':
        return 'в пятницу';
      case 'сб':
        return 'в субботу';
      case 'вс':
        return 'в воскресенье';
      default:
        return '';
      }
    },
  }, // 7 days
  { 604800: () => 'неделю назад' }, // 14 days
  { 1209600: () => '2 недели назад' }, // 21 days
  { 1814400: () => '3 недели назад' }, // 28 days
  { 2419200: () => '4 недели назад' }, // 30 days
  { 2592000: datetime => datetime.fromNow() }, // 365 days
  { 31536000: datetime => datetime.fromNow() },
];

const LOOK_UP_FUTURE_DATE_FORMATTER = [
  { 0: datetime => datetime.fromNow() }, // 1 day
  { 86400: () => 'через день' }, // 2 days
  { 172800: () => 'через два дня' }, // 3 days
  { 259200: () => 'через три дня' }, // 4 days
  {
    345600: (datetime) => {
      const d = datetime.format('dd');
      switch (d) {
      case 'пн':
        return 'в понедельник';
      case 'вт':
        return 'во вторник';
      case 'ср':
        return 'в среду';
      case 'чт':
        return 'в четверг';
      case 'пт':
        return 'в пятницу';
      case 'сб':
        return 'в субботу';
      case 'вс':
        return 'в воскресенье';
      default:
        return '';
      }
    },
  }, // 7 days
  { 604800: () => 'через неделю' }, // 14 days
  { 1209600: () => 'через 2 недели' }, // 21 days
  { 1814400: () => 'через 3 недели' }, // 28 days
  { 2419200: () => 'через 4 недели' }, // 30 days
  { 2592000: datetime => datetime.fromNow() }, // 365 days
  { 31536000: datetime => datetime.fromNow() },
];

const timeFromNow = (datetime) => {
  const secondsFromNow = moment().diff(datetime, 'seconds');
  const forEachIndexed = R.addIndex(R.forEach);
  if (secondsFromNow < 0) {
    let result = null;
    forEachIndexed(
      (formatter, index) => {
        const s = parseInt(Object.keys(formatter)[0], 10);
        if (result === null && s > Math.abs(secondsFromNow)) {
          result = Object.values(LOOK_UP_FUTURE_DATE_FORMATTER[index - 1])[0](datetime);
        }
        return true;
      },
      LOOK_UP_FUTURE_DATE_FORMATTER,
    );
    const formatter = LOOK_UP_FUTURE_DATE_FORMATTER;
    return result || Object.values(formatter[formatter.length - 1])[0](datetime);
  }
  let result = null;
  forEachIndexed(
    (formatter, index) => {
      const s = parseInt(Object.keys(formatter)[0], 10);
      if (result === null && s > Math.abs(secondsFromNow)) {
        result = Object.values(LOOK_UP_PAST_DATE_FORMATTER[index - 1])[0](datetime);
      }
      return true;
    },
    LOOK_UP_PAST_DATE_FORMATTER,
  );
  const formatter = LOOK_UP_PAST_DATE_FORMATTER;
  return result || Object.values(formatter[formatter.length - 1])[0](datetime);
};

export { timeFromNow as default };
