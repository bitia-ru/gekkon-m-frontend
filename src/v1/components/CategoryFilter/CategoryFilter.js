import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CloseButton from '../CloseButton/CloseButton';
import Button from '../Button/Button';
import Category from '../Category/Category';
import { getCategoryColor } from '../../Constants/Categories';
import './CategoryFilter.css';

export default class CategoryFilter extends Component {
  onItemSelect = () => {

  };

  render() {
    const { close } = this.props;
    return (
      <div className="modal-block-m modal-block-m_dark">
        <div className="modal-block-m__inner">
          <div className="modal-block-m__container">
            <div className="modal-block-m__header">
              <div className="modal-block-m__close">
                <CloseButton onClick={close} light />
              </div>
            </div>
            <div className="range range_no-pb">
              <div className="range__top">
                <div className="range__select-item">
                  <div className="range__title">
                    От
                  </div>
                  <div className="range__container">
                    <Category category="5c" size="big" color={getCategoryColor('5c')} />
                  </div>
                </div>
                <div className="range__select-item">
                  <div className="range__title">
                    До
                  </div>
                  <div className="range__container">
                    <Category category="7b" size="big" color={getCategoryColor('7b')} />
                  </div>
                </div>
              </div>
              <div className="range__slider">
                <div className="range__slider-ruler">
                  <div className="range__slider-ruler-item range__slider-ruler-item_first">9C+</div>
                  <div className="range__slider-ruler-item range__slider-ruler-item_middle">7B</div>
                  <div className="range__slider-ruler-item range__slider-ruler-item_last">5A</div>
                </div>
                <div className="range__slider-bar">
                  <div className="range__slider-passed-wrapper">
                    <div className="range__slider-passed-bar range__slider-passed-bar_left" />
                    <div className="range__slider-passed-bar range__slider-passed-bar_right" />
                  </div>
                  <div className="range__slider-bar-handler range__slider-bar-handler_left" />

                  <div className="range__slider-bar-handler range__slider-bar-handler_right" />
                  <div className="range__slider-bar-item range__slider-bar-item_first" />
                  <div className="range__slider-bar-item range__slider-bar-item_middle" />
                  <div className="range__slider-bar-item range__slider-bar-item_last" />
                </div>
              </div>
              <div className="range__btn">
                <Button
                  size="big"
                  buttonStyle="normal"
                  title="Сохранить"
                  smallFont
                  onClick={() => {}}
                />
              </div>
              <Button
                title="Сбросить"
                customClass="range__btn-cancel"
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CategoryFilter.propTypes = {
  close: PropTypes.func.isRequired,
};
