import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@/v1/components/Button/Button';
import CloseButton from '@/v1/components/CloseButton/CloseButton';
import { StyleSheet, css } from '@/v2/aphrodite';

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
        className={css(styles.modalBlockM, styles.modalBlockMDark)}
        onClick={cancel}
      >
        <div className={css(styles.modalBlockMInner)}>
          <div className={css(styles.modalBlockMContainer)}>
            <div className={css(styles.modalBlockMHeader)}>
              <div className={css(styles.modalBlockMClose)}>
                <CloseButton onClick={cancel} light />
              </div>
            </div>
            <div
              role="button"
              tabIndex={0}
              style={{ outline: 'none' }}
              className={css(styles.noticeMessage)}
              onClick={event => event.stopPropagation()}
            >
              <form action="#">
                <h4 className={css(styles.noticeMessageTitle)}>Опишите обнаруженную ошибку</h4>
                <textarea
                  className={css(styles.formTextarea)}
                  value={text}
                  onChange={event => this.setState({ text: event.target.value })}
                />
                <div className={css(styles.noticeMessageButtonBlock)}>
                  <div className={css(styles.noticeMessageButtonCol)}>
                    <Button
                      buttonStyle="gray"
                      title="Отмена"
                      smallFont
                      onClick={cancel}
                    />
                  </div>
                  <div className={css(styles.noticeMessageButtonCol)}>
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

const styles = StyleSheet.create({
  modalBlockM: {
    backgroundColor: '#ffffff',
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: 20,
  },
  modalBlockMDark: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
  modalBlockMInner: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    paddingBottom: '50px',
    boxSizing: 'border-box',
  },
  modalBlockMContainer: {
    paddingLeft: '24px',
    paddingRight: '24px',
    width: '100%',
    boxSizing: 'border-box',
  },
  modalBlockMHeader: {
    paddingTop: '20px',
    paddingBottom: '20px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  modalBlockMClose: {
    width: '16px',
    height: '16px',
  },
  noticeMessage: {
    width: '100%',
    padding: '20px',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
  },
  noticeMessageTitle: {
    marginTop: 0,
    marginBottom: '12px',
    lineHeight: '1em',
    fontSize: '16px',
    fontFamily: 'GilroyBold, sans-serif',
    color: '#1f1f1f',
  },
  noticeMessageButtonCancel: {
    maxWidth: '40%',
    width: '100%',
  },
  noticeMessageButtonSubmit: {
    maxWidth: '60%',
    width: '100%',
  },
  noticeMessageButtonBlock: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: '-6px',
    marginRight: '-6px',
    marginTop: '10px',
  },
  noticeMessageButtonCol: {
    marginLeft: '6px',
    marginRight: '6px',
  },
  formTextarea: {
    width: '100%',
    height: '150px',
    border: '1px solid #DDE2EF',
    outline: 'none',
    transition: 'box-shadow .4s ease-out',
    resize: 'none',
    padding: '12px 12px',
    boxSizing: 'border-box',
    color: '#828282',
    fontSize: '16px',
    fontFamily: 'GilroyRegular, sans-serif',
    overflowX: 'hidden',
    ':focus': { boxShadow: '0px 0px 0px 2px rgba(0, 108, 235, 0.7)' },
  },
});

NoticeForm.propTypes = {
  submit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};
