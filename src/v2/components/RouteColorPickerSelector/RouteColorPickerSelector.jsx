import React from 'react';
import PropTypes from 'prop-types';
import { css, StyleSheet } from '@/v2/aphrodite';
import getColorStyle from '@/v1/Constants/RouteColorPicker';
import RouteColorPicker from '@/v2/components/RouteColorPicker/RouteColorPicker';

class RouteColorPickerSelector extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };
  }

  render() {
    const { expanded } = this.state;
    const {
      fieldSelectClass, color, routeMarkColors, onChange,
    } = this.props;
    return (
      <>
        <div className="route-m__field-select">
          <button
            type="button"
            onClick={() => this.setState({ expanded: true })}
            className={fieldSelectClass}
          >
            <div className={css(styles.markColorPickerInfo)}>
              <div
                className={css(styles.markColorPickerColor)}
                style={getColorStyle(color)}
              />
            </div>
          </button>
        </div>
        {
          expanded
            ? (
              <RouteColorPicker
                hide={() => this.setState({ expanded: false })}
                routeMarkColors={routeMarkColors}
                onClick={onChange}
              />
            )
            : ''
        }
      </>
    );
  }
}

const styles = StyleSheet.create({
  markColorPickerInfo: { cursor: 'pointer' },
  markColorPickerColor: {
    display: 'inline-block',
    width: '60px',
    height: '20px',
    verticalAlign: 'middle',
    marginLeft: '15px',
  },
});

RouteColorPickerSelector.propTypes = {
  fieldSelectClass: PropTypes.string,
  color: PropTypes.object,
  routeMarkColors: PropTypes.array,
  onChange: PropTypes.func,
};

export default RouteColorPickerSelector;
