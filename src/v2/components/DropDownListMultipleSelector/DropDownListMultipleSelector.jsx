import React from 'react';
import PropTypes from 'prop-types';
import DropDownList from '@/v1/components/DropDownList/DropDownList';
import { css, StyleSheet } from '@/v2/aphrodite';

class DropDownListMultipleSelector extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };
  }

  render() {
    const { expanded } = this.state;
    const {
      value, items, save, setDefault,
    } = this.props;
    return (
      <>
        <div className="field-select-m__container">
          <div
            role="button"
            tabIndex="0"
            style={{ outline: 'none' }}
            onClick={() => this.setState({ expanded: true })}
            className="field-select-m__select"
          >
            {value}
          </div>
        </div>
        {
          expanded
            ? (
              <DropDownList
                hide={() => this.setState({ expanded: false })}
                save={save}
                setDefault={setDefault}
                items={items}
                textFieldName="text"
                multipleSelect
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

DropDownListMultipleSelector.propTypes = {
  value: PropTypes.string,
  items: PropTypes.array,
  save: PropTypes.func,
  setDefault: PropTypes.func,
};

export default DropDownListMultipleSelector;
