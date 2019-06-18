import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CloseButton from '../CloseButton/CloseButton';
import Button from '../Button/Button';
import './CategoryFilter.css';

export default class CategoryFilter extends Component {
  onItemSelect = (id) => {

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
                    <div className="level level_big level_5c">
                      5c
                    </div>
                  </div>
                </div>
                <div className="range__select-item">
                  <div className="range__title">
                    До
                  </div>
                  <div className="range__container">
                    <div className="level level_big level_7b">
                      7b
                    </div>
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
                  onClick={() => console.log('Сохранить')}
                />
              </div>
              <Button
                title="Сбросить"
                customClass="range__btn-cancel"
                onClick={() => console.log('Сбросить')}
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
