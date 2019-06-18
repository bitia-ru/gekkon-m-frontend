import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Button from '../Button/Button';
import CloseButton from '../CloseButton/CloseButton';
import './DropDownList.css';

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
      <div role="button" tabIndex="0" className="modal-block-m modal-block-m_dark" onClick={hide}>
        <div className="modal-block-m__inner modal-block-m__inner_no-pb">
          <div className="modal-block-m__container">
            <div className="modal-block-m__header">
              <div className="modal-block-m__close">
                <CloseButton onClick={hide} light />
              </div>
            </div>
            <div className="dropdown-list">
              <ul className="dropdown-list__inner">
                {
                  R.map(item => (
                    <li
                      key={item.id}
                      className="dropdown-list__item"
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
                    <div className="dropdown-list__buttons-wrapper">
                      <Button
                        size="big"
                        buttonStyle="normal"
                        title="Сохранить"
                        smallFont
                        onClick={this.save}
                      />
                      <Button
                        customClass="dropdown-list__button-cancel"
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
