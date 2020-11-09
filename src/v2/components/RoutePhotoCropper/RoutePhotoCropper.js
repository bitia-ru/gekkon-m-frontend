import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@/v1/components/Button/Button';
import CloseButton from '@/v1/components/CloseButton/CloseButton';
import { CROP_DEFAULT } from '@/v1/Constants/Route';
import { css, StyleSheet } from '@/v2/aphrodite';

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

  componentDidMount() {
    const { src } = this.state;
    loadImage(
      src,
      (res) => {
        this.setState({ src: res.toDataURL('image/jpeg') });
      },
      {
        canvas: true,
        pixelRatio: 1,
        orientation: true,
      },
    );
  }

  rotate = () => {
    const { rotate, src } = this.state;
    loadImage(
      src,
      (res) => {
        this.setState({
          rotate: (rotate + 90) % 360,
          src: res.toDataURL('image/jpeg'),
          left: 50,
          top: 50,
          width: CROP_DEFAULT.width,
        });
      },
      {
        canvas: true,
        pixelRatio: 1,
        orientation: 6,
      },
    );
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
    const {
      width,
      left,
      top,
      src,
    } = this.state;
    const height = width / CROP_DEFAULT.aspect;
    const imageContainerRect = this.imageContainerRef.getBoundingClientRect();
    const image = this.imageRef;
    const imageWidth = image.naturalWidth;
    const imageHeight = image.naturalHeight;
    const scaleX = imageContainerRect.width / imageWidth;
    const scaleY = imageContainerRect.height / imageHeight;
    const realWidth = width / scaleX;
    const realHeight = height / scaleY;
    loadImage(
      src,
      (res) => {
        this.save(res.toDataURL('image/jpeg'));
      },
      {
        canvas: true,
        left: left * imageWidth / 100 - realWidth / 2,
        top: top * imageHeight / 100 - realHeight / 2,
        right: imageWidth - left * imageWidth / 100 - realWidth / 2,
        bottom: imageHeight - top * imageHeight / 100 - realHeight / 2,
      },
    );
  };

  save = (cropped) => {
    const { save, close } = this.props;
    const {
      rotate, width, left, top,
    } = this.state;
    const height = width / CROP_DEFAULT.aspect;
    const image = this.imageRef;
    const imageContainerRect = this.imageContainerRef.getBoundingClientRect();
    save(
      cropped,
      {
        x: left / 100 * imageContainerRect.width - width / 2,
        y: top / 100 * imageContainerRect.height - height / 2,
        width,
        height,
      },
      rotate,
      image,
    );
    close();
  };

  onContextMenu = (event) => {
    event.preventDefault();
  };

  render() {
    const {
      src, left, top, width,
    } = this.state;
    return (
      <div>
        <div
          className={
            css(
              styles.modalBlockM,
              styles.modalBlockMDark,
              styles.modalBlockMCropContainer,
            )
          }
        >
          <div className={css(styles.modalBlockMInner, styles.modalBlockMCropInner)}>
            <div className={css(styles.modalBlockMContainer)}>
              <div className={css(styles.modalBlockMHeader)}>
                <div className={css(styles.modalBlockMHeaderBtn)}>
                  <button
                    type="button"
                    className={css(styles.turnM)}
                    onClick={() => this.rotate()}
                  />
                </div>
                <div className={css(styles.modalBlockMHeaderBtn)}>
                  <CloseButton onClick={this.getCropped} light />
                </div>
              </div>
            </div>
            <div className={css(styles.modalBlockMImg)}>
              {
                src
                  ? (
                    <div
                      className={css(styles.modalBlockMImgInner)}
                      ref={(ref) => { this.imageContainerRef = ref; }}
                      onTouchMove={this.onTouchMove}
                      onTouchStart={e => this.startMoveCrop(e, 'all')}
                      onContextMenu={this.onContextMenu}
                    >
                      <img
                        ref={(ref) => { this.imageRef = ref; }}
                        src={src}
                        alt=""
                      />
                      <div
                        className={css(styles.modalBlockMCrop)}
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
                          style={{ outline: 'none' }}
                          onTouchStart={e => this.startMoveCrop(e, 'left_top')}
                          className={
                            css(
                              styles.modalBlockMCropCorner,
                              styles.modalBlockMCropCornerLeftTop,
                            )
                          }
                          onContextMenu={this.onContextMenu}
                        />
                        <div
                          role="button"
                          tabIndex="0"
                          style={{ outline: 'none' }}
                          onTouchStart={e => this.startMoveCrop(e, 'right_top')}
                          className={
                            css(
                              styles.modalBlockMCropCorner,
                              styles.modalBlockMCropCornerRightTop,
                            )
                          }
                          onContextMenu={this.onContextMenu}
                        />
                        <div
                          role="button"
                          tabIndex="0"
                          style={{ outline: 'none' }}
                          onTouchStart={e => this.startMoveCrop(e, 'right_bottom')}
                          className={
                            css(
                              styles.modalBlockMCropCorner,
                              styles.modalBlockMCropCornerRightBottom
                            )
                          }
                          onContextMenu={this.onContextMenu}
                        />
                        <div
                          role="button"
                          tabIndex="0"
                          style={{ outline: 'none' }}
                          onTouchStart={e => this.startMoveCrop(e, 'left_bottom')}
                          className={
                            css(
                              styles.modalBlockMCropCorner,
                              styles.modalBlockMCropCornerLeftBottom
                            )
                          }
                          onContextMenu={this.onContextMenu}
                        />
                      </div>
                    </div>
                  )
                  : ''
              }
            </div>
            <div className={css(styles.modalBlockMBtn)}>
              <Button
                size="big"
                buttonStyle="normal"
                title="Сохранить"
                smallFont
                onClick={this.getCropped}
              />
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
  modalBlockMDark: { backgroundColor: 'rgba(0, 0, 0)' },
  modalBlockMCropContainer: {
    height: '100vh',
    overflow: 'hidden',
  },
  modalBlockMInner: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    paddingBottom: '50px',
    boxSizing: 'border-box',
  },
  modalBlockMCropInner: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 0,
    overflow: 'hidden',
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
  modalBlockMHeaderBtn: {
    width: '16px',
    height: '16px',
    position: 'static',
    zIndex: 20,
    marginLeft: '18px',
  },
  modalBlockMImg: {
    width: '100%',
    maxWidth: '100%',
    height: 'calc(100vh - 108px)',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    '> img': {
      width: 'auto',
      height: '100%',
      maxHeight: '100%',
    },
  },
  modalBlockMImgInner: {
    position: 'relative',
    height: '100%',
  },
  modalBlockMCrop: {
    position: 'absolute',
    content: '\'\'',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    height: '354px',
    border: '2px dashed #ffffff',
    boxShadow: '0 0 0 9999em rgba(0, 0, 0, 0.5)',
  },
  modalBlockMCropCorner: {
    width: '2.25vw',
    height: '2.25vw',
    border: '2px solid #ffffff',
    position: 'absolute',
    content: '\'\'',
  },
  modalBlockMCropCornerLeftTop: {
    top: '-1.7vw',
    left: '-1.7vw',
  },
  modalBlockMCropCornerRightTop: {
    top: '-1.7vw',
    right: '-1.7vw',
  },
  modalBlockMCropCornerRightBottom: {
    bottom: '-1.7vw',
    right: '-1.7vw',
  },
  modalBlockMCropCornerLeftBottom: {
    bottom: '-1.7vw',
    left: '-1.7vw',
  },
  modalBlockMBtn: {
    position: 'relative',
    zIndex: 10,
  },
  turnM: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    border: 0,
    boxShadow: 'none',
    outline: 'none',
    cursor: 'pointer',
    padding: 0,
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2217%22%20height%3D%2217%22%20viewBox%3D%220%200%2017%2017%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cg%20clip-path%3D%22url%28%23clip0%29%22%3E%0A%3Cpath%20d%3D%22M3.24024%2015.0568C4.69511%2016.1706%206.42564%2016.7592%208.24448%2016.7592H8.24459C8.61108%2016.7592%208.98239%2016.7345%209.34809%2016.6859C11.535%2016.3955%2013.478%2015.2708%2014.8189%2013.519C15.6349%2012.4532%2016.1834%2011.1945%2016.4052%209.87875C16.4438%209.65007%2016.2897%209.43337%2016.061%209.39479L14.9567%209.20854C14.8467%209.19007%2014.7342%209.21588%2014.6434%209.28044C14.5526%209.34501%2014.4913%209.44294%2014.4727%209.5528C14.3037%2010.5549%2013.8853%2011.5144%2013.2628%2012.3277C12.24%2013.6638%2010.7581%2014.5216%209.08996%2014.7431C8.81031%2014.7803%208.52659%2014.7991%208.24678%2014.7991C6.8605%2014.7991%205.54125%2014.3501%204.43143%2013.5005C3.09538%2012.4777%202.23753%2010.9959%202.01601%209.32782C1.79444%207.65988%202.23574%206.00545%203.25849%204.66934C4.45909%203.10108%206.28509%202.20169%208.26834%202.20169C9.66183%202.20169%2010.9832%202.64943%2012.0897%203.49641C12.4565%203.77717%2012.7858%204.0908%2013.0767%204.43456L11.0086%204.06947C10.8991%204.05004%2010.7861%204.07512%2010.6948%204.13896C10.6035%204.20285%2010.5414%204.30033%2010.522%204.41003L10.3273%205.51286C10.287%205.74126%2010.4395%205.95908%2010.6678%205.9994L15.6307%206.87556C15.655%206.87987%2015.6794%206.88194%2015.7037%206.88194C15.7893%206.88194%2015.8734%206.85579%2015.9446%206.80607C16.0358%206.74218%2016.0979%206.64469%2016.1173%206.53499L16.9934%201.57213C17.0337%201.34373%2016.8813%201.12591%2016.6528%201.08553L15.55%200.890837C15.3213%200.850352%2015.1037%201.003%2015.0635%201.2314L14.6947%203.32002C14.2811%202.807%2013.8061%202.34218%2013.281%201.94019C11.8299%200.829354%2010.0971%200.242188%208.26968%200.242188C5.67021%200.242188%203.27652%201.42162%201.70233%203.47799C0.36141%205.22986%20-0.217134%207.399%200.0733138%209.5859C0.363817%2011.773%201.48854%2013.7158%203.24024%2015.0568Z%22%20fill%3D%22%23C4C4C4%22/%3E%0A%3C/g%3E%0A%3Cdefs%3E%0A%3CclipPath%20id%3D%22clip0%22%3E%0A%3Crect%20width%3D%2217%22%20height%3D%2217%22%20fill%3D%22white%22/%3E%0A%3C/clipPath%3E%0A%3C/defs%3E%0A%3C/svg%3E%0A")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    transition: 'opacity .4s ease-out',
    ':hover': { opacity: '.6' },
  },
});

RoutePhotoCropper.propTypes = {
  src: PropTypes.string,
  close: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
};

RoutePhotoCropper.defaultProps = {
  src: null,
};
