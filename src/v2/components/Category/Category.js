import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '@/v2/aphrodite';

const Category = ({
  category, size, position, onClick, color,
}) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    className={
      css(
        styles.level,
        size !== undefined && (
          { small: styles.levelSmall, big: styles.levelBig, large: styles.levelLarge }[size]
        ),
      )
    }
    style={{ borderColor: color, outline: 'none' }}
  >
    {category}
  </div>
);

const styles = StyleSheet.create({
  level: {
    fontSize: '14px',
    lineHeight: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'GilroyBold, sans-serif',
    color: '#1f1f1f',
    width: '46px',
    height: '24px',
    paddingTop: '2px',
    boxSizing: 'border-box',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    border: '4px solid transparent',
  },
  levelSmall: {
    fontSize: '10px',
    lineHeight: '8px',
    width: '26px',
    height: '19px',
    border: '3px solid transparent',
  },
  levelBig: {
    fontSize: '16px',
    height: '28px',
  },
  levelLarge: {
    width: '74px',
    height: '44px',
    fontSize: '24px',
  },
});

Category.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
  position: PropTypes.string,
  onClick: PropTypes.func,
  category: PropTypes.string.isRequired,
};

Category.defaultProps = {
  onClick: null,
  color: '#ffffff',
};

export default Category;
