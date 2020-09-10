import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { CATEGORIES, getCategoryColor } from '@/v1/Constants/Categories';
import CloseButton from '@/v1/components/CloseButton/CloseButton';
import Button from '@/v1/components/Button/Button';
import Category from '@/v2/components/Category/Category';
import { StyleSheet, css } from '@/v2/aphrodite';

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
        className={css(styles.modalBlockM, styles.modalBlockMDark)}
        onClick={hide}
      >
        <div className={css(styles.modalBlockMInner)}>
          <div className={css(styles.modalBlockMContainer)}>
            <div className={css(styles.modalBlockMHeader)}>
              <div className={css(styles.modalBlockMClose)}>
                <CloseButton onClick={hide} light />
              </div>
            </div>
            <div
              role="button"
              tabIndex="0"
              style={{ outline: 'none' }}
              onClick={e => e.stopPropagation()}
              className={css(styles.range)}
            >
              <div className={css(styles.rangeTop, styles.rangeTopCenter)}>
                <div className={css(styles.rangeSelectItem)}>
                  <div className={css(styles.rangeContainer)}>
                    <Category
                      category={category}
                      size="large"
                      color={getCategoryColor(category)}
                    />
                  </div>
                </div>
              </div>
              <div
                className={css(styles.rangeSlider)}
                ref={(ref) => { this.sliderRef = ref; }}
                onTouchEnd={this.onTouchEnd}
                onTouchMove={this.change}
                onTouchStart={this.startChange}
              >
                <div className={css(styles.rangeSliderRuler)}>
                  <div
                    className={
                      css(
                        styles.rangeSliderRulerItem,
                        styles.rangeSliderRulerItemFirst,
                      )
                    }
                  >
                    {CATEGORIES[0].toUpperCase()}
                  </div>
                  <div
                    className={
                      css(
                        styles.rangeSliderRulerItem,
                        styles.rangeSliderRulerItemMiddle,
                      )
                    }
                  >
                    {CATEGORIES[parseInt((CATEGORIES.length - 1) / 2, 10)].toUpperCase()}
                  </div>
                  <div
                    className={
                      css(
                        styles.rangeSliderRulerItem,
                        styles.rangeSliderRulerItemLast,
                      )
                    }
                  >
                    {CATEGORIES[CATEGORIES.length - 1].toUpperCase()}
                  </div>
                </div>
                <div
                  className={css(styles.rangeSliderBar)}
                >
                  <div
                    style={{ left: `calc(${this.positionFromCategory(category)}% - 4px` }}
                    className={css(styles.rangeSliderBarHandler, styles.rangeSliderBarHandlerLeft)}
                  />
                  <div className={css(styles.rangeSliderBarItem, styles.rangeSliderBarItemFirst)} />
                  <div
                    className={
                      css(
                        styles.rangeSliderBarItem,
                        styles.rangeSliderBarItemMiddle,
                      )
                    }
                  />
                  <div className={css(styles.rangeSliderBarItem, styles.rangeSliderBarItemLast)} />
                </div>
              </div>
              <div className={css(styles.rangeBtn)}>
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
  range: {
    padding: '22px 16px',
    backgroundColor: '#ffffff',
    display: 'block',
  },
  rangeTop: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '40px',
  },
  rangeTopCenter: { justifyContent: 'center' },
  rangeTitle: {
    fontSize: '12px',
    lineHeight: '12px',
    marginBottom: '10px',
  },
  rangeSlider: {
    backgroundColor: '#ffffff',
    paddingBottom: '24px',
  },
  rangeSliderActive: { display: 'flex' },
  rangeSliderBar: {
    boxSizing: 'border-box',
    width: '100%',
    height: '8px',
    border: '2px solid #DDE2EF',
    position: 'relative',
    background: 'linear-gradient(to right, #FFFFFF 33%, #FFE602 39%, #48FF66 44%, #7C81FF 50%, #EB002A 56%, #141414 100%)',
  },
  rangeSliderPassedWrapper: {
    position: 'absolute',
    content: '\'\'',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    height: '4px',
    width: '100%',
    overflowX: 'hidden',
  },
  rangeSliderPassedBar: {
    position: 'absolute',
    content: '\'\'',
    height: '4px',
    width: '100%',
    backgroundColor: '#B7C6CB',
    top: 0,
  },
  rangeSliderPassedBarLeft: {
    left: '-100%',
    transform: 'translateX(20%)',
  },
  rangeSliderPassedBarRight: {
    right: '-100%',
    transform: 'translateX(-20%)',
  },
  rangeSliderBarHandler: {
    position: 'absolute',
    content: '\'\'',
    width: '9px',
    height: '20px',
    bottom: '-24px',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%229%22%20height%3D%2220%22%20viewBox%3D%220%200%209%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20d%3D%22M4.5%201.49485L8%205.38374L8%2019L0.999999%2019L1%205.38374L4.5%201.49485Z%22%20fill%3D%22white%22%20stroke%3D%22%23006CEB%22%20stroke-width%3D%222%22/%3E%0A%3C/svg%3E%0A")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    cursor: 'pointer',
  },
  rangeSliderBarHandlerLeft: { left: 'calc(20% - 4px)' },
  rangeSliderBarHandlerRight: { right: 'calc(20% - 4px)' },
  rangeSliderBarItem: {
    position: 'absolute',
    bottom: 0,
    content: '\'\'',
    width: '2px',
    height: '6px',
    backgroundColor: '#DDE2EF',
    top: '-6px',
  },
  rangeSliderBarItemFirst: { left: '-2px' },
  rangeSliderBarItemMiddle: {
    left: '50%',
    transform: 'translateX(-50%)',
  },
  rangeSliderBarItemLast: {
    right: '-2px',
  },
  rangeSliderRuler: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '12px',
    position: 'relative',
  },
  rangeSliderRulerItem: {
    position: 'absolute',
    content: '\'\'',
    bottom: '100%',
    fontSize: '14px',
    lineHeight: '1em',
    color: '#1f1f1f',
    fontFamily: 'GilroyBold, sans-serif',
    alignSelf: 'flex-end',
  },
  rangeSliderRulerItemFirst: { left: 0 },
  rangeSliderRulerItemMiddle: {
    left: '50%',
    transform: 'translateX(-50%)',
  },
  rangeSliderRulerItemLast: { right: 0 },
  rangeBtn: { marginTop: '20px' },
  rangeBtnCancel: {
    padding: 0,
    paddingTop: '14px',
    paddingBottom: '14px',
    marginTop: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#C2C3C8',
    fontSize: '14px',
    fontFamily: 'GilroyRegular, sans-serif',
    width: '100%',
    transition: '.4s ease-out',
    ':hover': {
      backgroundColor: '#C6C7CC',
      color: '#1f1f1f',
    },
  },
  rangeNoPb: { paddingBottom: '10px' },
});

CategorySlider.propTypes = {
  category: PropTypes.string.isRequired,
  changeCategory: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired,
};
