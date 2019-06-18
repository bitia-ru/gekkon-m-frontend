import * as R from 'ramda';

export const CATEGORIES_ITEMS = [
  { id: 0, title: 'Все', clickable: true },
  { id: 1, title: '6A+ и ниже', clickable: true },
  { id: 2, title: '6A-6B+', clickable: true },
  { id: 3, title: '6B-7A+', clickable: true },
  { id: 4, title: '7A и выше', clickable: true },
];

export const CATEGORIES = [
  '4a', '4a+', '4b', '4b+', '4c', '4c+',
  '5a', '5a+', '5b', '5b+', '5c', '5c+',
  '6a', '6a+', '6b', '6b+', '6c', '6c+',
  '7a', '7a+', '7b', '7b+', '7c', '7c+',
  '8a', '8a+', '8b', '8b+', '8c', '8c+',
  '9a', '9a+', '9b', '9b+', '9c', '9c+',
];

const COLORS = ['ffffff', 'ffe602', '48ff66', '7c81ff', 'eb002a', '141414'];

export const GetCategoryColor = (category) => {
  const index = R.findIndex(c => c === category)(CATEGORIES);
  let i;
  if (index >= 0 && index <= 11) { i = 0; }
  if (index >= 12 && index <= 13) { i = 1; }
  if (index >= 14 && index <= 15) { i = 2; }
  if (index >= 16 && index <= 17) { i = 3; }
  if (index >= 18 && index <= 19) { i = 4; }
  if (index >= 20 && index <= 35) { i = 5; }
  return `#${COLORS[i]}`;
};
