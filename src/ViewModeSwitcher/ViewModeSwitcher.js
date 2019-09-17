import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import ModeButton from '../ModeButton/ModeButton';
import './ViewModeSwitcher.css';

const ViewModeSwitcher = ({
  viewMode, onViewModeChange, viewModeData,
}) => (
  <div className="content-m__toggle">
    {
      R.map(
        (e) => {
          const name = e[0];
          return (<ModeButton
            key={name}
            mode={name}
            title={viewModeData[name] && viewModeData[name].title}
            disabled={viewModeData[name] && viewModeData[name].disabled}
            onClick={() => onViewModeChange(name)}
            active={viewMode === name}
          />);
        },
        R.toPairs(viewModeData),
      )
    }
  </div>
);

ViewModeSwitcher.propTypes = {
  viewModeData: PropTypes.object,
  viewMode: PropTypes.string.isRequired,
  onViewModeChange: PropTypes.func.isRequired,
};

ViewModeSwitcher.defaultProps = {
  viewModeData: {},
};

export default ViewModeSwitcher;
