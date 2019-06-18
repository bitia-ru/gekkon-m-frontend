import moment from 'moment';

const LOOK_UP_PAST_DATE_FORMATTER = [
  { 0: datetime => 'только что' }, // 45 seconds
  { 45: datetime => datetime.fromNow() }, // 1 day
  { 86400: datetime => 'день назад' }, // 2 days
  { 172800: datetime => 'два дня назад' }, // 3 days
  { 259200: datetime => 'три дня назад' }, // 4 days
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
      }
    },
  }, // 7 days
  { 604800: datetime => 'неделю назад' }, // 14 days
  { 1209600: datetime => '2 недели назад' }, // 21 days
  { 1814400: datetime => '3 недели назад' }, // 28 days
  { 2419200: datetime => '4 недели назад' }, // 30 days
  { 2592000: datetime => datetime.fromNow() }, // 365 days
  { 31536000: datetime => datetime.fromNow() },
];

const LOOK_UP_FUTURE_DATE_FORMATTER = [
  { 0: datetime => datetime.fromNow() }, // 1 day
  { 86400: datetime => 'через день' }, // 2 days
  { 172800: datetime => 'через два дня' }, // 3 days
  { 259200: datetime => 'через три дня' }, // 4 days
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
      }
    },
  }, // 7 days
  { 604800: datetime => 'через неделю' }, // 14 days
  { 1209600: datetime => 'через 2 недели' }, // 21 days
  { 1814400: datetime => 'через 3 недели' }, // 28 days
  { 2419200: datetime => 'через 4 недели' }, // 30 days
  { 2592000: datetime => datetime.fromNow() }, // 365 days
  { 31536000: datetime => datetime.fromNow() },
];

export const TimeFromNow = (datetime) => {
  const secondsFromNow = moment().diff(datetime, 'seconds');
  if (secondsFromNow < 0) {
    for (const i in LOOK_UP_FUTURE_DATE_FORMATTER) {
      const s = parseInt(Object.keys(LOOK_UP_FUTURE_DATE_FORMATTER[i])[0], 10);
      if (s > Math.abs(secondsFromNow)) {
        return Object.values(LOOK_UP_FUTURE_DATE_FORMATTER[i - 1])[0](datetime);
      }
    }
    return Object.values(LOOK_UP_FUTURE_DATE_FORMATTER[LOOK_UP_FUTURE_DATE_FORMATTER.length - 1])[0](datetime);
  }
  for (const i in LOOK_UP_PAST_DATE_FORMATTER) {
    const s = parseInt(Object.keys(LOOK_UP_PAST_DATE_FORMATTER[i])[0], 10);
    if (s > Math.abs(secondsFromNow)) {
      return Object.values(LOOK_UP_PAST_DATE_FORMATTER[i - 1])[0](datetime);
    }
  }
  return Object.values(LOOK_UP_PAST_DATE_FORMATTER[LOOK_UP_PAST_DATE_FORMATTER.length - 1])[0](datetime);
};
