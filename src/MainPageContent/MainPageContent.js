import React from 'react';
import * as R from 'ramda';
import SpotCard from '../SpotCard/SpotCard';
import './MainPageContent.css';

const MainPageContent = ({ spots }) => (
  <div className="section-climbing-m">
    <div className="section-climbing-m__container">
      <h1 className="section-climbing-m__header"> Скалодромы </h1>
      <div className="climbing-card-m__container-inner">
        {R.map(spot => <SpotCard key={spot.id} spot={spot} />, spots)}
      </div>
    </div>
  </div>
);

export default MainPageContent;
