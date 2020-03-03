import React from 'react';
import PropTypes from 'prop-types';
import Category from '@/v1/components/Category/Category';
import { getCategoryColor } from '@/v1/Constants/Categories';
import { css, StyleSheet } from '@/v2/aphrodite';
import CategorySlider from '@/v1/components/CategorySlider/CategorySlider';

class CategorySelector extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };
  }

  render() {
    const { expanded } = this.state;
    const { category, onChangeCategory } = this.props;
    return (
      <>
        <div className="route-m__table-item route-m__table-item-right">
          <Category
            category={category}
            color={getCategoryColor(category)}
            onClick={() => this.setState({ expanded: true })}
          />
        </div>
        {
          expanded
            ? (
              <CategorySlider
                category={category}
                hide={() => this.setState({ expanded: false })}
                changeCategory={onChangeCategory}
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

CategorySelector.propTypes = {
  category: PropTypes.string,
  onChangeCategory: PropTypes.func,
};

export default CategorySelector;
