import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import CloseButton from '../CloseButton/CloseButton';
import { CROP_DEFAULT } from '../Constants/Route';
import './RoutePhotoCropper.css';

export default class RoutePhotoCropper extends Component {
  constructor(props) {
    super(props);

    const { src } = this.props;
    this.state = {
      rotate: 0,
      src,
      left: 50,
      top: 50,
      width: CROP_DEFAULT.width,
    };
    this.moving = null;
    this.startClientX = null;
    this.startClientY = null;
    this.startWidth = null;
    this.startLeft = null;
    this.startTop = null;
  }

  rotate = () => {
    const { rotate } = this.state;
    const image = this.imageRef;
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalHeight;
    canvas.height = image.naturalWidth;

    const x = canvas.width / 2;
    const y = canvas.height / 2;
    const { width } = canvas;
    const { height } = canvas;
    const ctx = canvas.getContext('2d');

    ctx.translate(x, y);
    ctx.rotate(90 * Math.PI / 180);
    ctx.drawImage(image, -height / 2, -width / 2, height, width);
    ctx.rotate(-90 * Math.PI / 180);
    ctx.translate(-x, -y);

    const newImageUrl = canvas.toDataURL();
    this.setState({
      rotate: (rotate + 90) % 360,
      src: newImageUrl,
      left: 50,
      top: 50,
      width: CROP_DEFAULT.width,
    });
  };

  startMoveCrop = (event, moveObjName) => {
    event.stopPropagation();
    const { width, left, top } = this.state;
    this.moving = moveObjName;
    this.startClientX = event.touches[0].clientX;
    this.startClientY = event.touches[0].clientY;
    this.startWidth = width;
    this.startLeft = left;
    this.startTop = top;
  };

  isValid = (width, left, top) => {
    const height = width / CROP_DEFAULT.aspect;
    const imageContainerRect = this.imageContainerRef.getBoundingClientRect();
    if (width < 0) {
      return false;
    }
    if (left / 100 * imageContainerRect.width - width / 2 < 0) {
      return false;
    }
    if (left / 100 * imageContainerRect.width + width / 2 > imageContainerRect.width) {
      return false;
    }
    if (top / 100 * imageContainerRect.height - height / 2 < 0) {
      return false;
    }
    if (top / 100 * imageContainerRect.height + height / 2 > imageContainerRect.height) {
      return false;
    }
    return true;
  };

  onTouchMove = (event) => {
    event.preventDefault();
    const imageContainerRect = this.imageContainerRef.getBoundingClientRect();
    let dx = event.touches[0].clientX - this.startClientX;
    let dy = event.touches[0].clientY - this.startClientY;
    let isValid;
    switch (this.moving) {
    case 'left_top':
      if (Math.abs(dx) > Math.abs(dy)) {
        dy = dx / CROP_DEFAULT.aspect;
      } else {
        dx = dy * CROP_DEFAULT.aspect;
      }
      isValid = this.isValid(
        parseInt(this.startWidth - dx, 10),
        this.startLeft + dx / imageContainerRect.width * 100 / 2,
        this.startTop + dy / imageContainerRect.height * 100 / 2,
      );
      if (!isValid) {
        return;
      }
      this.setState({
        width: parseInt(this.startWidth - dx, 10),
        left: this.startLeft + dx / imageContainerRect.width * 100 / 2,
        top: this.startTop + dy / imageContainerRect.height * 100 / 2,
      });
      break;
    case 'right_top':
      if (Math.abs(dx) > Math.abs(dy)) {
        dy = -dx / CROP_DEFAULT.aspect;
      } else {
        dx = -dy * CROP_DEFAULT.aspect;
      }
      isValid = this.isValid(
        parseInt(this.startWidth + dx, 10),
        this.startLeft + dx / imageContainerRect.width * 100 / 2,
        this.startTop + dy / imageContainerRect.height * 100 / 2,
      );
      if (!isValid) {
        return;
      }
      this.setState({
        width: parseInt(this.startWidth + dx, 10),
        left: this.startLeft + dx / imageContainerRect.width * 100 / 2,
        top: this.startTop + dy / imageContainerRect.height * 100 / 2,
      });
      break;
    case 'left_bottom':
      if (Math.abs(dx) > Math.abs(dy)) {
        dy = -dx / CROP_DEFAULT.aspect;
      } else {
        dx = -dy * CROP_DEFAULT.aspect;
      }
      isValid = this.isValid(
        parseInt(this.startWidth - dx, 10),
        this.startLeft + dx / imageContainerRect.width * 100 / 2,
        this.startTop + dy / imageContainerRect.height * 100 / 2,
      );
      if (!isValid) {
        return;
      }
      this.setState({
        width: parseInt(this.startWidth - dx, 10),
        left: this.startLeft + dx / imageContainerRect.width * 100 / 2,
        top: this.startTop + dy / imageContainerRect.height * 100 / 2,
      });
      break;
    case 'right_bottom':
      if (Math.abs(dx) > Math.abs(dy)) {
        dy = dx / CROP_DEFAULT.aspect;
      } else {
        dx = dy * CROP_DEFAULT.aspect;
      }
      isValid = this.isValid(
        parseInt(this.startWidth + dx, 10),
        this.startLeft + dx / imageContainerRect.width * 100 / 2,
        this.startTop + dy / imageContainerRect.height * 100 / 2,
      );
      if (!isValid) {
        return;
      }
      this.setState({
        width: parseInt(this.startWidth + dx, 10),
        left: this.startLeft + dx / imageContainerRect.width * 100 / 2,
        top: this.startTop + dy / imageContainerRect.height * 100 / 2,
      });
      break;
    case 'all':
      isValid = this.isValid(
        parseInt(this.startWidth, 10),
        this.startLeft + dx / imageContainerRect.width * 100,
        this.startTop + dy / imageContainerRect.height * 100,
      );
      if (!isValid) {
        return;
      }
      this.setState({
        left: this.startLeft + dx / imageContainerRect.width * 100,
        top: this.startTop + dy / imageContainerRect.height * 100,
      });
      break;
    default:
      break;
    }
  };

  getCropped = () => {
    const { width, left, top } = this.state;
    const height = width / CROP_DEFAULT.aspect;
    const imageContainerRect = this.imageContainerRef.getBoundingClientRect();
    const image = this.imageRef;
    const imageWidth = image.naturalWidth;
    const imageHeight = image.naturalHeight;
    const scaleX = imageContainerRect.width / imageWidth;
    const scaleY = imageContainerRect.height / imageHeight;
    const canvas = document.createElement('canvas');
    const realWidth = width / scaleX;
    const realHeight = height / scaleY;
    canvas.width = realWidth;
    canvas.height = realHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      left * imageWidth / 100 - realWidth / 2,
      top * imageHeight / 100 - realHeight / 2,
      realWidth,
      realHeight,
      0,
      0,
      realWidth,
      realHeight,
    );
    return canvas.toDataURL();
  };

  save = () => {
    const { save } = this.props;
    const {
      rotate, width, left, top,
    } = this.state;
    const height = width / CROP_DEFAULT.aspect;
    const image = this.imageRef;
    const imageContainerRect = this.imageContainerRef.getBoundingClientRect();
    save(
      this.getCropped(),
      {
        x: left / 100 * imageContainerRect.width - width / 2,
        y: top / 100 * imageContainerRect.height - height / 2,
        width,
        height,
      },
      rotate,
      image,
    );
  };

  onContextMenu = (event) => {
    event.preventDefault();
  };

  render() {
    const { close } = this.props;
    const {
      src, left, top, width,
    } = this.state;
    const cornerClass = 'modal-block-m__crop-corner';
    return (
      <div className="sticky-bar">
        <div className="modal-block-m modal-block-m_dark modal-block-m__crop-container">
          <div className="modal-block-m__inner modal-block-m__crop-inner">
            <div className="modal-block-m__container">
              <div className="modal-block-m__header">
                <div className="modal-block-m__header-btn">
                  <button type="button" className="turn-m" onClick={this.rotate} />
                </div>
                <div className="modal-block-m__header-btn">
                  <CloseButton onClick={this.save} light />
                </div>
              </div>
            </div>
            <div className="modal-block-m__img">
              {
                src
                  ? (
                    <div
                      className="modal-block-m__img-inner"
                      ref={(ref) => { this.imageContainerRef = ref; return true; }}
                      onTouchMove={this.onTouchMove}
                      onTouchStart={e => this.startMoveCrop(e, 'all')}
                      onContextMenu={this.onContextMenu}
                    >
                      <img
                        ref={(ref) => { this.imageRef = ref; return true; }}
                        src={src}
                        alt=""
                      />
                      <div
                        className="modal-block-m__crop"
                        style={
                          {
                            left: `${left}%`,
                            top: `${top}%`,
                            width: `${width}px`,
                            height: `${width / CROP_DEFAULT.aspect}px`,
                          }
                        }
                      >
                        <div
                          role="button"
                          tabIndex="0"
                          onTouchStart={e => this.startMoveCrop(e, 'left_top')}
                          className={`${cornerClass} modal-block-m__crop-corner_left-top`}
                          onContextMenu={this.onContextMenu}
                        />
                        <div
                          role="button"
                          tabIndex="0"
                          onTouchStart={e => this.startMoveCrop(e, 'right_top')}
                          className={`${cornerClass} modal-block-m__crop-corner_right-top`}
                          onContextMenu={this.onContextMenu}
                        />
                        <div
                          role="button"
                          tabIndex="0"
                          onTouchStart={e => this.startMoveCrop(e, 'right_bottom')}
                          className={`${cornerClass} modal-block-m__crop-corner_right-bottom`}
                          onContextMenu={this.onContextMenu}
                        />
                        <div
                          role="button"
                          tabIndex="0"
                          onTouchStart={e => this.startMoveCrop(e, 'left_bottom')}
                          className={`${cornerClass} modal-block-m__crop-corner_left-bottom`}
                          onContextMenu={this.onContextMenu}
                        />
                      </div>
                    </div>
                  )
                  : ''
              }
            </div>
            <div className="modal-block-m__btn">
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
    );
  }
}

RoutePhotoCropper.propTypes = {
  src: PropTypes.string,
  close: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
};

RoutePhotoCropper.defaultProps = {
  src: null,
};
