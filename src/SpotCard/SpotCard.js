import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './SpotCard.css';

const getColor = (spot) => {
  if (spot.data.brand && spot.data.brand.color) {
    return spot.data.brand.color
  } else {
    return 'gray';
  }
}

const SpotCard = ({
  spot,
}) => (
  <div className="climbing-card-m__col-xs-12 climbing-card-m__col-sm-6">
    <article
      className="climbing-card-m"
      style={{ backgroundColor: getColor(spot) }}
    >
      <Link to={`/spots/${spot.id}`} className="climbing-card-m__inner">
        <h1 className="climbing-card-m__header">
          {spot.name}
        </h1>
        {
          spot.photo && (
            <img src={spot.photo.url} alt="" className="climbing-card-m__img" />
          )
        }
      </Link>
    </article>
  </div>
);

SpotCard.propTypes = {
  spot: PropTypes.object.isRequired,
};

export default SpotCard;
