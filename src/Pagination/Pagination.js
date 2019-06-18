import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import './Pagination.css';

const Pagination = ({
  page, firstPage, lastPage, pagesList, onPageChange,
}) => (
  <div className="content-m__pagination">
    <div className="pagination-m">
      <div
        role="button"
        tabIndex="0"
        style={{ outline: 'none' }}
        className="pagination-m__item pagination-m__toggle pagination-m__toggle-prev"
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
            `pagination-m__item${currentPage === page ? ' pagination-m__item_active' : ''}`
          }
        >
          {currentPage}
        </div>
      ), pagesList)}
      <div
        role="button"
        tabIndex="0"
        style={{ outline: 'none' }}
        className="pagination-m__item pagination-m__toggle pagination-m__toggle-next"
        onClick={() => onPageChange(lastPage)}
      />
    </div>
  </div>
);

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  firstPage: PropTypes.number.isRequired,
  lastPage: PropTypes.number.isRequired,
  pagesList: PropTypes.array.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
