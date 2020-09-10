import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MainNav from '../MainNav/MainNav';
import Logo from '../Logo/Logo';
import './InfoPageHeader.css';

export default class InfoPageHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bgImageLoaded: false,
    };
  }

  componentDidMount() {
    const { image } = this.props;
    const bgImg = new Image();
    bgImg.onload = () => this.setState({ bgImageLoaded: true });
    bgImg.src = image;
  }

  render() {
    const {
      showMenu, image, title,
    } = this.props;
    const { bgImageLoaded } = this.state;
    return (
      <header
        className="header-m"
        style={bgImageLoaded ? { backgroundImage: `url(${image})` } : {}}
      >
        <div className="header-m__top">
          <Logo />
          <MainNav showMenu={showMenu} />
        </div>
        <div className="header-m__about">
          <h1 className="header-m__header">{title}</h1>
        </div>
      </header>
    );
  }
}

InfoPageHeader.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  showMenu: PropTypes.func.isRequired,
};
