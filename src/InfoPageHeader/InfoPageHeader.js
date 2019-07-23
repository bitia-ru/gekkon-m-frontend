import React from 'react';
import PropTypes from 'prop-types';
import MainNav from '../MainNav/MainNav';
import Logo from '../Logo/Logo';
import './InfoPageHeader.css';

const InfoPageHeader = ({
  showMenu, image, title,
}) => (
  <header className="header-m" style={{ backgroundImage: `url(${image})` }}>
    <div className="header-m__top">
      <Logo />
      <MainNav showMenu={showMenu} />
    </div>
    <div className="header-m__about">
      <h1 className="header-m__header">{title}</h1>
    </div>
  </header>
);

InfoPageHeader.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  showMenu: PropTypes.func.isRequired,
};

export default InfoPageHeader;
