import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '../../aphrodite';

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
      image, title,
    } = this.props;
    const { bgImageLoaded } = this.state;
    return (
      <header
        className={css(styles.headerM)}
        style={bgImageLoaded ? { backgroundImage: `url(${image})` } : {}}
      >
        <div className={css(styles.headerMAbout)}>
          <h1 className={css(styles.headerMHeader)}>{title}</h1>
        </div>
      </header>
    );
  }
}

const styles = StyleSheet.create({
  headerM: {
    backgroundColor: '#F2F1EB',
    width: '100%',
    minHeight: '602px',
    maxWidth: '100%',
    position: 'relative',
    fontFamily: 'GilroyRegular, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  },
  headerMHeader: {
    fontFamily: 'GilroyBold',
    fontSize: '36px',
    lineHeight: '44px',
    marginBottom: '24px',
    marginTop: 0,
    color: '#ffffff',
  },
  headerMAbout: {
    width: '100%',
    paddingTop: '174px',
    paddingLeft: '24px',
    paddingRight: '24px',
    boxSizing: 'border-box',
  },
});

InfoPageHeader.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
