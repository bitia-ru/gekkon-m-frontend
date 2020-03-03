import React from 'react';
import PropTypes from 'prop-types';
import DropDownList from '@/v1/components/DropDownList/DropDownList';
import { css, StyleSheet } from '@/v2/aphrodite';

class DropDownListSelector extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };
  }

  render() {
    const { expanded } = this.state;
    const {
      fieldSelectClass, value, items, onChange,
    } = this.props;
    return (
      <>
        <div
          role="button"
          tabIndex="0"
          style={{ outline: 'none' }}
          onClick={() => this.setState({ expanded: true })}
          className={fieldSelectClass}
        >
          {value}
        </div>
        {
          expanded
            ? (
              <DropDownList
                hide={() => this.setState({ expanded: false })}
                onClick={onChange}
                items={items}
                textFieldName="text"
              />
            )
            : ''
        }
      </>
    );
  }
}

const style = StyleSheet.create({
});

DropDownListSelector.propTypes = {
  value: PropTypes.string,
  items: PropTypes.array,
  onChange: PropTypes.func,
  fieldSelectClass: PropTypes.string,
};

export default DropDownListSelector;
