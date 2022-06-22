import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import SocialLinkButton from '@/v1/components/SocialLinkButton/SocialLinkButton';
import UserIcon from '@/v2/components/UserIcon/UserIcon';
import MenuList from '@/v2/components/MenuList/MenuList';
import { USER_ITEMS_DATA, GUEST_ITEMS_DATA } from '@/v1/Constants/User';
import { currentUser } from '@/v2/redux/user_session/utils';
import { closeUserSession } from '@/v2/utils/auth';
import { enterWithVk } from '../../utils/vk';
import { StyleSheet, css } from '../../aphrodite';

class MainMenu extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      searchString: '',
    };
  }

  searchSubmitted = () => {
    const { hideMenu } = this.props;
    this.setState({ searchString: '' });
    hideMenu();
  };

  keyPress = (event) => {
    if (event.key === 'Enter') {
      this.searchSubmitted();
    }
  };

  onItemSelect = (id) => {
    const {
      user, hideMenu, history,
    } = this.props;
    if (id === 1) {
      if (user) {
        history.push('#profile');
      } else {
        history.push('#signup');
      }
    }
    if (id === 2) {
      if (user) {
        closeUserSession();
      } else {
        history.push('#signin');
      }
    }
    hideMenu();
  };

  render() {
    const { user, hideMenu } = this.props;
    const socialLinks = require(
      '../../../../img/social-links-sprite/social-links-sprite.svg',
    ).default;
    return (
      <div className={css(styles.mMenu)}>
        <div>
          <UserIcon user={user} hideMenu={hideMenu} />
          <ul className={css(styles.mMenuList)}>
            { false
            && <li className={css(styles.mMenuListItem)}>
              <input
                type="text"
                onChange={event => this.setState({ searchString: event.target.value })}
                onKeyPress={this.keyPress}
                placeholder="Поиск"
                className={css(styles.mMenuSearch)}
              />
            </li>
            }
            <li className={css(styles.mMenuListItem)}>
              <Link to="/" className={css(styles.mMenuListLink)} onClick={hideMenu}>
                Скалодромы
              </Link>
            </li>
            <li className={css(styles.mMenuListItem)}>
              <Link
                to="/crags"
                className={css(styles.mMenuListLink, styles.mMenuListLinkDisabled)}
                onClick={hideMenu}
              >
                Скалы
              </Link>
            </li>
          </ul>
          <MenuList
            items={!user ? GUEST_ITEMS_DATA : USER_ITEMS_DATA}
            onClick={this.onItemSelect}
            textFieldName="title"
          />
          <div className={css(styles.mMenuList)}>
            <h3 className={css(styles.mMenuHeader)}>
              Соцсети
            </h3>
            <ul className={css(styles.socialLinks)}>
              <li>
                <SocialLinkButton
                  onClick={() => enterWithVk('logIn')}
                  xlinkHref={`${socialLinks}#icon-vk`}
                  dark
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
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
  mMenu: {
    width: '100%',
    backgroundColor: '#ffffff',
    height: '100%',
    position: 'fixed',
    zIndex: 30,
    top: 0,
    left: 0,
  },
  mMenuList: {
    margin: 0,
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingTop: 0,
    paddingBottom: 0,
    ':not(:last-child)': { borderBottom: '8px solid #F0F0F0' },
  },
  mMenuListItem: {
    listStyle: 'none',
    ':not(:last-child)': { borderBottom: '1px solid #E1E1E1' },
  },
  mMenuListLink: {
    display: 'block',
    color: '#1F1F1F',
    fontFamily: 'GilroyRegular, sans-serif',
    fontSize: '16px',
    textDecoration: 'none',
    lineHeight: '24px',
    paddingTop: '14px',
    paddingBottom: '14px',
    ':hover': { color: '#006CEB' },
    ':focus': { color: '#006CEB' },
    ':active': { color: '#006CEB' },
  },
  mMenuListLinkDisabled: {
    color: '#9F9F9F',
    pointerEvents: 'none',
  },
  mMenuSearch: {
    paddingTop: '14px',
    paddingBottom: '14px',
    lineHeight: '24px',
    paddingLeft: '28px',
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    border: 'none',
    fontSize: '16px',
    fontFamily: 'GilroyRegular, sans-serif',
    color: '#1f1f1f',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2217%22%20height%3D%2217%22%20viewBox%3D%220%200%2017%2017%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M7.25501%200.0141602C3.77828%200.0141602%200.995117%202.94678%200.995117%206.5199C0.995117%2010.093%203.77828%2013.0256%207.25501%2013.0256C9.02553%2013.0256%2010.6162%2012.2651%2011.751%2011.0468L16.3127%2016.0142L16.9951%2015.2711L12.3841%2010.2498C13.0975%209.19133%2013.5149%207.90364%2013.5149%206.5199C13.5149%202.94678%2010.7317%200.0141602%207.25501%200.0141602ZM1.99512%206.5199C1.99512%203.45926%204.36954%201.01416%207.25501%201.01416C10.1405%201.01416%2012.5149%203.45926%2012.5149%206.5199C12.5149%209.58053%2010.1405%2012.0256%207.25501%2012.0256C4.36954%2012.0256%201.99512%209.58053%201.99512%206.5199Z%22%20fill%3D%22%231F1F1F%22/%3E%0A%3C/svg%3E%0A")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px 16px',
    backgroundPosition: '0 center',
    ':placeholder': { color: '#1f1f1f' },
  },
  mMenuHeader: {
    fontSize: '16px',
    color: '#1f1f1f',
    lineHeight: '24px',
    fontFamily: 'GilroyRegular, sans-serif',
    fontWeight: 'normal',
  },
});

MainMenu.propTypes = {
  user: PropTypes.object,
  hideMenu: PropTypes.func.isRequired,
  history: PropTypes.object,
};

const mapStateToProps = state => ({
  user: currentUser(state),
});

export default connect(mapStateToProps)(withRouter(MainMenu));
