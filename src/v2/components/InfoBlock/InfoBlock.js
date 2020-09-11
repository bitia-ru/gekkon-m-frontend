import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '@/v2/aphrodite';

const InfoBlock = ({
  infoData,
}) => {
  const mapIndexed = R.addIndex(R.map);
  return (
    <div className={css(styles.headerMInfoBlock)}>
      {
        infoData && (
          <>
            {mapIndexed((el, index) => (
              <div key={index} className={css(styles.headerMInfoItem)}>
                <div className={css(styles.headerMInfoItemNumber)}>
                  {el.count}
                </div>
                <div className={css(styles.headerMInfoItemDescr)}>
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

const styles = StyleSheet.create({
  headerMInfoBlock: {
    marginBottom: '22px',
    marginTop: 'auto',
  },
  headerMInfoItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    background: 'rgba(13, 13, 13, 0.3)',
    color: '#ffffff',
    marginBottom: '16px',
  },
  headerMInfoItemNumber: {
    border: '1px solid rgba(255, 255, 255, 0.05)',
    fontSize: '20px',
    lineHeight: '18px',
    fontFamily: 'GilroyBold, sans-serif',
    width: '39px',
    height: '39px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerMInfoItemDescr: {
    fontSize: '14px',
    marginLeft: '12px',
  },
});

InfoBlock.propTypes = {
  infoData: PropTypes.array,
};

export default InfoBlock;
