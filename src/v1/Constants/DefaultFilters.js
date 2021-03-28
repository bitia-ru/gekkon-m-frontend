import RESULT_FILTERS from './ResultFilters';
import { CATEGORIES } from './Categories';

export const PERSONAL_DEFAULT = false;
export const OUTDATED_DEFAULT = false;
export const LIKED_DEFAULT = false;
export const POPULAR_DEFAULT = false;

export const DEFAULT_FILTERS = {
  categoryFrom: CATEGORIES[0],
  categoryTo: CATEGORIES[CATEGORIES.length - 1],
  period: 0,
  date: undefined,
  ...RESULT_FILTERS,
  personal: PERSONAL_DEFAULT,
  outdated: OUTDATED_DEFAULT,
  liked: LIKED_DEFAULT,
  popular: POPULAR_DEFAULT,
};
