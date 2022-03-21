import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SocialLinkButton from '../SocialLinkButton/SocialLinkButton';
import UserIcon from '../UserIcon/UserIcon';
import MenuList from '../MenuList/MenuList';
import { USER_ITEMS_DATA, GUEST_ITEMS_DATA } from '../../Constants/User';
import './MainMenu.css';

export default class MainMenu extends Component {
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
      user, openProfile, signUp, logOut, logIn, hideMenu,
    } = this.props;
    if (id === 1) {
      if (user) {
        openProfile();
      } else {
        signUp();
      }
    }
    if (id === 2) {
      if (user) {
        logOut();
      } else {
        logIn();
      }
    }
    hideMenu();
  };

  render() {
    const { user, hideMenu, enterWithVk } = this.props;
    const socialLinks = require(
      '../../../../img/social-links-sprite/social-links-sprite.svg',
    );
    return (
      <div className="m-menu">
        <div className="m-menu__inner">
          <UserIcon user={user} hideMenu={hideMenu} />
          <ul className="m-menu__list">
            { false
                && <li className="m-menu__list-item">
                  <input
                    type="text"
                    onChange={event => this.setState({ searchString: event.target.value })}
                    onKeyPress={this.keyPress}
                    placeholder="Поиск"
                    className="m-menu__search"
                  />
                </li>
            }
            <li className="m-menu__list-item">
              <Link to="/" className="m-menu__list-link" onClick={hideMenu}>Скалодромы</Link>
            </li>
            <li className="m-menu__list-item">
              <Link to="/crags" className="m-menu__list-link m-menu__list-link-disabled" onClick={hideMenu}>Скалы</Link>
            </li>
          </ul>
          <MenuList
            items={!user ? GUEST_ITEMS_DATA : USER_ITEMS_DATA}
            onClick={this.onItemSelect}
            textFieldName="title"
          />
          <div className="m-menu__list">
            <h3 className="m-menu__header">
              Соцсети
            </h3>
            <ul className="social-links">
              <li>
                <SocialLinkButton
                  onClick={() => enterWithVk('logIn')}
                  xlinkHref={`${socialLinks}#icon-vk`}
                  dark
                />
              </li>
              { false
                  && <>
                    <li><SocialLinkButton xlinkHref={`${socialLinks}#icon-twitter`} dark unactive /></li>
                    <li><SocialLinkButton xlinkHref={`${socialLinks}#icon-youtube`} dark unactive /></li>
                  </>
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

MainMenu.propTypes = {
  user: PropTypes.object,
  logIn: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired,
  openProfile: PropTypes.func.isRequired,
  hideMenu: PropTypes.func.isRequired,
  enterWithVk: PropTypes.func.isRequired,
};
