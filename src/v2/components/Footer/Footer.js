import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { currentUser } from '../../redux/user_session/utils';
import SocialLinkButton from '@/v1/components/SocialLinkButton/SocialLinkButton';
import {
  INSTA_LINK,
  VK_LINK,
  FACEBOOK_LINK,
  TWITTER_LINK,
} from '@/v1/Constants/SocialLinks';
import { notReady, notExist } from '@/v1/utils';
import { closeUserSession } from '@/v2/utils/auth';
import './Footer.css';

class Footer extends React.PureComponent {
  render() {
    const { user, history } = this.props;
    const socialLinks = require(
      '../../../../img/social-links-sprite/social-links-sprite.svg',
    );
    return (
      <footer className="footer-m">
        <div className="footer-m__container">
          <div className="footer-m__social">
            <h3 className="footer__header">
              Соцсети
            </h3>
            <ul className="social-links">
              <li>
                <SocialLinkButton
                  href={INSTA_LINK}
                  xlinkHref={`${socialLinks}#icon-inst`}
                />
              </li>
              <li>
                <SocialLinkButton href={VK_LINK} xlinkHref={`${socialLinks}#icon-vk`} />
              </li>
              <li>
                <SocialLinkButton
                  href={FACEBOOK_LINK}
                  xlinkHref={`${socialLinks}#icon-facebook`}
                />
              </li>
              <li>
                <SocialLinkButton
                  href={TWITTER_LINK}
                  xlinkHref={`${socialLinks}#icon-twitter`}
                />
              </li>
            </ul>
          </div>

          <div className="footer-m__col-6">
            <div className="footer-m__item">
              <h3 className="footer-m__header">
                Аккаунт
              </h3>
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
                                  onClick={() => history.push('#signin')}
                                  role="link"
                                  tabIndex={0}
                                  className="footer-m__list-link"
                                >
                                  Вход
                                </a>
                              </li>
                              <li className="footer-m__list-item">
                                <a
                                  onClick={() => history.push('#signup')}
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
                                onClick={closeUserSession}
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
              <h3 className="footer-m__header">
                Разделы
              </h3>
              <ul className="footer-m__list">
                <li className="footer-m__list-item">
                  <Link to="/" className="footer-m__list-link">Скалодромы</Link>
                </li>
                <li className="footer-m__list-item">
                  <Link
                    to="/crags"
                    className="footer-m__list-link footer-m__list-link-disabled"
                  >
                    Скалы
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-m__col-6">
            <div className="footer-m__item footer-m__col-6">
              <h3 className="footer-m__header">
                Информация
              </h3>
              <ul className="footer-m__list">
                <li className="footer-m__list-item">
                  <Link to="/about" className="footer-m__list-link">О нас</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-m__col-6">
            <div className="footer-m__item footer-m__col-6">
              <h3 className="footer-m__header">
                Помощь
              </h3>
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
  }
}

Footer.propTypes = {
  user: PropTypes.object,
  history: PropTypes.object,
};

const mapStateToProps = state => ({
  user: currentUser(state),
});

export default connect(mapStateToProps)(withRouter(Footer));
