import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';

const Logo = () => (
  <Link to="/" className="logo-m">
    <span className="logo-m__icon">
      <img
        src={require('./images/logo-75x75.png').default}
        width="75px"
        height="75px"
        alt="RC"
      />
    </span>
  </Link>
);

export default Logo;
