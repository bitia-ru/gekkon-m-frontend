import * as R from 'ramda';
import RESULT_FILTERS from './ResultFilters';
import { CATEGORIES } from './Categories';

const result = R.map(e => e.value, RESULT_FILTERS);
const resultFilters = R.map(
  e => R.merge(
    e,
    {
      selected: R.find(r => r === e.value, result) !== undefined,
      text: `${e.text}${R.find(r => r === e.value, result) !== undefined ? ' ✓' : ''}`,
    },
  ),
  RESULT_FILTERS,
);

export const PERSONAL_DEFAULT = false;
export const OUTDATED_DEFAULT = false;

export const DEFAULT_FILTERS = {
  categoryFrom: CATEGORIES[0],
  categoryTo: CATEGORIES[CATEGORIES.length - 1],
  period: 0,
  result,
  personal: PERSONAL_DEFAULT,
  outdated: OUTDATED_DEFAULT,
  filters: R.concat(
    resultFilters,
    [
      {
        clickable: true,
        id: 'personal',
        selected: PERSONAL_DEFAULT,
        text: `Авторские трассы ${PERSONAL_DEFAULT ? ' ✓' : ''}`,
        value: 'personal',
      },
      {
        clickable: true,
        id: 'outdated',
        selected: OUTDATED_DEFAULT,
        text: `Скрученные ${OUTDATED_DEFAULT ? ' ✓' : ''}`,
        value: 'outdated',
      },
    ],
  ),
};
