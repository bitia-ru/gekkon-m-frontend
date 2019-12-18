import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { CATEGORIES, getCategoryColor } from '../../Constants/Categories';
import CloseButton from '../CloseButton/CloseButton';
import Button from '../Button/Button';
import Category from '../Category/Category';
import './CategorySlider.css';

export default class CategorySlider extends Component {
  constructor(props) {
    super(props);

    const { category } = this.props;
    this.state = {
      editing: false,
      category,
    };
  }

  startChange = (event) => {
    event.stopPropagation();
    this.setState({ editing: true });
  };

  change = (event) => {
    const { editing } = this.state;
    if (editing) {
      const sliderBarRect = this.sliderRef.getBoundingClientRect();
      const { clientX } = event.touches[0];
      let newPosition = (clientX - sliderBarRect.left) / sliderBarRect.width * 100;
      if (newPosition > 100) {
        newPosition = 100;
      }
      if (newPosition < 0) {
        newPosition = 0;
      }
      this.setState({ category: this.categoryFromPosition(newPosition) });
    }
  };

  onTouchEnd = (event) => {
    const sliderBarRect = this.sliderRef.getBoundingClientRect();
    const { clientX } = event.changedTouches[0];
    let newPosition = (clientX - sliderBarRect.left) / sliderBarRect.width * 100;
    if (newPosition > 100) {
      newPosition = 100;
    }
    if (newPosition < 0) {
      newPosition = 0;
    }
    this.setState({ category: this.categoryFromPosition(newPosition) });
    this.stopEditing();
  };

  stopEditing = () => {
    this.setState({ editing: false });
  };

  categoryFromPosition = position => (
    CATEGORIES[parseInt(position / 100 * (CATEGORIES.length - 1), 10)]
  );

  positionFromCategory = (category) => {
    const index = R.findIndex(c => c === category)(CATEGORIES);
    return 100 * index / (CATEGORIES.length - 1);
  };

  save = () => {
    const { hide, changeCategory } = this.props;
    const { category } = this.state;
    changeCategory(category);
    hide();
  };

  render() {
    const { hide } = this.props;
    const { category } = this.state;
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
            <div
              role="button"
              tabIndex="0"
              style={{ outline: 'none' }}
              onClick={e => e.stopPropagation()}
              className="range"
            >
              <div className="range__top range__top_center">
                <div className="range__select-item">
                  <div className="range__container">
                    <Category
                      category={category}
                      size="large"
                      color={getCategoryColor(category)}
                    />
                  </div>
                </div>
              </div>
              <div
                className="range__slider"
                ref={(ref) => { this.sliderRef = ref; }}
                onTouchEnd={this.onTouchEnd}
                onTouchMove={this.change}
                onTouchStart={this.startChange}
              >
                <div className="range__slider-ruler">
                  <div className="range__slider-ruler-item range__slider-ruler-item_first">
                    {CATEGORIES[0].toUpperCase()}
                  </div>
                  <div className="range__slider-ruler-item range__slider-ruler-item_middle">
                    {CATEGORIES[parseInt((CATEGORIES.length - 1) / 2, 10)].toUpperCase()}
                  </div>
                  <div className="range__slider-ruler-item range__slider-ruler-item_last">
                    {CATEGORIES[CATEGORIES.length - 1].toUpperCase()}
                  </div>
                </div>
                <div
                  className="range__slider-bar"
                >
                  <div
                    style={{ left: `calc(${this.positionFromCategory(category)}% - 4px` }}
                    className="range__slider-bar-handler range__slider-bar-handler_left"
                  />
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
                  onClick={this.save}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CategorySlider.propTypes = {
  category: PropTypes.string.isRequired,
  changeCategory: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired,
};
