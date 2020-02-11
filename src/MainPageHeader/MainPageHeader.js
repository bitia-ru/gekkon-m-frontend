import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MainNav from '../MainNav/MainNav';
import Logo from '../Logo/Logo';
import Button from '../Button/Button';
import { notReady, notExist } from '../Utils';
import climberImage from '../../img/main-page-header-img/first-section-m-img.png';
import climberImage15X from '../../img/main-page-header-img/first-section-m-img.png@1.5x.png';
import climberImage2X from '../../img/main-page-header-img/first-section-m-img.png@2x.png';
import './MainPageHeader.css';

const bgImage = '/public/img/main-page-header-img/main-page-header.jpg';

export default class MainPageHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bgImageLoaded: false,
      posterPhotoLoaded: false,
    };
  }

  componentDidMount() {
    const bgImg = new Image();
    bgImg.onload = () => this.setState({ bgImageLoaded: true });
    bgImg.src = bgImage;
  }

  render() {
    const {
      user, showMenu, logIn, signUp,
    } = this.props;
    const { bgImageLoaded, posterPhotoLoaded } = this.state;
    return (
      <header
        style={bgImageLoaded ? { backgroundImage: `url(${bgImage})` } : {}}
        className="first-section-m"
      >
        <Logo />
        <MainNav showMenu={showMenu} />
        <div className="first-section-m__container">
          <div className="first-section-m__data">
            <h1 className="first-section-m__header">Не можешь вспомнить свою первую 6С?</h1>
            <p className="first-section-m__descr">Не пытайся запоминать боль, записывай</p>
            {
              (!notReady(user) && notExist(user)) && (
                <>
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
                </>
              )
            }
            <div className="first-section-m__image">
              <picture>
                <img
                  src={climberImage}
                  srcSet={`${climberImage15X} 1.5x, ${climberImage2X} 2x`}
                  alt="Скалолаз"
                  onLoad={() => this.setState({ posterPhotoLoaded: true })}
                  style={{ visibility: posterPhotoLoaded ? 'visible' : 'hidden' }}
                />
              </picture>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

MainPageHeader.propTypes = {
  user: PropTypes.object,
  logIn: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  showMenu: PropTypes.func.isRequired,
};
