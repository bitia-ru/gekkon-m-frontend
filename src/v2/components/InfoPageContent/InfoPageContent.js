import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '../../aphrodite';

const InfoPageContent = ({ titles, data }) => {
  const mapIndexed = R.addIndex(R.map);
  return (
    <div className={css(styles.contentM, styles.contentMWhite)}>
      <div className={css(styles.contentMContainer)}>
        {
          mapIndexed(
            (paragraphs, index) => (
              <React.Fragment key={index}>
                <h1 className={css(styles.contentMHeader)}>{titles[index]}</h1>
                {
                  mapIndexed(
                    (paragraph, i) => (
                      <p key={i} className={css(styles.contentMText)}>
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

const styles = StyleSheet.create({
  contentM: {
    paddingTop: '68px',
    paddingBottom: '68px',
    backgroundСolor: '#FAFAFA',
  },
  contentMContainer: {
    maxWidth: '1600px',
    paddingLeft: '24px',
    paddingRight: '24px',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  contentMHeader: {
    fontSize: '24px',
    fontFamily: 'GilroyMedium, sans-serif',
    lineHeight: '32px',
    marginTop: 0,
    marginBottom: '36px',
  },
  contentMText: {
    fontSize: '16px',
    fontFamily: 'GilroyRegular, sans-serif',
    lineHeight: '24px',
    color: '#3F3F3F',
    marginBottom: '24px',
  },
  contentMWhite: {
    backgroundColor: '#ffffff',
  },
});

InfoPageContent.propTypes = {
  titles: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};

export default InfoPageContent;
