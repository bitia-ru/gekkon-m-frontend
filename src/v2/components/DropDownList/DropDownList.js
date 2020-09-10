import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Button from '@/v1/components/Button/Button';
import CloseButton from '@/v1/components/CloseButton/CloseButton';
import { StyleSheet, css } from '@/v2/aphrodite';

export default class DropDownList extends Component {
  constructor(props) {
    super(props);

    const { items } = this.props;
    this.state = {
      items: R.clone(items),
    };
  }

  selectItem = (event, id) => {
    event.stopPropagation();
    const { textFieldName } = this.props;
    const { items } = this.state;
    const index = R.findIndex(e => e.id === id, items);
    if (items[index].selected) {
      items[index][textFieldName] = R.slice(0, -2, items[index][textFieldName]);
    } else {
      items[index][textFieldName] = `${items[index][textFieldName]} ✓`;
    }
    items[index].selected = !items[index].selected;
    this.setState({ items });
  };

  save = () => {
    const { hide, save } = this.props;
    const { items } = this.state;
    save(items);
    hide();
  };

  setDefault = () => {
    const { setDefault, hide } = this.props;
    setDefault();
    hide();
  };

  render() {
    const {
      textFieldName, onClick, hide, multipleSelect,
    } = this.props;
    const { items } = this.state;
    return (
      <div
        role="button"
        tabIndex="0"
        style={{ outline: 'none' }}
        className="modal-block-m modal-block-m_dark"
        onClick={hide}
      >
        <div className="modal-block-m__inner modal-block-m__inner_no-pb">
          <div className="modal-block-m__container">
            <div className="modal-block-m__header">
              <div className="modal-block-m__close">
                <CloseButton onClick={hide} light />
              </div>
            </div>
            <div className={css(styles.dropdownList)}>
              <ul className={css(styles.dropdownListInner)}>
                {
                  R.map(item => (
                    <li
                      key={item.id}
                      className={css(styles.dropdownListItem)}
                    >
                      <div
                        role="button"
                        tabIndex="0"
                        style={{ outline: 'none' }}
                        onClick={
                          multipleSelect
                            ? e => this.selectItem(e, item.id)
                            : () => onClick(item.id)
                        }
                      >
                        {item[textFieldName]}
                      </div>
                    </li>
                  ), items)
                }
              </ul>
              {
                multipleSelect
                  ? (
                    <div className={css(styles.dropdownListButtonsWrapper)}>
                      <Button
                        size="big"
                        buttonStyle="normal"
                        title="Сохранить"
                        smallFont
                        onClick={this.save}
                      />
                      <Button
                        customClass={css(styles.dropdownListButtonCancel)}
                        title="Сбросить"
                        onClick={this.setDefault}
                      />
                    </div>
                  )
                  : ''
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  dropdownList: {
    backgroundColor: '#ffffff',
    display: 'block',
  },
  dropdownListInner: {
    margin: 0,
    padding: 0,
    backgroundColor: '#ffffff',
    minWidth: '100%',
    boxSizing: 'border-box',
    display: 'block',
    zIndex: 10,
  },
  dropdownListItem: {
    listStyle: 'none',
    lineHeight: '1.3em',
    color: '#1f1f1f',
    fontFamily: 'GilroyRegular',
    fontSize: '16px',
    padding: '16px 20px',
    maxWidth: '100%',
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    height: '54px',
    boxSizing: 'border-box',
    ':hover': { backgroundColor: '#f5f5f5' },
  },
  dropdownListButtonsWrapper: {
    width: '100%',
    boxSizing: 'border-box',
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingBottom: '10px',
  },
  dropdownListButtonCancel: {
    padding: 0,
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
    marginTop: '10px',
    ':hover': {
      backgroundColor: '#C6C7CC',
      color: '#1f1f1f',
    },
  },
  dropdownListSaveBtn: {
    paddingRight: '16px',
    paddingLeft: '16px',
  },
});

DropDownList.propTypes = {
  multipleSelect: PropTypes.bool,
  save: PropTypes.func,
  onClick: PropTypes.func,
  setDefault: PropTypes.func,
  hide: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  textFieldName: PropTypes.string.isRequired,
};

DropDownList.defaultProps = {
  multipleSelect: false,
  save: null,
  onClick: null,
  setDefault: null,
};
