import * as R from 'ramda';
import dayjs from 'dayjs';
import { CATEGORIES } from '@/v1/Constants/Categories';
import { DEFAULT_FILTERS, PERIOD_FILTERS, VALID_FILTERS } from '@/v1/Constants/filters';

const isBoolean = v => (typeof (v) === 'boolean');
const isCategory = c => (R.contains(c, CATEGORIES));
const isDate = d => (dayjs(d).isValid());

const isValid = {
  categoryFrom: isCategory,
  categoryTo: isCategory,
  period: p => (R.contains(p, R.map(e => e.id, PERIOD_FILTERS))),
  date: isDate,
  unsuccessful: isBoolean,
  red_point: isBoolean,
  flash: isBoolean,
  personal: isBoolean,
  outdated: isBoolean,
  liked: isBoolean,
};

const isValidFilter = (filterName, filterValue) => {
  if (isValid[filterName] === undefined) {
    return false;
  }
  return isValid[filterName](filterValue);
};

const mapIndexed = R.addIndex(R.map);

export const validateSectorFilters = (sectorFilters) => {
  const validFilterNames = R.filter(f => R.contains(f, VALID_FILTERS), R.keys(sectorFilters));
  return mapIndexed(
    (filter, index) => {
      if (isValidFilter(validFilterNames[index], filter)) {
        return filter;
      }
      return DEFAULT_FILTERS[validFilterNames[index]];
    },
    R.pick(validFilterNames, sectorFilters),
  );
};
