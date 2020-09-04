import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { StyleSheet, css } from '../../aphrodite';

const Pagination = ({
  page, firstPage, lastPage, pagesList, onPageChange,
}) => (
  <div className={css(styles.contentMPagination)}>
    {
      pagesList.length > 1 && (
        <div className={css(styles.paginationM)}>
          <div
            role="button"
            tabIndex="0"
            style={{ outline: 'none' }}
            className={
              css(
                styles.paginationMItem,
                styles.paginationMToggle,
                styles.paginationMTogglePrev,
              )
            }
            onClick={() => onPageChange(firstPage)}
          />
          {R.map(currentPage => (
            <div
              key={currentPage}
              role="button"
              tabIndex="0"
              style={{ outline: 'none' }}
              onClick={() => onPageChange(currentPage)}
              className={
                css(
                  styles.paginationMItem,
                  currentPage === page && styles.paginationMItemActive,
                )
              }
            >
              {currentPage}
            </div>
          ), pagesList)}
          <div
            role="button"
            tabIndex="0"
            style={{ outline: 'none' }}
            className={
              css(
                styles.paginationMItem,
                styles.paginationMToggle,
                styles.paginationMToggleNext,
              )
            }
            onClick={() => onPageChange(lastPage)}
          />
        </div>
      )
    }
  </div>
);

const styles = StyleSheet.create({
  contentMPagination: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'center',
  },
  paginationM: { display: 'flex' },
  paginationMItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    color: '#1A1A1A',
    width: '36px',
    height: '36px',
    padding: '5px',
    boxSizing: 'border-box',
    transition: 'color, background-color .4s ease-out',
    marginLeft: '4px',
    marginRight: '4px',
    flexShrink: 0,
    ':hover': { backgroundColor: '#E6EBF2' },
    ':focus': { backgroundColor: '#E6EBF2' },
  },
  paginationMItemActive: {
    color: '#0871EC',
  },
  paginationMToggle: {
    position: 'relative',
    backgroundColor: '#ffffff',
    boxShadow: '0px 2px 15px rgba(0, 0, 0, 0.04)',
    ':before': {
      position: 'absolute',
      content: '\'\'',
      backgroundColor: '#1f1f1f',
      height: '1px',
      width: '8px',
    },
    ':after': {
      position: 'absolute',
      content: '\'\'',
      backgroundColor: '#1f1f1f',
      height: '1px',
      width: '8px',
    },
    ':hover': {
      backgroundColor: '#E6EBF2',
      ':before': { backgroundColor: '#006CEB' },
      ':after': { backgroundColor: '#006CEB' },
    },
    ':focus': { backgroundColor: '#E6EBF2' },
  },
  paginationMToggleNext: {
    marginLeft: 'auto',
    ':before': {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(45deg)',
      transformOrigin: 'right bottom',
    },
    ':after': {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(-45deg)',
      transformOrigin: 'right top',
    },
  },
  paginationMTogglePrev: {
    marginRight: 'auto',
    ':before': {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(-45deg)',
      transformOrigin: 'left bottom',
    },
    ':after': {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(45deg)',
      transformOrigin: 'left top',
    },
  },
});

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  firstPage: PropTypes.number.isRequired,
  lastPage: PropTypes.number.isRequired,
  pagesList: PropTypes.array.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
