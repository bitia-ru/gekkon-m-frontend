import React from 'react';
import PropTypes from 'prop-types';
import { ModalContext } from '../../modules/modalable';
import { StyleSheet, css } from '@/v2/aphrodite';

import './index.css';
import CloseButton from '@/v1/components/CloseButton/CloseButton';


const onClick = (event) => {
  event.stopPropagation();
};

const Modal = ({
  maxWidth, maxHeight, controls, children, backgroundColor,
}) => (
  <ModalContext.Consumer>
    {
      ({ closeModal }) => (
        <div
          className={
            css(
              style.modal,
              maxWidth && maxWidthStyle(maxWidth),
              maxHeight && maxHeightStyle(maxHeight),
            )
          }
          onClick={onClick}
        >
          <div className={css(style.controlsContainer)}>
            <button
              type="button"
              className="close"
              onClick={closeModal}
              style={{
                width: '17px',
                height: '17px',
              }}
            />
            {controls}
          </div>
          <div className={css(style.modalBlockM)}>
            <div className={css(style.modalBlockM__inner)}>
              <div
                className={
                  css(
                    style.modalBlockM__container,
                    backgroundColor && backgroundColorStyle(backgroundColor),
                  )
                }
              >
                <div className={css(style.modalBlockM__header)}>
                  <div className={css(style.modalBlockM__headerBtn)}>
                    <CloseButton onClick={closeModal} />
                  </div>
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>
      )
    }
  </ModalContext.Consumer>
);

Modal.propTypes = {
  controls: PropTypes.arrayOf(PropTypes.element),
};

const style = StyleSheet.create({
  modal: {
    position: 'relative',
    margin: '20px auto',
    backgroundColor: 'white',
    padding: '0',
    color: '#393C51',
    minHeight: '64px',
  },
  controlsContainer: {
    position: 'absolute',
    content: '',
    right: '-40px',
    top: 0,
    width: '17px',
    height: '100%',
    alignItems: 'center',
    display: 'flex',
    flexFlow: 'column',
    overflow: 'hidden',
  },
  modalBlockM: {
    backgroundColor: '#ffffff',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    width: '100%',
    zIndex: 20,
  },
  modalBlockM__inner: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    paddingBottom: '50px',
    boxSizing: 'border-box',
  },
  modalBlockM__container: {
    paddingLeft: '24px',
    paddingRight: '24px',
    width: '100%',
    boxSizing: 'border-box',
  },
  modalBlockM__containerBlue: {
    backgroundColor: '#E8F2F9',
  },
  modalBlockM__header: {
    paddingTop: '20px',
    paddingBottom: '20px',
    display: 'flex',
    justifyСontent: 'flex-end',
  },
  modalBlockM__headerBtn: {
    width: '16px',
    height: '16px',
    marginLeft: 'auto',
    position: 'static',
    zIndex: 20,
  },
});

const maxWidthStyle = (width) => (
  StyleSheet.create({ maxWidth: { width: '100%', maxWidth: width } }).maxWidth
);

const maxHeightStyle = (height) => (
  StyleSheet.create({ maxHeight: { height: '100%', maxheight: height } }).maxHeight
);

const backgroundColorStyle = (backgroundColor) => (
  StyleSheet.create({ backgroundColor: { backgroundColor } }).maxHeight
);

export default Modal;
