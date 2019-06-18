import React, { Component } from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import CloseButton from '../CloseButton/CloseButton';
import Button from '../Button/Button';
import getColorStyle from '../Constants/RouteColorPicker';
import './RouteColorPicker.css';

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
            <div className="route-color-picker">
              <div className="route-color-picker__wrapper">
                {
                  R.map(routeMarkColor => (
                    <li
                      key={routeMarkColor.id}
                      className="route-color-picker__item route-color-picker__item_padding-10"
                    >
                      <div
                        role="button"
                        tabIndex="0"
                        className="mark-color-picker__item"
                        onClick={() => this.selectItem(routeMarkColor)}
                      >
                        <div
                          className="mark-color-picker__color"
                          style={getColorStyle(routeMarkColor)}
                        />
                        <div className="mark-color-picker__item-text">{routeMarkColor.name}</div>
                      </div>
                    </li>
                  ),
                  routeMarkColors)
                }
              </div>
              <Button
                customClass="route-color-picker__button-cancel"
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

RouteColorPicker.propTypes = {
  hide: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  routeMarkColors: PropTypes.array.isRequired,
};
