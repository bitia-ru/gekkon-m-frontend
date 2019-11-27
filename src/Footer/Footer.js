import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SocialLinkButton from '../SocialLinkButton/SocialLinkButton';
import {
  VK_LINK,
  FACEBOOK_LINK,
  TWITTER_LINK,
} from '../Constants/SocialLinks';
import { notReady, notExist } from '../Utils';
import './Footer.css';


const Footer = ({ logIn, signUp, logOut, user }) => {
  const socialLinks = require(
    '../../img/social-links-sprite/social-links-sprite.svg',
  );

  return (
    <footer className="footer-m">
      <div className="footer-m__container">
        <div className="footer-m__social">
          <h3 className="footer__header">Соцсети</h3>
          <ul className="social-links">
            <li><SocialLinkButton href={VK_LINK} xlinkHref={`${socialLinks}#icon-vk`}/></li>
            <li>
              <SocialLinkButton href={FACEBOOK_LINK} xlinkHref={`${socialLinks}#icon-facebook`}/>
            </li>
            <li>
              <SocialLinkButton href={TWITTER_LINK} xlinkHref={`${socialLinks}#icon-twitter`}/>
            </li>
          </ul>
        </div>

        <div className="footer-m__col-6">
          <div className="footer-m__item">
            <h3 className="footer-m__header">Аккаунт</h3>
            <ul className="footer-m__list">
              {
                !notReady(user) && (
                  <>
                    {
                      notExist(user)
                        ? (
                          <>
                            <li className="footer-m__list-item">
                              <a
                                onClick={logIn}
                                role="link"
                                tabIndex={0}
                                className="footer-m__list-link"
                              >
                                Вход
                              </a>
                            </li>
                            <li className="footer-m__list-item">
                              <a
                                onClick={signUp}
                                role="link"
                                tabIndex={0}
                                className="footer-m__list-link"
                              >
                                Регистрация
                              </a>
                            </li>
                          </>
                        )
                        : (
                          <li className="footer-m__list-item">
                            <a
                              onClick={logOut}
                              role="link"
                              tabIndex={0}
                              className="footer-m__list-link"
                            >
                              Выход
                            </a>
                          </li>
                        )
                    }
                  </>
                )
              }
            </ul>
          </div>
        </div>
        <div className="footer-m__col-6">
          <div className="footer-m__item footer-m__col-6">
            <h3 className="footer-m__header">Разделы</h3>
            <ul className="footer-m__list">
              <li className="footer-m__list-item">
                <Link to="/" className="footer-m__list-link">Скалодромы</Link>
              </li>
              <li className="footer-m__list-item">
                <Link to="/crags" className="footer-m__list-link footer-m__list-link-disabled">
                  Скалы
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-m__col-6">
          <div className="footer-m__item footer-m__col-6">
            <h3 className="footer-m__header">Информация</h3>
            <ul className="footer-m__list">
              <li className="footer-m__list-item">
                <Link to="/about" className="footer-m__list-link">О нас</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-m__col-6">
          <div className="footer-m__item footer-m__col-6">
            <h3 className="footer-m__header">Помощь</h3>
            <ul className="footer-m__list">
              <li className="footer-m__list-item">
                <Link to="/faq" className="footer-m__list-link">FAQ</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  user: PropTypes.object,
  logIn: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired,
};

export default Footer;
