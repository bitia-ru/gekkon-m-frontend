import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import InfoBlock from '../InfoBlock/InfoBlock';
import MainNav from '../MainNav/MainNav';
import Logo from '../Logo/Logo';
import Slider from '../Slider/Slider';
import getArrayByIds from '../../v1/utils/getArrayByIds';
import SectorContext from '../contexts/SectorContext';
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

  onSliderClick = (sectorId) => {
    const { sectorIds, sectors, changeSectorFilter } = this.props;
    const currentSectors = getArrayByIds(sectorIds, sectors);
    const index = R.findIndex(R.propEq('id', sectorId))(currentSectors) + 1;
    if (index < currentSectors.length) {
      changeSectorFilter(currentSectors[index].id);
    } else {
      changeSectorFilter(0);
    }
  };

  render() {
    const {
      showMenu, data, infoData,
    } = this.props;
    const { bgImageLoaded } = this.state;
    return (
      <SectorContext.Consumer>
        {
          ({ sector }) => (
            <header className="header-m">
              <div className="header-m__top">
                <Logo />
                <MainNav showMenu={showMenu} />
              </div>
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
                <InfoBlock infoData={infoData} />
              </div>
              <Slider onClick={() => this.onSliderClick(sector ? sector.id : 0)} />
            </header>
          )
        }
      </SectorContext.Consumer>
    );
  }
}

Header.propTypes = {
  infoData: PropTypes.array,
  showMenu: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  changeSectorFilter: PropTypes.func.isRequired,
  sectors: PropTypes.object.isRequired,
  sectorIds: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  sectors: state.sectors,
  sectorIds: state.sectorIds,
});

export default withRouter(connect(mapStateToProps)(Header));
