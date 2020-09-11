import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import './InfoPageContent.css';

const InfoPageContent = ({ titles, data }) => {
  const mapIndexed = R.addIndex(R.map);
  return (
    <div className="content-m content-m_white">
      <div className="content-m__container">
        {
          mapIndexed(
            (paragraphs, index) => (
              <React.Fragment key={index}>
                <h1 className="content-m__header">{titles[index]}</h1>
                {
                  mapIndexed(
                    (paragraph, i) => (
                      <p key={i} className="content-m__text">
                        {paragraph}
                      </p>
                    ),
                    paragraphs,
                  )
                }
              </React.Fragment>
            ),
            data,
          )
        }
      </div>
    </div>
  );
};

InfoPageContent.propTypes = {
  titles: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};

export default InfoPageContent;
