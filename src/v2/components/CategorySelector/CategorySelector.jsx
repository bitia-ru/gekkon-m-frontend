import React from 'react';
import PropTypes from 'prop-types';
import Category from '@/v2/components/Category/Category';
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
        <div className={css(styles.routeMTableItem, styles.routeMTableItemRight)}>
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

const styles = StyleSheet.create({
  routeMTableItem: {
    width: '50%',
    fontSize: '14px',
  },
  routeMTableItemRight: {
    paddingLeft: '20px',
    boxSizing: 'border-box',
  },
});

CategorySelector.propTypes = {
  category: PropTypes.string,
  onChangeCategory: PropTypes.func,
};

export default CategorySelector;
