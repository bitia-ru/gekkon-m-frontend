import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import icons from '../../img/view-mode-switcher-sprite/toggle-direction-sprite.svg';
import './ModeButton.css';

const schemeIcon = `${icons}#toggle-map`;
const tableIcon = `${icons}#toggle-table`;
const listIcon = `${icons}#toggle-list`;

export default class ModeButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: false,
    };
  }

  render() {
    const {
      onClick, mode, active, disabled,
    } = this.props;
    const { focused } = this.state;
    const icon = () => {
      switch (mode) {
      case 'scheme':
        return schemeIcon;
      case 'table':
        return tableIcon;
      case 'list':
        return listIcon;
      default:
        return null;
      }
    };
    const buttonClassNames = classNames({
      'toggle-direction-m': true,
      'toggle-direction-m_active': active,
    });

    return (
      <button
        type="button"
        className={buttonClassNames}
        style={{ outline: 'none' }}
        onFocus={() => this.setState({ focused: true })}
        onBlur={() => this.setState({ focused: false })}
        onClick={disabled ? null : onClick}
      >
        <svg style={(!disabled && focused) ? { fill: '#006CEB' } : {}}>
          <use xlinkHref={icon()} />
        </svg>
      </button>
    );
  }
}

ModeButton.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  mode: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

ModeButton.defaultProps = {
  active: false,
  disabled: false,
};
