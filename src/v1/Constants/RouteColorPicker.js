const getColorStyle = (routeMarkColor) => {
  if (routeMarkColor && routeMarkColor.photo) {
    return {
      backgroundImage: `url(${routeMarkColor.photo.url})`,
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
    };
  }
  if (routeMarkColor && routeMarkColor.color) {
    return { backgroundColor: routeMarkColor.color };
  }
  return {
    backgroundImage: `url(${require('../../../img/route-img/no_color.png').default})`,
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
  };
};

export default getColorStyle;
