import React from 'react';
import PropTypes from 'prop-types';
import MainNav from '../MainNav/MainNav';
import Logo from '../Logo/Logo';
import Button from '../Button/Button';
import climberImage from '../../img/main-page-header-img/first-section-m-img.png';
import climberImage15X from '../../img/main-page-header-img/first-section-m-img.png@1.5x.png';
import climberImage2X from '../../img/main-page-header-img/first-section-m-img.png@2x.png';
import './MainPageHeader.css';

const MainPageHeader = ({
  user, showMenu, logIn, signUp,
}) => (
  <header className="first-section-m">
    <div className="first-section-m__top">
      <Logo />
      <MainNav showMenu={showMenu} />
    </div>
    <div className="first-section-m__container">
      <div className="first-section-m__data">
        <h1 className="first-section-m__header">Не можешь вспомнить свою первую 6С?</h1>
        <p className="first-section-m__descr">Не пытайся запоминать боль, записывай</p>
        {
          user === null
            ? (
              <React.Fragment>
                <Button
                  size="big"
                  buttonStyle="normal"
                  title="Зарегистрироваться"
                  onClick={signUp}
                />
                <Button
                  size="big"
                  buttonStyle="transparent"
                  title="Войти"
                  onClick={logIn}
                />
              </React.Fragment>
            )
            : ''
        }
        <div className="first-section-m__image">
          <picture>
            <img
              src={climberImage}
              srcSet={`${climberImage15X} 1.5x, ${climberImage2X} 2x`}
              alt="Скалолаз"
            />
          </picture>
        </div>
      </div>
    </div>
  </header>
);

MainPageHeader.propTypes = {
  user: PropTypes.object,
  logIn: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  showMenu: PropTypes.func.isRequired,
};

MainPageHeader.defaultProps = {
  user: null,
};

export default MainPageHeader;
