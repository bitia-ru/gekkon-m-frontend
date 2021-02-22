import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Marker from '@/v1/components/Marker/Marker';
import MARKER_RADIUS from '@/v1/Constants/Marker';
import RouteContext from '@/v1/contexts/RouteContext';
import { getPointerType } from '@/v1/components/Marker/utils';
import { css, StyleSheet } from '@/v2/aphrodite';

export default class RouteView extends Component {
  onContextMenu = (event) => {
    event.preventDefault();
  };

  render() {
    const {
      routePhoto, pointers, onClick, onImageLoad, routeImageLoading,
    } = this.props;
    const mapIndexed = R.addIndex(R.map);
    return (
      <RouteContext.Consumer>
        {
          ({ route }) => (
            <div className={css(styles.routeMRouteImageWrapper)}>
              <div className={css(styles.routeEditor)}>
                <div
                  role="button"
                  tabIndex="0"
                  style={{ outline: 'none' }}
                  className={css(styles.routeEditorImgContainer)}
                  onContextMenu={this.onContextMenu}
                  onClick={onClick}
                >
                  <img
                    className={css(styles.routeEditorImg)}
                    src={routePhoto}
                    alt={route.name}
                    onLoad={onImageLoad}
                    style={{ visibility: routeImageLoading ? 'hidden' : 'visible' }}
                  />
                  {
                    !routeImageLoading
                      ? (
                        <>
                          {
                            mapIndexed((pointer, index) => (
                              <Marker
                                key={index}
                                editable={false}
                                angle={pointer.angle}
                                radius={MARKER_RADIUS}
                                pointerType={getPointerType(false, index, pointer)}
                                dx={pointer.dx}
                                dy={pointer.dy}
                                left={pointer.x}
                                top={pointer.y}
                              />
                            ), pointers)
                          }
                        </>
                      )
                      : ''
                  }
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
  routeMRouteImageWrapper: {
    position: 'relative',
    zIndex: 2,
    height: '100%',
    overflow: 'hidden',
    transform: 'translateX(-50%)',
    left: '50%',
    display: 'inline-block',
    '> img': {
      height: '100%',
      width: 'auto',
      zIndex: 2,
    },
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
  routeEditorImg: { height: '100%' },
});

RouteView.propTypes = {
  routeImageLoading: PropTypes.bool,
  onClick: PropTypes.func,
  routePhoto: PropTypes.string.isRequired,
  pointers: PropTypes.array.isRequired,
  onImageLoad: PropTypes.func.isRequired,
};

RouteView.defaultProps = {
  onClick: null,
  routeImageLoading: false,
};
