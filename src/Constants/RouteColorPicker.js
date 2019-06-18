import noColorImage from '../../img/route-img/no_color.png';

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
    backgroundImage: `url(${noColorImage})`,
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
  };
};

export default getColorStyle;
