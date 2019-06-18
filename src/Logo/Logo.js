import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../img/logo-img/logo.svg';
import './Logo.css';

const Logo = () => (
  <Link to="/" className="logo-m">
    <span className="logo-m__icon">
      <img src={logoImage} alt="Gekkon" />
    </span>
  </Link>
);

export default Logo;
