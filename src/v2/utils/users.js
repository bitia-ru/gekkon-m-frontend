export const userBaseName = (user) => {
  if (user.name) {
    return user.name;
  }

  if (user.login) {
    return user.login;
  }

  return `User #${user.id}`;
};
