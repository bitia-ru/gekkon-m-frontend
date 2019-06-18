import React from 'react';
import * as R from 'ramda';
import SpotCard from '../SpotCard/SpotCard';
import SPOTS_DATA from '../Constants/Spots';
import './MainPageContent.css';

const MainPageContent = () => (
  <div className="section-climbing-m">
    <div className="section-climbing-m__container">
      <h1 className="section-climbing-m__header"> Скалодромы </h1>
      <div className="climbing-card-m__container-inner">
        {R.map(spot => <SpotCard key={spot.id} spot={spot} />, SPOTS_DATA)}
      </div>
    </div>
  </div>
);

export default MainPageContent;
