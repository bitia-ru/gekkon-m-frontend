import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Marker.css';

export default class Marker extends Component {
    onTouchStart = (event) => {
      const { onStartMoving } = this.props;
      if (onStartMoving) {
        onStartMoving(event.touches[0].clientX, event.touches[0].clientY);
      }
    };

    onContextMenu = (event) => {
      event.preventDefault();
    };

    xShift = () => {
      const { radius, angle } = this.props;
      if (angle === 0 || angle === 90) {
        return radius;
      }
      return -radius;
    };

    yShift = () => {
      const { radius, angle } = this.props;
      if (angle === 90 || angle === 180) {
        return radius;
      }
      return -radius;
    };

    render() {
      const {
        editable, left, top, dx, dy, radius, angle, pointerType,
      } = this.props;
      return (
        <React.Fragment>
          <div
            className="marker"
            style={{
              left: `calc(${left + dx}% - ${radius - this.xShift()}px)`,
              top: `calc(${top + dy}% - ${radius - this.yShift()}px)`,
              zIndex: 100,
            }}
          >
            <img
              draggable={false}
              src={require(`./images/${pointerType}.svg`)}
              style={{
                touchAction: editable ? 'none' : 'auto',
                width: `${radius * 2}px`,
                height: `${radius * 2}px`,
                transform: `rotate(${angle}deg)`,
              }}
              onTouchStart={this.onTouchStart}
              onContextMenu={this.onContextMenu}
              alt=""
            />
          </div>
        </React.Fragment>
      );
    }
}

Marker.propTypes = {
  onStartMoving: PropTypes.func,
  editable: PropTypes.bool.isRequired,
  left: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  dx: PropTypes.number.isRequired,
  dy: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  angle: PropTypes.number.isRequired,
  pointerType: PropTypes.string,
};

Marker.defaultProps = {
  onStartMoving: null,
};
