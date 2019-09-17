import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import SchemePointer from '../SchemePointer/SchemePointer';
import './Scheme.css';

export default class Scheme extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageIsLoading: true,
    };
  }

  render() {
    const { diagram, routes, onClick } = this.props;
    const { imageIsLoading } = this.state;
    return (
      <>
        {
          diagram && <div className="map">
            <img
              onLoad={() => this.setState({ imageIsLoading: false })}
              style={{ visibility: imageIsLoading ? 'hidden' : 'visible' }}
              src={diagram}
              alt=""
              className="map__map-img"
            />
            {
              !imageIsLoading && R.map(
                route => (
                  route.data && route.data.position && <SchemePointer
                    key={route.id}
                    position={route.data.position}
                    category={route.category}
                    color={route.holds_color === null ? undefined : route.holds_color.color}
                    onClick={() => onClick(route.id)}
                  />
                ),
                routes,
              )
            }
          </div>
        }
      </>
    )
  }
}

Scheme.propTypes = {
  routes: PropTypes.array,
  diagram: PropTypes.string,
  onClick: PropTypes.func,
};

Scheme.defaultProps = {
  routes: [],
  onClick: null,
};
