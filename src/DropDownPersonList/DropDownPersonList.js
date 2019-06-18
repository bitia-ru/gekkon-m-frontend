import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import CloseButton from '../CloseButton/CloseButton';
import Button from '../Button/Button';
import Person from '../Person/Person';
import { GetUserName, SEARCH_DELAY } from '../Constants/User';
import './DropDownPersonList.css';

export default class DropDownPersonList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: R.filter(user => GetUserName(user) !== null, this.props.users),
    };
    this.lastSearchText = '';
  }

  selectItem = (user) => {
    const { onClick } = this.props;
    onClick(R.clone(user));
  };

  removeAuthor = () => {
    const { onClick } = this.props;
    onClick(null);
  };

  searchInput = (event) => {
    const { value } = event.target;
    this.value = value;
    clearTimeout(this.timerId);
    this.timerId = setTimeout(() => this.updateUserList(value), SEARCH_DELAY);
  };

  onKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.updateUserList(this.value);
    }
  };

  updateUserList = (value) => {
    const { users } = this.props;
    if (value === this.lastSearchText) {
      return;
    }
    this.setState({
      users: R.filter((user) => {
        const name = GetUserName(user);
        return (name !== null && name.match(value) !== null);
      }, users),
    });
    this.lastSearchText = value;
  };

  render() {
    const { hide } = this.props;
    const { users } = this.state;
    return (
      <div role="button" tabIndex="0" className="modal-block-m modal-block-m_dark" onClick={hide}>
        <div className="modal-block-m__inner">
          <div className="modal-block-m__container">
            <div className="modal-block-m__header">
              <div className="modal-block-m__close">
                <CloseButton onClick={hide} light />
              </div>
            </div>
            <div className="search-author">
              <div className="search-author__search-wrapper">
                <input
                  type="text"
                  onClick={e => e.stopPropagation()}
                  placeholder="Поиск..."
                  onChange={this.searchInput}
                  onKeyPress={this.onKeyPress}
                  className="search-author__search"
                />
              </div>
              <div className="search-author__wrapper">
                {
                  R.map(user => (
                    <li
                      key={user.id}
                      className="search-author__item search-author__item_padding-10"
                    >
                      <Person user={user} onClick={() => this.selectItem(user)} />
                    </li>
                  ),
                  users)
                }
              </div>
              <Button
                customClass="search-author__button-cancel"
                title="Сбросить"
                onClick={this.removeAuthor}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DropDownPersonList.propTypes = {
  onClick: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
};
