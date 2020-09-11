import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import InfoBlock from '@/v2/components/InfoBlock/InfoBlock';
import Slider from '@/v2/components/Slider/Slider';
import getArrayByIds from '@/v1/utils/getArrayByIds';
import SectorContext from '@/v1/contexts/SectorContext';
import SpotContext from '@/v1/contexts/SpotContext';
import { StyleSheet, css } from '../../aphrodite';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bgImageLoaded: false,
    };
    this.photosInternal = {};
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

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(newProps) {
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
                    <header className={css(styles.headerM)}>
                      <div
                        className={css(styles.headerMItemsContainer)}
                        style={
                          (data.photo && bgImageLoaded)
                            ? { backgroundImage: `url(${this.photosInternal[data.photo.url].src})` }
                            : {}
                        }
                      >
                        <h1 className={css(styles.headerMHeader)}>{data.name}</h1>
                        <p className={css(styles.headerMDescr)}>{data.description}</p>
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
  headerMItemsContainer: {
    paddingTop: '134px',
    paddingLeft: '24px',
    paddingRight: '24px',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  headerMHeader: {
    fontFamily: 'GilroyBold',
    fontSize: '36px',
    lineHeight: '44px',
    marginBottom: '24px',
    marginTop: 0,
    color: '#ffffff',
  },
  headerMDescr: {
    marginBottom: '28px',
    color: '#ffffff',
  },
});

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
