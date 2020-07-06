import React from 'react';
import PropTypes from 'prop-types';
import { css, StyleSheet } from '@/v2/aphrodite';
import DropDownPersonList from '@/v1/components/DropDownPersonList/DropDownPersonList';

class DropDownPersonListSelector extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };
  }

  render() {
    const { expanded } = this.state;
    const {
      name, users, onChange, fieldSelectClass,
    } = this.props;
    return (
      <>
        <div className="route-m__field-select">
          <button
            type="button"
            onClick={() => this.setState({ expanded: true })}
            className={fieldSelectClass}
          >
            {name === null ? 'Неизвестен' : name}
          </button>
        </div>
        {
          expanded
            ? (
              <DropDownPersonList
                hide={() => this.setState({ expanded: false })}
                onClick={onChange}
                users={users}
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

DropDownPersonListSelector.propTypes = {
  name: PropTypes.string,
  users: PropTypes.array,
  onChange: PropTypes.func,
  fieldSelectClass: PropTypes.string,
};

export default DropDownPersonListSelector;