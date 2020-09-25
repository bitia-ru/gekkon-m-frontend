import moment from 'moment/moment';

export const COMMENT_DATETIME_FORMAT = 'hh:mm LL';
export const DATE_FORMAT = 'DD.MM.YYYY';
export const BACKEND_DATE_FORMAT = 'YYYY-MM-DD';

export const dateToTextFormatter = date => moment(date).format(DATE_FORMAT);
