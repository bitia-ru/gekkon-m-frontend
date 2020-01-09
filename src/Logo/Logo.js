import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../img/logo-img/logo-75x75.png';
import './Logo.css';

const Logo = () => (
  <Link to="/" className="logo-m">
    <span className="logo-m__icon">
      <img src={logoImage} width="75px" height="75px" alt="RC" />
    </span>
  </Link>
);

export default Logo;
