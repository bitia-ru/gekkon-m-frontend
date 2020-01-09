import gravityImage from '../../img/spot-card-img/gravity.jpg';
import limestoneImage from '../../img/spot-card-img/limestone.jpg';
import bigwallImage from '../../img/spot-card-img/bigwall.jpg';
import tokyoImage from '../../img/spot-card-img/tokyo.jpg';

const SPOTS_DATA = [
  {
    id: 1,
    name: 'Гравитация',
    imgSrc: gravityImage,
    className: 'climbing-card-m_gravity',
  },
  {
    id: 2,
    name: 'Лаймстоун',
    imgSrc: limestoneImage,
    className: 'climbing-card-m_limestone',
  },
  {
    id: 10,
    name: 'BigWall ВДНХ',
    imgSrc: bigwallImage,
    className: 'climbing-card-m_bigwall',
  },
  {
    id: 4,
    name: 'Токио',
    imgSrc: tokyoImage,
    className: 'climbing-card-m_tokyo',
  },
];

export { SPOTS_DATA as default };
