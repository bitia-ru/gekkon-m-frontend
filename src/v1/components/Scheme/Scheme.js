import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import SchemePointer from '../SchemePointer/SchemePointer';
import SectorContext from '../../contexts/SectorContext';
import './Scheme.css';
import { routeCategoryToString } from '@/lib/routeHelpers';

class Scheme extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageIsLoading: true,
    };
  }

  render() {
    const { sectors, currentRoutes, onClick, pointerFactor, schemeFactor } = this.props;
    const { imageIsLoading } = this.state;

    return (
      <SectorContext.Consumer>
        {
          ({ sector }) => {
            const currentSector = (
              currentRoutes.length > 0
                ? sectors[currentRoutes[0].sector_id]
                : sector
            );
            const diagram = currentSector && currentSector.diagram && currentSector.diagram.url;
            return (
              <div className="map" style={{ transform: `scale(${schemeFactor})` }}>
                {
                  diagram && <>
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
                            category={routeCategoryToString(route)}
                            color={route.holds_color === null ? undefined : route.holds_color.color}
                            onClick={() => onClick(route.id)}
                            scaleValue={pointerFactor}
                          />
                        ),
                        currentRoutes,
                      )
                    }
                  </>
                }
              </div>
            );
          }
        }
      </SectorContext.Consumer>
    );
  }
}

Scheme.propTypes = {
  currentRoutes: PropTypes.array.isRequired,
  sectors: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  pointerFactor: PropTypes.number,
};

Scheme.defaultProps = {
  onClick: null,
  pointerFactor: 1,
};

const mapStateToProps = state => ({
  sectors: state.sectorsStore.sectors,
});

export default withRouter(connect(mapStateToProps)(Scheme));
