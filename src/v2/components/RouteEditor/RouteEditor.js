import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Marker from '@/v1/components/Marker/Marker';
import MARKER_RADIUS from '@/v1/Constants/Marker';
import {
  SHORT_CLICK_DELAY,
  MARKER_DISPLAY_SHIFT,
  MARKER_SEARCH_RADIUS,
  SHOW_TRASH_DELAY,
} from '@/v1/Constants/Route';
import RouteContext from '@/v1/contexts/RouteContext';
import Trash from '@/v2/components/Trash/Trash';
import CloseButton from '@/v1/components/CloseButton/CloseButton';
import { getPointerType } from '@/v1/components/Marker/utils';
import { css, StyleSheet } from '@/v2/aphrodite';

export default class RouteEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movingPointerIndex: null,
      showTopTrash: false,
      showBottomTrash: false,
      topTrashActive: false,
      bottomTrashActive: false,
    };
    this.showTrashTimerId = null;
    this.shortClickTimerId = null;
    this.topTrashRef = null;
    this.bottomTrashRef = null;
    this.isRotate = true;
    this.shift = 0;
  }

  addPointer = (x, y) => {
    const { pointers, updatePointers } = this.props;
    updatePointers(R.append({
      x, y, dx: 0, dy: 0, angle: 0,
    }, pointers));
  };

  onTouchStart = (event) => {
    const imageContainerRect = this.imageContainerRef.getBoundingClientRect();
    if (!this.isMoving) {
      this.clientX = event.touches[0].clientX / imageContainerRect.width * 100;
      this.clientY = event.touches[0].clientY / imageContainerRect.height * 100;
      this.searchMarker(event);
    }
  };

  searchMarker = (event) => {
    const { pointers } = this.props;
    const imageContainerRect = this.imageContainerRef.getBoundingClientRect();
    let dr = MARKER_SEARCH_RADIUS ** 2;
    let index = -1;
    const forEachIndexed = R.addIndex(R.forEach);
    forEachIndexed(
      (p, i) => {
        const left = imageContainerRect.x / imageContainerRect.width * 100;
        const top = imageContainerRect.y / imageContainerRect.height * 100;
        const dx = p.x - this.clientX + left + this.getXShift(p.angle);
        const dy = p.y - this.clientY + top + this.getYShift(p.angle);
        if ((dx ** 2) + (dy ** 2) <= MARKER_SEARCH_RADIUS ** 2) {
          dr = (dx ** 2) + (dy ** 2);
          index = i;
        }
      },
      pointers,
    );
    if (dr < MARKER_SEARCH_RADIUS ** 2) {
      event.preventDefault();
      this.onStartMoving(
        index,
        this.clientX * imageContainerRect.width / 100,
        this.clientY * imageContainerRect.height / 100,
      );
      return true;
    }
    return false;
  };

  onTouchMove = (event) => {
    const { pointers, updatePointers } = this.props;
    const { movingPointerIndex } = this.state;
    if (movingPointerIndex !== null) {
      event.preventDefault();
      const { clientX, clientY } = event.touches[0];
      this.setState({ topTrashActive: this.touchIsOver(this.topTrashRef, clientX, clientY) });
      this.setState({
        bottomTrashActive: this.touchIsOver(this.bottomTrashRef, clientX, clientY),
      });
      const imageContainerRect = this.imageContainerRef.getBoundingClientRect();
      const pointersCopy = R.clone(pointers);
      const index = movingPointerIndex;
      const dx = clientX - imageContainerRect.x;
      const dy = clientY - imageContainerRect.y;
      const newX = dx / imageContainerRect.width * 100 - this.shift;
      const newY = dy / imageContainerRect.height * 100 - this.shift;
      if (newX > 0 && newX < 100) {
        pointersCopy[index].dx = newX - pointers[index].x;
        pointersCopy[index].dy = newY - pointers[index].y;
        updatePointers(pointersCopy);
      }
    }
  };

  rotate = (index) => {
    const { pointers, updatePointers } = this.props;
    const pointersCopy = R.clone(pointers);
    pointersCopy[index].x += pointersCopy[index].dx;
    pointersCopy[index].y += pointersCopy[index].dy;
    pointersCopy[index].dx = 0;
    pointersCopy[index].dy = 0;
    pointersCopy[index].angle = (pointersCopy[index].angle + 90) % 360;
    updatePointers(pointersCopy);
  };

  touchIsOver = (ref, clientX, clientY) => {
    const refRect = ref.getBoundingClientRect();
    if (refRect.x > clientX) {
      return false;
    }
    if (refRect.y > clientY) {
      return false;
    }
    if (refRect.x + refRect.width < clientX) {
      return false;
    }
    if (refRect.y + refRect.height < clientY) {
      return false;
    }
    return true;
  };

  getXShift = (angle) => {
    const imageContainerRect = this.imageContainerRef.getBoundingClientRect();
    switch (angle) {
    case 0:
      return -MARKER_RADIUS / imageContainerRect.width * 100;
    case 90:
      return -MARKER_RADIUS / imageContainerRect.width * 100;
    case 180:
      return MARKER_RADIUS / imageContainerRect.width * 100;
    case 270:
      return MARKER_RADIUS / imageContainerRect.width * 100;
    default:
      break;
    }
    return 0;
  };

  getYShift = (angle) => {
    const imageContainerRect = this.imageContainerRef.getBoundingClientRect();
    switch (angle) {
    case 0:
      return MARKER_RADIUS / imageContainerRect.height * 100;
    case 90:
      return -MARKER_RADIUS / imageContainerRect.height * 100;
    case 180:
      return -MARKER_RADIUS / imageContainerRect.height * 100;
    case 270:
      return MARKER_RADIUS / imageContainerRect.height * 100;
    default:
      break;
    }
    return 0;
  };

  onTouchEnd = (event) => {
    const { pointers, updatePointers } = this.props;
    const { movingPointerIndex } = this.state;
    const imageContainerRect = this.imageContainerRef.getBoundingClientRect();
    if (this.isMoving) {
      event.preventDefault();
      clearTimeout(this.shortClickTimerId);
      const { clientX, clientY } = event.changedTouches[0];
      const isOverTopTrash = this.touchIsOver(this.topTrashRef, clientX, clientY);
      const isOverBottomTrash = this.touchIsOver(this.bottomTrashRef, clientX, clientY);
      if (isOverTopTrash || isOverBottomTrash) {
        this.removePointer(movingPointerIndex);
      } else if (this.isRotate) {
        this.rotate(movingPointerIndex);
        this.setState({ movingPointerIndex: null });
      } else {
        const pointersCopy = R.clone(pointers);
        const dx = clientX - imageContainerRect.x;
        const dy = clientY - imageContainerRect.y;
        const newX = dx / imageContainerRect.width * 100 - this.shift;
        const newY = dy / imageContainerRect.height * 100 - this.shift;
        const newDx = newX - pointersCopy[movingPointerIndex].x;
        const newDy = newY - pointersCopy[movingPointerIndex].y;
        pointersCopy[movingPointerIndex].x += newDx;
        pointersCopy[movingPointerIndex].y += newDy;
        pointersCopy[movingPointerIndex].dx = 0;
        pointersCopy[movingPointerIndex].dy = 0;
        updatePointers(pointersCopy);
        this.setState({ movingPointerIndex: null });
      }
      this.isMoving = false;
      this.shift = 0;
      clearTimeout(this.showTrashTimerId);
      this.setState({
        showTopTrash: false,
        showBottomTrash: false,
        topTrashActive: false,
        bottomTrashActive: false,
      });
    } else {
      const clientX = event.changedTouches[0].clientX / imageContainerRect.width * 100;
      const clientY = event.changedTouches[0].clientY / imageContainerRect.height * 100;
      const dx = clientX - imageContainerRect.x / imageContainerRect.width * 100;
      const dy = clientY - imageContainerRect.y / imageContainerRect.height * 100;
      const xPosition = dx + MARKER_RADIUS / imageContainerRect.width * 100;
      const yPosition = dy - MARKER_RADIUS / imageContainerRect.height * 100;
      this.addPointer(xPosition + this.getXShift(0), yPosition + this.getYShift(0));
    }
  };

  removePointer = (index) => {
    const { pointers, updatePointers } = this.props;
    updatePointers(R.remove(index, 1, pointers));
  };

  onContextMenu = (event) => {
    event.preventDefault();
  };

  afterRotateDelay = () => {
    const { pointers, updatePointers } = this.props;
    const { movingPointerIndex } = this.state;
    const pointersCopy = R.clone(pointers);
    this.isRotate = false;
    this.shift = MARKER_DISPLAY_SHIFT;
    pointersCopy[movingPointerIndex].dx -= this.shift;
    pointersCopy[movingPointerIndex].dy -= this.shift;
    updatePointers(pointersCopy);
  };

  onStartMoving = (index, clientX, clientY) => {
    const { pointers, updatePointers } = this.props;
    this.isMoving = true;
    const self = this;
    if (pointers[index].y > 50) {
      this.showTrashTimerId = setTimeout(
        () => self.setState({ showTopTrash: true }),
        SHOW_TRASH_DELAY,
      );
    } else {
      this.showTrashTimerId = setTimeout(
        () => self.setState({ showBottomTrash: true }),
        SHOW_TRASH_DELAY,
      );
    }
    this.isRotate = true;
    this.shortClickTimerId = setTimeout(
      () => self.afterRotateDelay(),
      SHORT_CLICK_DELAY,
    );
    const pointersCopy = R.clone(pointers);
    const imageContainerRect = this.imageContainerRef.getBoundingClientRect();
    const dx = clientX - imageContainerRect.x;
    const dy = clientY - imageContainerRect.y;
    const newX = dx / imageContainerRect.width * 100;
    const newY = dy / imageContainerRect.height * 100;
    pointersCopy[index].dx = newX - pointersCopy[index].x;
    pointersCopy[index].dy = newY - pointersCopy[index].y;
    updatePointers(pointersCopy);
    this.setState({ movingPointerIndex: index });
  };

  render() {
    const {
      editable, routePhoto, pointers, hide, onImageLoad, routeImageLoading,
    } = this.props;
    const {
      topTrashActive, bottomTrashActive, showTopTrash, showBottomTrash,
    } = this.state;
    const mapIndexed = R.addIndex(R.map);
    return (
      <RouteContext.Consumer>
        {
          ({ route }) => (
            <div
              className={
                css(
                  styles.modalBlockM,
                  styles.modalBlockMDark,
                  styles.modalBlockMImageContainer,
                )
              }
            >
              <div
                className={
                  css(
                    styles.modalBlockMInner,
                    styles.modalBlockMImageContainerInner,
                  )
                }
              >
                <Trash
                  setRef={(ref) => {
                    this.topTrashRef = ref;
                  }}
                  visible={showTopTrash}
                  active={topTrashActive}
                />
                <Trash
                  setRef={(ref) => {
                    this.bottomTrashRef = ref;
                  }}
                  visible={showBottomTrash}
                  active={bottomTrashActive}
                  bottom
                />
                <div className={css(styles.modalBlockMContainer, styles.modalBlockMFixedTop)}>
                  <div className={css(styles.modalBlockMHeader)}>
                    <div className={css(styles.modalBlockMHeaderBtn)}>
                      <CloseButton onClick={hide} light />
                    </div>
                  </div>
                </div>
                <div className={css(styles.routeEditor)}>
                  <div
                    role="button"
                    tabIndex="0"
                    className={css(styles.routeEditorImgContainer)}
                    ref={(ref) => {
                      this.imageContainerRef = ref;
                      return true;
                    }}
                    onTouchStart={editable ? this.onTouchStart : null}
                    onTouchEnd={editable ? this.onTouchEnd : null}
                    onTouchMove={editable ? this.onTouchMove : null}
                    onContextMenu={this.onContextMenu}
                    style={{
                      touchAction: editable ? 'none' : 'auto',
                      outline: 'none'
                    }}
                  >
                    <img
                      className={css(styles.routeEditorImg)}
                      src={routePhoto}
                      alt={route.name}
                      onLoad={onImageLoad}
                      style={{ visibility: routeImageLoading ? 'hidden' : 'visible' }}
                    />
                    {
                      !routeImageLoading && (
                        <>
                          {
                            mapIndexed((pointer, index) => (
                              <Marker
                                key={index}
                                pointerType={getPointerType(editable, index, pointer)}
                                editable={editable}
                                removePointer={editable ? (() => this.removePointer(index)) : null}
                                onStartMoving={
                                  editable
                                    ? ((x, y) => this.onStartMoving(index, x, y))
                                    : null
                                }
                                angle={pointer.angle}
                                radius={MARKER_RADIUS}
                                dx={pointer.dx}
                                dy={pointer.dy}
                                left={pointer.x}
                                top={pointer.y}
                              />
                            ), pointers)}
                        </>
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </RouteContext.Consumer>
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
  modalBlockMImageContainer: {
    width: '100%',
    height: '100vh',
    paddingBottom: 0,
    overflow: 'hidden',
  },
  modalBlockMInner: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    paddingBottom: '50px',
    boxSizing: 'border-box',
  },
  modalBlockMImageContainerInner: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    paddingBottom: 0,
    overflow: 'hidden',
  },
  modalBlockMContainer: {
    paddingLeft: '24px',
    paddingRight: '24px',
    width: '100%',
    boxSizing: 'border-box',
  },
  modalBlockMFixedTop: {
    position: 'fixed',
    zIndex: 20,
    left: 0,
    top: 0,
    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.425) 55%, rgba(0, 0, 0, 0) 100%)'
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
  routeEditor: {
    overflow: 'hidden',
    height: '100%',
  },
  routeEditorImgContainer: {
    height: '100%',
    display: 'inline-block',
    transform: 'translateX(-50%)',
    left: '50%',
    position: 'relative',
  },
  routeEditorImg: { height: '100%' }
});

RouteEditor.propTypes = {
  routeImageLoading: PropTypes.bool,
  updatePointers: PropTypes.func,
  routePhoto: PropTypes.string.isRequired,
  pointers: PropTypes.array.isRequired,
  editable: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
  onImageLoad: PropTypes.func.isRequired,
};

RouteEditor.defaultProps = {
  updatePointers: null,
  routeImageLoading: false,
};
