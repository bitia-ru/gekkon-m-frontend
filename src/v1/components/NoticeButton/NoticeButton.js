import React from 'react';
import PropTypes from 'prop-types';
import './NoticeButton.css';

const NoticeButton = ({ onClick }) => (
  <button type="button" className="notice" onClick={onClick} />
);

NoticeButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default NoticeButton;
