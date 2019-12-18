import React from 'react';
import PropTypes from 'prop-types';
import './MainNav.css';

const MainNav = ({
  showMenu,
}) => (
  <button type="button" className="hamburger" onClick={showMenu}>
    <span className="hamburger__inner" />
  </button>
);

MainNav.propTypes = {
  showMenu: PropTypes.func.isRequired,
};

export default MainNav;
