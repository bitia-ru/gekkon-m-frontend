import Api from '@/v2/utils/Api';

export const userBaseName = (user) => {
  if (user.name) {
    return user.name;
  }

  if (user.login) {
    return user.login;
  }

  return `User #${user.id}`;
};

export const createUser = (
  user,
  options,
) => {
  Api.post(
    '/v1/users',
    {
      user,
    },
    options,
  );
};
