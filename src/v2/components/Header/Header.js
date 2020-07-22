import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import InfoBlock from '@/v1/components/InfoBlock/InfoBlock';
import Slider from '@/v1/components/Slider/Slider';
import getArrayByIds from '@/v1/utils/getArrayByIds';
import SectorContext from '@/v1/contexts/SectorContext';
import SpotContext from '@/v1/contexts/SpotContext';
import './Header.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bgImageLoaded: false,
    };
    this.photosInternal = {};
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.data.photo) {
      return;
    }
    if (this.photosInternal[newProps.data.photo.url] !== undefined) {
      return;
    }
    this.setState({ bgImageLoaded: false });
    this.photosInternal[newProps.data.photo.url] = new Image();
    this.photosInternal[newProps.data.photo.url].onload = () => (
      this.setState({ bgImageLoaded: true })
    );
    this.photosInternal[newProps.data.photo.url].src = newProps.data.photo.url;
  }

  onSliderClick = (sectorId, currentSectors) => {
    const { changeSectorFilter } = this.props;
    const index = R.findIndex(R.propEq('id', sectorId))(currentSectors) + 1;
    if (index < currentSectors.length) {
      changeSectorFilter(currentSectors[index].id);
    } else {
      changeSectorFilter(0);
    }
  };

  render() {
    const {
      data, spots, sectors,
    } = this.props;
    const { bgImageLoaded } = this.state;
    return (
      <SpotContext.Consumer>
        {
          ({ spot }) => {
            const sectorIds = spot ? R.map(s => s.id)(spots[spot.id].sectors) : [];
            const currentSectors = getArrayByIds(sectorIds, sectors);
            return (
              <SectorContext.Consumer>
                {
                  ({ sector }) => (
                    <header className="header-m">
                      <div
                        className="header-m__items-container"
                        style={
                          (data.photo && bgImageLoaded)
                            ? { backgroundImage: `url(${this.photosInternal[data.photo.url].src})` }
                            : {}
                        }
                      >
                        <h1 className="header-m__header">{data.name}</h1>
                        <p className="header-m__descr">{data.description}</p>
                        <InfoBlock infoData={data.infoData} />
                      </div>
                      <Slider
                        onClick={() => this.onSliderClick(
                          sector ? sector.id : 0, currentSectors,
                        )}
                      />
                    </header>
                  )
                }
              </SectorContext.Consumer>
            );
          }
        }
      </SpotContext.Consumer>
    );
  }
}

Header.propTypes = {
  data: PropTypes.object.isRequired,
  changeSectorFilter: PropTypes.func.isRequired,
  sectors: PropTypes.object.isRequired,
  spots: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  sectors: state.sectorsStore.sectors,
  spots: state.spotsStoreV2.spots,
});

export default withRouter(connect(mapStateToProps)(Header));
