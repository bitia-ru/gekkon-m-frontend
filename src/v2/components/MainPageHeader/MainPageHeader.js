import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Button from '@/v1/components/Button/Button';
import { notReady, notExist } from '@/v1/utils';
import { currentUser } from '@/v2/redux/user_session/utils';
import SocialLinkButton from '@/v1/components/SocialLinkButton/SocialLinkButton';
import {
  TELEGRAM_LINK,
  INSTA_LINK,
  VK_LINK,
} from '@/v1/Constants/SocialLinks';
import { css, StyleSheet } from '@/v2/aphrodite';

const bgImage = require('./images/main-page-header.jpg');

class MainPageHeader extends Component {
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
      user, history,
    } = this.props;

    const { bgImageLoaded, posterPhotoLoaded } = this.state;

    const socialLinks = require(
      '@/../img/social-links-sprite/social-links-sprite.svg',
    );

    return (
      <header
        style={bgImageLoaded ? { backgroundImage: `url(${bgImage})` } : {}}
        className={css(styles.firstSectionM)}
      >
        <div className={css(styles.firstSectionMContainer)}>
          <div className={css(styles.firstSectionMData)}>
            <h1 className={css(styles.firstSectionMHeader)}>
              Не можешь вспомнить свою первую 6С?
            </h1>
            <p className={css(styles.firstSectionMDescr)}>Не пытайся запоминать боль, записывай</p>
            {
              (!notReady(user) && notExist(user)) ? (
                <>
                  <Button
                    size="big"
                    buttonStyle="normal"
                    title="Зарегистрироваться"
                    onClick={() => history.push('#signup')}
                  />
                  <Button
                    size="big"
                    buttonStyle="transparent"
                    title="Войти"
                    onClick={() => history.push('#signin')}
                  />
                </>
              ) : (
                <ul className="social-links">
                  <li>
                    <SocialLinkButton
                      dark
                      href={TELEGRAM_LINK}
                      xlinkHref={`${socialLinks}#icon-telegram`}
                    />
                  </li>
                  <li>
                    <SocialLinkButton dark href={VK_LINK} xlinkHref={`${socialLinks}#icon-vk`} />
                  </li>
                  <li>
                    <SocialLinkButton
                      dark
                      href={INSTA_LINK}
                      xlinkHref={`${socialLinks}#icon-inst`}
                    />
                  </li>
                </ul>
              )
            }
            <div className={css(styles.firstSectionMImage)}>
              <picture>
                <img
                  src={require('./images/first-section-m-img.png')}
                  srcSet={
                    `${
                      require('./images/first-section-m-img.png@1.5x.png')
                    } 1.5x, ${
                      require('./images/first-section-m-img.png@2x.png')
                    } 2x`
                  }
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

const styles = StyleSheet.create({
  firstSectionM: {
    backgroundColor: '#F2F1EB',
    width: '100%',
    minHeight: '640px',
    maxWidth: '100%',
    position: 'relative',
    fontFamily: 'GilroyRegular',
    paddingBottom: '64px',
  },
  firstSectionMData: {
    marginTop: '98px',
    '@media screen and (min-width: 720px)': { textAlign: 'center' },
  },
  firstSectionMHeader: {
    fontFamily: 'GilroyBold',
    fontSize: '36px',
    lineHeight: '44px',
    marginBottom: '24px',
    marginTop: 0,
  },
  firstSectionMDescr: { marginBottom: '28px' },
  firstSectionMContainer: {
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingTop: '76px',
  },
  firstSectionMImage: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '24px',
  },
});

MainPageHeader.propTypes = {
  user: PropTypes.object,
  history: PropTypes.object,
};

const mapStateToProps = state => ({
  user: currentUser(state),
});

export default connect(mapStateToProps)(withRouter(MainPageHeader));
