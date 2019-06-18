import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Marker from '../Marker/Marker';
import { MARKER_RADIUS } from '../Constants/Marker';
import {
  PERCENT_THRESHOLD,
  MARKER_DISPLAY_SHIFT,
  MARKER_SEARCH_RADIUS,
} from '../Constants/Route';
import Trash from '../Trash/Trash';
import CloseButton from '../CloseButton/CloseButton';
import './RouteEditor.css';

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
    this.timerId = null;
    this.topTrashRef = null;
    this.bottomTrashRef = null;
    this.isShifted = false;
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
      if (!this.isShifted) {
        const { dx } = pointers[movingPointerIndex];
        const { dy } = pointers[movingPointerIndex];
        if (((dx ** 2) + (dy ** 2)) ** 0.5 > PERCENT_THRESHOLD ** 2) {
          this.isShifted = true;
          this.shift = MARKER_DISPLAY_SHIFT;
        }
      }
      const dx = clientX - imageContainerRect.x;
      const dy = clientY - imageContainerRect.y;
      const { angle } = pointersCopy[movingPointerIndex];
      const newX = dx / imageContainerRect.width * 100 - this.shift - this.getXShift(angle);
      const newY = dy / imageContainerRect.height * 100 - this.shift - this.getYShift(angle);
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
      const { clientX, clientY } = event.changedTouches[0];
      const isOverTopTrash = this.touchIsOver(this.topTrashRef, clientX, clientY);
      const isOverBottomTrash = this.touchIsOver(this.bottomTrashRef, clientX, clientY);
      if (isOverTopTrash || isOverBottomTrash) {
        this.removePointer(movingPointerIndex);
      } else if (!this.isShifted) {
        this.rotate(movingPointerIndex);
        this.setState({ movingPointerIndex: null });
      } else {
        const pointersCopy = R.clone(pointers);
        const dx = clientX - imageContainerRect.x;
        const dy = clientY - imageContainerRect.y;
        const { angle } = pointersCopy[movingPointerIndex];
        const newX = dx / imageContainerRect.width * 100 - this.shift - this.getXShift(angle);
        const newY = dy / imageContainerRect.height * 100 - this.shift - this.getYShift(angle);
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
      this.isShifted = false;
      this.shift = 0;
      clearTimeout(this.timerId);
      this.setState({
        showTopTrash: false,
        showBottomTrash: false,
        topTrashActive: false,
        bottomTrashActive: false,
      });
    } else {
      const clientX = event.changedTouches[0].clientX / imageContainerRect.width * 100;
      const clientY = event.changedTouches[0].clientY / imageContainerRect.height * 100;
      let dx = clientX - this.clientX;
      let dy = clientY - this.clientY;
      if (((dx ** 2) + (dy ** 2)) ** 0.5 <= PERCENT_THRESHOLD ** 2) {
        dx = clientX - imageContainerRect.x / imageContainerRect.width * 100;
        dy = clientY - imageContainerRect.y / imageContainerRect.height * 100;
        const xPosition = dx + MARKER_RADIUS / imageContainerRect.width * 100;
        const yPosition = dy - MARKER_RADIUS / imageContainerRect.height * 100;
        this.addPointer(xPosition, yPosition);
      }
    }
  };

  removePointer = (index) => {
    const { pointers, updatePointers } = this.props;
    updatePointers(R.remove(index, 1, pointers));
  };

  onContextMenu = (event) => {
    event.preventDefault();
  };

  onStartMoving = (index, clientX, clientY) => {
    const { pointers, updatePointers } = this.props;
    this.isMoving = true;
    const self = this;
    if (pointers[index].y > 50) {
      this.timerId = setTimeout(() => self.setState({ showTopTrash: true }), 1000);
    } else {
      this.timerId = setTimeout(() => self.setState({ showBottomTrash: true }), 1000);
    }
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
      editable, route, routePhoto, pointers, hide,
    } = this.props;
    const {
      topTrashActive, bottomTrashActive, showTopTrash, showBottomTrash,
    } = this.state;
    const mapIndexed = R.addIndex(R.map);
    return (
      <div className="modal-block-m modal-block-m_dark modal-block-m__image-container">
        <div className="modal-block-m__inner modal-block-m__image-container-inner">
          <Trash
            setRef={(ref) => { this.topTrashRef = ref; return true; }}
            visible={showTopTrash}
            active={topTrashActive}
          />
          <Trash
            setRef={(ref) => { this.bottomTrashRef = ref; return true; }}
            visible={showBottomTrash}
            active={bottomTrashActive}
            bottom
          />
          <div className="modal-block-m__container modal-block-m__fixed-top">
            <div className="modal-block-m__header">
              <div className="modal-block-m__header-btn">
                <CloseButton onClick={hide} light />
              </div>
            </div>
          </div>
          <div
            role="button"
            tabIndex="0"
            className="modal-block-m__image-wrapper"
            ref={(ref) => { this.imageContainerRef = ref; return true; }}
            onTouchStart={editable ? this.onTouchStart : null}
            onTouchEnd={editable ? this.onTouchEnd : null}
            onTouchMove={editable ? this.onTouchMove : null}
            onContextMenu={this.onContextMenu}
            style={{ touchAction: editable ? 'none' : 'auto' }}
          >
            <img
              className="modal-block-m__image-track"
              src={routePhoto}
              alt={route.name}
            />
            {mapIndexed((pointer, index) => (
              <Marker
                key={index}
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
          </div>
        </div>
      </div>
    );
  }
}

RouteEditor.propTypes = {
  updatePointers: PropTypes.func,
  routePhoto: PropTypes.string.isRequired,
  route: PropTypes.object.isRequired,
  pointers: PropTypes.array.isRequired,
  editable: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
};

RouteEditor.defaultProps = {
  updatePointers: null,
};
