import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import SocialLinkButton from '@/v1/components/SocialLinkButton/SocialLinkButton';
import UserIcon from '@/v1/components/UserIcon/UserIcon';
import MenuList from '@/v1/components/MenuList/MenuList';
import { USER_ITEMS_DATA, GUEST_ITEMS_DATA } from '@/v1/Constants/User';
import { currentUser } from '@/v2/redux/user_session/utils';
import { closeUserSession } from '@/v2/utils/auth';
import { enterWithVk } from '../../utils/vk';
import './MainMenu.css';

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
    if (id === 3) {
      document.cookie = 'gekkon_creator_mode=1';
      document.location.reload(true);
    }
    hideMenu();
  };

  render() {
    const { user, hideMenu } = this.props;
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
              <Link
                to="/crags"
                className="m-menu__list-link m-menu__list-link-disabled"
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
          <div className="m-menu__list">
            <h3 className="m-menu__header">Соцсети</h3>
            <ul className="social-links">
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

MainMenu.propTypes = {
  user: PropTypes.object,
  hideMenu: PropTypes.func.isRequired,
  history: PropTypes.object,
};

const mapStateToProps = state => ({
  user: currentUser(state),
});

export default connect(mapStateToProps)(withRouter(MainMenu));
