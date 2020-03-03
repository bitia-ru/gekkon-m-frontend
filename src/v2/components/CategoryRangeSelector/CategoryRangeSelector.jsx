import React from 'react';
import PropTypes from 'prop-types';
import Category from '@/v1/components/Category/Category';
import { CATEGORIES_ITEMS, getCategoryColor } from '@/v1/Constants/Categories';
import { css, StyleSheet } from '@/v2/aphrodite';
import DropDownList from '@/v1/components/DropDownList/DropDownList';

class CategoryRangeSelector extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };
  }

  render() {
    const { expanded } = this.state;
    const { categoryFrom, categoryTo, onChangeCategoryFilter } = this.props;
    return (
      <>
        <div className="field-select-m__container">
          <div
            role="button"
            className="field-select-m__select field-select-m__select_active"
            onClick={() => this.setState({ expanded: true })}
            tabIndex="0"
            style={{ outline: 'none' }}
          >
            <span className="field-select-m__placeholder">От</span>
            <Category category={categoryFrom} color={getCategoryColor(categoryFrom)} />
            <span className="field-select-m__placeholder">до</span>
            <Category category={categoryTo} color={getCategoryColor(categoryTo)} />
          </div>
        </div>
        {
          expanded
            ? (
              <DropDownList
                hide={() => this.setState({ expanded: false })}
                onClick={onChangeCategoryFilter}
                items={CATEGORIES_ITEMS}
                textFieldName="title"
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

CategoryRangeSelector.propTypes = {
  categoryFrom: PropTypes.string,
  categoryTo: PropTypes.string,
  onChangeCategoryFilter: PropTypes.func,
};

export default CategoryRangeSelector;
