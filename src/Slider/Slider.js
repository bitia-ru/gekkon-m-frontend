import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import arrowImage from '../../img/info-block-img/arrow.svg';
import './Slider.css';

export default class Slider extends Component {
  onClick = () => {
    const { sectorId, sectors, changeSectorFilter } = this.props;
    const index = R.findIndex(R.propEq('id', sectorId))(sectors) + 1;
    if (index < sectors.length) {
      changeSectorFilter(sectors[index].id);
    } else {
      changeSectorFilter(0);
    }
  };

  render() {
    return (
      <button type="button" className="header-m__items-container-button" onClick={this.onClick}>
        <span className="header-m__info-icon">
          <svg aria-hidden="true">
            <use xlinkHref={`${arrowImage}#arrow`} />
          </svg>
        </span>
      </button>
    );
  }
}

Slider.propTypes = {
  sectors: PropTypes.array.isRequired,
  changeSectorFilter: PropTypes.func.isRequired,
  sectorId: PropTypes.number.isRequired,
};
