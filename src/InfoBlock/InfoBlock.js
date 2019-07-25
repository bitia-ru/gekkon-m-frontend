import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import './InfoBlock.css';

const InfoBlock = ({
  infoData,
}) => {
  const mapIndexed = R.addIndex(R.map);
  return (
    <div className="header-m__info-block">
      {
        infoData && (
          <>
            {mapIndexed((el, index) => (
              <div key={index} className="header-m__info-item">
                <div className="header-m__info-item-number">
                  {el.count}
                </div>
                <div className="header-m__info-item-descr">
                  {el.label}
                </div>
              </div>
            ), infoData)}
          </>
        )
      }
    </div>
  );
};

InfoBlock.propTypes = {
  infoData: PropTypes.array,
};

export default InfoBlock;
