import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { currentUser } from '../../redux/user_session/utils';
import SocialLinkButton from '@/v1/components/SocialLinkButton/SocialLinkButton';
import {
  TELEGRAM_LINK,
  INSTA_LINK,
  VK_LINK,
} from '@/v1/Constants/SocialLinks';
import { notReady, notExist } from '@/v1/utils';
import { closeUserSession } from '@/v2/utils/auth';
import { StyleSheet, css } from '../../aphrodite';

class Footer extends React.PureComponent {
  render() {
    const { user, history } = this.props;

    const socialLinks = require(
      '@/../img/social-links-sprite/social-links-sprite.svg',
    );

    return (
      <footer className={css(styles.footerM)}>
        <div className={css(styles.footerMContainer)}>
          <div className={css(styles.footerMSocial)}>
            <h3 className={css(styles.footerMHeader)}>
              Соцсети
            </h3>
            <ul className={css(styles.socialLinks)}>
              <li>
                <SocialLinkButton
                  href={TELEGRAM_LINK}
                  xlinkHref={`${socialLinks}#icon-telegram`}
                />
              </li>
              <li>
                <SocialLinkButton href={VK_LINK} xlinkHref={`${socialLinks}#icon-vk`} />
              </li>
              <li>
                <SocialLinkButton
                  href={INSTA_LINK}
                  xlinkHref={`${socialLinks}#icon-inst`}
                />
              </li>
            </ul>
          </div>

          <div className={css(styles.footerMCol6)}>
            <div className={css(styles.footerMItem)}>
              <h3 className={css(styles.footerMHeader)}>
                Аккаунт
              </h3>
              <ul className={css(styles.footerMList)}>
                {
                  !notReady(user) && (
                    <>
                      {
                        notExist(user)
                          ? (
                            <>
                              <li className={css(styles.footerMListItem)}>
                                <a
                                  onClick={() => history.push('#signin')}
                                  role="link"
                                  tabIndex={0}
                                  className={css(styles.footerMListLink)}
                                >
                                  Вход
                                </a>
                              </li>
                              <li className={css(styles.footerMListItem)}>
                                <a
                                  onClick={() => history.push('#signup')}
                                  role="link"
                                  tabIndex={0}
                                  className={css(styles.footerMListLink)}
                                >
                                  Регистрация
                                </a>
                              </li>
                            </>
                          )
                          : (
                            <li className={css(styles.footerMListItem)}>
                              <a
                                onClick={closeUserSession}
                                role="link"
                                tabIndex={0}
                                className={css(styles.footerMListLink)}
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
          <div className={css(styles.footerMCol6)}>
            <div className={css(styles.footerMItem, styles.footerMCol6)}>
              <h3 className={css(styles.footerMHeader)}>
                Разделы
              </h3>
              <ul className={css(styles.footerMList)}>
                <li className={css(styles.footerMListItem)}>
                  <Link to="/" className={css(styles.footerMListLink)}>Скалодромы</Link>
                </li>
                <li className={css(styles.footerMListItem)}>
                  <Link
                    to="/crags"
                    className={css(styles.footerMListLink, styles.footerMListLinkDisabled)}
                  >
                    Скалы
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className={css(styles.footerMCol6)}>
            <div className={css(styles.footerMItem, styles.footerMCol6)}>
              <h3 className={css(styles.footerMHeader)}>
                Информация
              </h3>
              <ul className={css(styles.footerMList)}>
                <li className={css(styles.footerMListItem)}>
                  <Link to="/about" className={css(styles.footerMListLink)}>О нас</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className={css(styles.footerMCol6)}>
            <div className={css(styles.footerMItem, styles.footerMCol6)}>
              <h3 className={css(styles.footerMHeader)}>
                Помощь
              </h3>
              <ul className={css(styles.footerMList)}>
                <li className={css(styles.footerMListItem)}>
                  <Link to="/faq" className={css(styles.footerMListLink)}>FAQ</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

const styles = StyleSheet.create({
  socialLinks: {
    margin: 0,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    '> li': {
      listStyleType: 'none',
      marginRight: '8px',
      marginLeft: '8px',
    },
    '> li:first-child': { marginLeft: 0 },
    '> li:last-child': { marginRight: 0 },
  },
  footerM: {
    width: '100%',
    paddingTop: '64px',
    paddingBottom: '64px',
    backgroundColor: '#1A1A1A',
    color: '#FCFCFC',
    position: 'relative',
  },
  footerMContainer: {
    display: 'flex',
    paddingLeft: '24px',
    paddingRight: '24px',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    boxSizing: 'border-box',
  },
  footerMSocial: {
    flexBasis: '100%',
    maxWidth: '100%',
    marginBottom: '36px',
  },
  footerMHeader: {
    fontSize: '18px',
    fontWeight: 'normal',
    color: '#FCFCFC',
    marginTop: 0,
    marginBottom: '20px',
  },
  footerMItem: {
    boxSizing: 'border-box',
    width: '100%',
    paddingRight: '20px',
    marginBottom: '40px',
  },
  footerMList: {
    paddingLeft: 0,
    margin: 0,
    marginTop: '-6px',
  },
  footerMListItem: { listStyle: 'none' },
  footerMListLink: {
    color: '#878787',
    textDecoration: 'none',
    lineHeight: '1.3em',
    paddingTop: '6px',
    paddingBottom: '6px',
    display: 'block',
    transition: 'color .4s ease-out',
    ':hover': { color: '#FCFCFC' },
  },
  footerMListLinkDisabled: {
    color: '#444444',
    pointerEvents: 'none',
  },
  footerMCol6: {
    maxWidth: '50%',
    width: '100%',
  },
});

Footer.propTypes = {
  user: PropTypes.object,
  history: PropTypes.object,
};

const mapStateToProps = state => ({
  user: currentUser(state),
});

export default connect(mapStateToProps)(withRouter(Footer));
