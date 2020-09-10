import React, { Component } from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import CloseButton from '@/v1/components/CloseButton/CloseButton';
import Button from '@/v1/components/Button/Button';
import getColorStyle from '@/v1/Constants/RouteColorPicker';
import './RouteColorPicker.css';
import { StyleSheet, css } from '@/v2/aphrodite';

export default class RouteColorPicker extends Component {
  selectItem = (routeMarkColor) => {
    const { onClick } = this.props;
    onClick(routeMarkColor);
  };

  removeRouteMarkColor = () => {
    const { onClick } = this.props;
    onClick(null);
  };

  render() {
    const { hide, routeMarkColors } = this.props;
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
            <div className={css(styles.routeColorPicker)}>
              <div className={css(styles.routeColorPickerWrapper)}>
                {
                  R.map(routeMarkColor => (
                    <li
                      key={routeMarkColor.id}
                      className={
                        css(
                          styles.routeColorPickerItem,
                          styles.routeColorPickerItemPadding10,
                        )
                      }
                    >
                      <div
                        role="button"
                        tabIndex="0"
                        style={{ outline: 'none' }}
                        className={css(styles.markColorPickerItem)}
                        onClick={() => this.selectItem(routeMarkColor)}
                      >
                        <div
                          className={css(styles.markColorPickerColor)}
                          style={getColorStyle(routeMarkColor)}
                        />
                        <div className={css(styles.markColorPickerItemText)}>
                          {routeMarkColor.name}
                        </div>
                      </div>
                    </li>
                  ),
                  routeMarkColors)
                }
              </div>
              <Button
                customClass={css(styles.routeColorPickerButtonCancel)}
                title="Сбросить"
                onClick={this.removeRouteMarkColor}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  markColorPickerColor: {
    display: 'inline-block',
    width: '60px',
    height: '20px',
    verticalAlign: 'middle',
    marginLeft: '15px',
  },
  markColorPickerItem: {
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
  },
  markColorPickerItemText: {
    fontSize: '16px',
    fontFamily: 'GilroyRegular, sans-serif',
    paddingLeft: '20px',
  },
  routeColorPicker: {
    backgroundColor: '#ffffff',
    minWidth: '100%',
    boxSizing: 'border-box',
    display: 'block',
  },
  routeColorPickerItem: {
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
  routeColorPickerItemPadding10: { padding: '10px' },
  routeColorPickerWrapper: {
    paddingTop: '10px',
    maxHeight: '270px',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
  },
  routeColorPickerButtonCancel: {
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

RouteColorPicker.propTypes = {
  hide: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  routeMarkColors: PropTypes.array.isRequired,
};
