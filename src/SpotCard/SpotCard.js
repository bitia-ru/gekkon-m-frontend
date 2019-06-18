import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './SpotCard.css';

const SpotCard = ({
  spot,
}) => (
  <div className="climbing-card-m__col-xs-12 climbing-card-m__col-sm-6">
    <article className={`climbing-card-m ${spot.className}`}>
      <Link to={`/spots/${spot.id}`} className="climbing-card-m__inner">
        <h1 className="climbing-card-m__header">
          {spot.name}
        </h1>
        <img src={spot.imgSrc} alt="" className="climbing-card-m__img" />
      </Link>
    </article>
  </div>
);

SpotCard.propTypes = {
  spot: PropTypes.object.isRequired,
};

export default SpotCard;
