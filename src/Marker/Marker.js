import React, { Component } from 'react';
import PropTypes from 'prop-types';
import markerImage from '../../img/marker-img/hold-mark.png';
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

    render() {
      const {
        editable, left, top, dx, dy, radius, angle,
      } = this.props;
      return (
        <React.Fragment>
          <div
            className="marker"
            style={{
              left: `calc(${left + dx}% - ${radius}px)`,
              top: `calc(${top + dy}% - ${radius}px)`,
              zIndex: 100,
            }}
          >
            <img
              draggable={false}
              src={markerImage}
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
};

Marker.defaultProps = {
  onStartMoving: null,
};
