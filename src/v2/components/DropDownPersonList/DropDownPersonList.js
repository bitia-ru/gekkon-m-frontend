import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import CloseButton from '@/v1/components/CloseButton/CloseButton';
import Button from '@/v1/components/Button/Button';
import Person from '@/v1/components/Person/Person';
import { getUserName, SEARCH_DELAY } from '@/v1/Constants/User';
import { StyleSheet, css } from '@/v2/aphrodite';

export default class DropDownPersonList extends Component {
  constructor(props) {
    super(props);

    const { users } = this.props;
    this.state = {
      users: R.filter(user => getUserName(user) !== null, users),
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
        const name = getUserName(user);
        return (name !== null && name.match(value) !== null);
      }, users),
    });
    this.lastSearchText = value;
  };

  render() {
    const { hide } = this.props;
    const { users } = this.state;
    return (
      <div
        role="button"
        tabIndex="0"
        style={{ outline: 'none' }}
        className="modal-block-m modal-block-m_dark"
        onClick={hide}
      >
        <div className="modal-block-m__inner">
          <div className="modal-block-m__container">
            <div className="modal-block-m__header">
              <div className="modal-block-m__close">
                <CloseButton onClick={hide} light />
              </div>
            </div>
            <div className={css(styles.searchAuthor)}>
              <div className={css(styles.searchAuthorSearchWrapper)}>
                <input
                  type="text"
                  onClick={e => e.stopPropagation()}
                  placeholder="Поиск..."
                  onChange={this.searchInput}
                  onKeyPress={this.onKeyPress}
                  className={css(styles.searchAuthorSearch)}
                />
              </div>
              <div className={css(styles.searchAuthorWrapper)}>
                {
                  R.map(user => (
                    <li
                      key={user.id}
                      className={css(styles.searchAuthorItem, styles.searchAuthorItemPadding10)}
                    >
                      <Person user={user} onClick={() => this.selectItem(user)} />
                    </li>
                  ),
                  users)
                }
              </div>
              <Button
                customClass={css(styles.searchAuthorButtonCancel)}
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

const styles = StyleSheet.create({
  searchAuthor: {
    backgroundColor: '#ffffff',
    minWidth: '100%',
    boxSizing: 'border-box',
    display: 'block',
  },
  searchAuthorItem: {
    listStyle: 'none',
    lineHeight: '1.3em',
    color: '#1f1f1f',
    fontFamily: 'GilroyRegular',
    fontSize: '18px',
    padding: '16px 20px',
    maxWidth: '100%',
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    ':hover': {
      backgroundColor: '#f5f5f5',
      cursor: 'pointer',
    },
  },
  searchAuthorItemPadding10: {
    padding: '10px',
  },
  searchAuthorSearch: {
    border: 'none',
    width: '100%',
    height: '50px',
    fontSize: '14px',
    fontFamily: 'GilroyRegular, sans-serif',
    color: '#1f1f1f',
    outline: 'none',
    paddingLeft: '38px',
    paddingRight: '10px',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2215%22%20height%3D%2214%22%20viewBox%3D%220%200%2015%2014%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M5.8559%200C2.62136%200%200%202.6243%200%205.86062C0%209.09693%202.62136%2011.7212%205.8559%2011.7212C7.51722%2011.7212%209.01678%2011.0289%2010.0825%209.91698L13.7874%2013.6252L14.4942%2012.9178L10.7139%209.13409C11.344%208.19932%2011.7118%207.07291%2011.7118%205.86062C11.7118%202.6243%209.09043%200%205.8559%200ZM1%205.86062C1%203.17576%203.17447%201%205.8559%201C8.53732%201%2010.7118%203.17576%2010.7118%205.86062C10.7118%208.54548%208.53732%2010.7212%205.8559%2010.7212C3.17447%2010.7212%201%208.54548%201%205.86062Z%22%20fill%3D%22%23828282%22/%3E%0A%3C/svg%3E%0A")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '14px 14px',
    backgroundPosition: '11px center',
    boxSizing: 'border-box',
    ':placeholder': {
      color: '#828282',
      fontFamily: 'GilroyRegular, sans-serif',
      fontSize: '14px',
    },
  },
  searchAuthorSearchWrapper: {
    position: 'relative',
    ':before': {
      position: 'absolute',
      content: '\'\'',
      left: '10px',
      right: '10px',
      bottom: 0,
      height: '1px',
      backgroundColor: '#EBEBEB',
    },
  },
  searchAuthorWrapper: {
    maxHeight: '270px',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
  },
  searchAuthorButtonCancel: {
    padding: 0,
    height: '44px',
    paddingTop: '14px',
    paddingBottom: '14px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#C2C3C8',
    fontSize: '14px',
    fontFamily: 'GilroyRegular, sans-serif',
    width: '100%',
    transition: '.4s ease-out',
    position: 'relative',
    ':hover': {
      backgroundColor: '#C6C7CC',
      color: '#1f1f1f',
    },
    ':before': {
      position: 'absolute',
      content: '\'\'',
      left: '10px',
      right: '10px',
      top: 0,
      height: '1px',
      backgroundColor: '#EBEBEB',
    },
  },
});

DropDownPersonList.propTypes = {
  onClick: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
};
