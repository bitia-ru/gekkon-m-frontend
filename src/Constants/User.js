export const PASSWORD_MIN_LENGTH = 6;

export const GetUserName = (user, selfDisplayed) => {
  if (user.name) { return user.name; }
  if (user.login) { return user.login; }
  if (user.email && selfDisplayed) { return user.email; }
  if (user.phone && selfDisplayed) { return user.phone; }
  return null;
};

export const SEARCH_DELAY = 3000;

export const USER_ITEMS_DATA = [
  { id: 1, title: 'Профиль', clickable: true },
  { id: 2, title: 'Выйти', clickable: true },
];

export const GUEST_ITEMS_DATA = [
  { id: 1, title: 'Зарегистрироваться', clickable: true },
  { id: 2, title: 'Войти', clickable: true },
];
