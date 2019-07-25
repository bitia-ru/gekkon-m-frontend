import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfoBlock from '../InfoBlock/InfoBlock';
import MainNav from '../MainNav/MainNav';
import Logo from '../Logo/Logo';
import Slider from '../Slider/Slider';
import './Header.css';

export default class Header extends Component {
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

  render() {
    const {
      showMenu, data, infoData, changeSectorFilter, sectors, sectorId,
    } = this.props;
    const { bgImageLoaded } = this.state;

    return (
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
        <Slider
          changeSectorFilter={changeSectorFilter}
          sectors={sectors}
          sectorId={sectorId}
        />
      </header>
    );
  }
}

Header.propTypes = {
  infoData: PropTypes.array,
  showMenu: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  sectors: PropTypes.array.isRequired,
  changeSectorFilter: PropTypes.func.isRequired,
  sectorId: PropTypes.number.isRequired,
};
