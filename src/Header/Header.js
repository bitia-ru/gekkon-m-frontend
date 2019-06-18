import React from 'react';
import PropTypes from 'prop-types';
import InfoBlock from '../InfoBlock/InfoBlock';
import MainNav from '../MainNav/MainNav';
import Logo from '../Logo/Logo';
import Slider from '../Slider/Slider';
import './Header.css';

const Header = ({
  showMenu, data, infoData, changeSectorFilter, sectors, sectorId,
}) => (
  <header className="header-m">
    <div className="header-m__top">
      <Logo />
      <MainNav showMenu={showMenu} />
    </div>
    <div
      className="header-m__items-container"
      style={{ backgroundImage: `url(${data.photo ? data.photo.url : ''})` }}
    >
      <h1 className="header-m__header">{data.name}</h1>
      <p className="header-m__descr">{data.description}</p>
      <InfoBlock infoData={infoData} />
    </div>
    <Slider
      changeSectorFilter={changeSectorFilter}
      sectors={sectors}
      sectorId={sectorId}
    />
  </header>
);

Header.propTypes = {
  showMenu: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  infoData: PropTypes.array.isRequired,
  sectors: PropTypes.array.isRequired,
  changeSectorFilter: PropTypes.func.isRequired,
  sectorId: PropTypes.number.isRequired,
};

export default Header;
