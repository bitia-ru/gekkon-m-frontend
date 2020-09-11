import React from 'react';
import PropTypes from 'prop-types';
import './AddRouteButton.css';
import { StyleSheet, css } from '../../aphrodite';

const AddRouteButton = ({ onClick }) => (
  <div className={css(styles.contentMColSm6, styles.contentMColXs12)}>
    <a
      role="link"
      tabIndex="0"
      style={{ outline: 'none' }}
      onClick={onClick}
      className="card-m card-m__edit"
    >
      <span className="card-m__edit-icon" />
      <span className="card-m__edit-title">Добавить новую трассу</span>
    </a>
  </div>
);

const styles = StyleSheet.create({
  contentMColXs12: {
    width: '100%',
    maxWidth: '100%',
  },
  contentMColSm6: {
    '@media screen and (mix-width: 720px)': {
      width: 'calc(50% - 24px)',
      maxWidth: '50%',
      marginLeft: '12px',
      marginRight: '12px',
    },
  },
});

AddRouteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default AddRouteButton;
