import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import CloseButton from '../CloseButton/CloseButton';
import './NoticeForm.css';

export default class NoticeForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };
  }

  render() {
    const { submit, cancel } = this.props;
    const { text } = this.state;
    return (
      <div
        role="button"
        tabIndex="0"
        style={{ outline: 'none' }}
        className="modal-block-m modal-block-m_dark"
        onClick={cancel}
      >
        <div className="modal-block-m__inner">
          <div className="modal-block-m__container">
            <div className="modal-block-m__header">
              <div className="modal-block-m__close">
                <CloseButton onClick={cancel} light />
              </div>
            </div>
            <div
              role="button"
              tabIndex={0}
              style={{ outline: 'none' }}
              className="notice-message"
              onClick={event => event.stopPropagation()}
            >
              <form action="#" className="form">
                <h4 className="notice-message__title">Опишите обнаруженную ошибку</h4>
                <textarea
                  className="form__textarea"
                  value={text}
                  onChange={event => this.setState({ text: event.target.value })}
                />
                <div className="notice-message__button-block">
                  <div className="notice-message__button-col">
                    <Button
                      buttonStyle="gray"
                      title="Отмена"
                      smallFont
                      onClick={cancel}
                    />
                  </div>
                  <div className="notice-message__button-col">
                    <Button
                      buttonStyle="normal"
                      title="Отправить"
                      smallFont
                      onClick={() => submit(text)}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NoticeForm.propTypes = {
  submit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};
