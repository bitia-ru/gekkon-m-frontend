import gravityImage from '../../img/spot-card-img/gravity.jpg';
import limestoneImage from '../../img/spot-card-img/limestone.jpg';
import bigwallImage from '../../img/spot-card-img/bigwall.jpg';
import atmoImage from '../../img/spot-card-img/atmosphere.jpg';

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
    id: 3,
    name: 'Атмосфера',
    imgSrc: atmoImage,
    className: 'climbing-card-m_atmo',
  },
];

export { SPOTS_DATA as default };
