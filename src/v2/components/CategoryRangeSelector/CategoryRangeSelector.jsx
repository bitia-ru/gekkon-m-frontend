import React from 'react';
import PropTypes from 'prop-types';
import Category from '@/v2/components/Category/Category';
import { CATEGORIES_ITEMS, getCategoryColor } from '@/v1/Constants/Categories';
import { css, StyleSheet } from '@/v2/aphrodite';
import DropDownList from '@/v2/components/DropDownList/DropDownList';

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
        <div className={css(styles.fieldSelectMContainer)}>
          <div
            role="button"
            className={css(styles.fieldSelectMSelect)}
            onClick={() => this.setState({ expanded: true })}
            tabIndex="0"
            style={{ outline: 'none' }}
          >
            <span className={css(styles.fieldSelectMPlaceholder)}>От</span>
            <span className={css(styles.categoryWrapper)}>
              <Category category={categoryFrom} color={getCategoryColor(categoryFrom)} />
            </span>
            <span className={css(styles.fieldSelectMPlaceholder)}>до</span>
            <span className={css(styles.categoryWrapper)}>
              <Category category={categoryTo} color={getCategoryColor(categoryTo)} />
            </span>
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

const styles = StyleSheet.create({
  fieldSelectMContainer: { position: 'relative' },
  fieldSelectMSelect: {
    width: '100%',
    height: '54px',
    lineHeight: '1.3em',
    display: 'flex',
    alignItems: 'center',
    border: '2px solid #DDE2EF',
    borderRadius: 0,
    padding: '14px 40px 14px 20px',
    backgroundColor: '#ffffff',
    outline: 'none',
    transition: 'box-shadow .4s ease-out',
    fontFamily: 'GilroyRegular',
    fontSize: '14px',
    boxSizing: 'border-box',
    position: 'relative',
    maxWidth: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    ':before': {
      content: '\'\'',
      position: 'absolute',
      right: '20px',
      top: '50%',
      width: '14px',
      height: '9px',
      transform: 'translateY(-50%)',
      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2214%22%20height%3D%229%22%20viewBox%3D%220%200%2014%209%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20d%3D%22M7%209L0.0717972%20-1.30507e-06L13.9282%20-9.36995e-08L7%209Z%22%20fill%3D%22%231A1A1A%22/%3E%0A%3C/svg%3E%0A")',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% auto',
      pointerEvents: 'none',
      zIndex: 2,
    },
    ':after': {
      width: '45px',
      height: '100%',
      backgroundColor: '#ffffff',
      position: 'absolute',
      content: '\'\'',
      right: 0,
      top: 0,
      zIndex: 1,
    },
    ':focus': { boxShadow: '0px 0px 0px 2px rgba(0, 108, 235, 0.7)' },
  },
  fieldSelectMPlaceholder: { marginRight: '10px' },
  categoryWrapper: { marginRight: '20px' },
});

CategoryRangeSelector.propTypes = {
  categoryFrom: PropTypes.string,
  categoryTo: PropTypes.string,
  onChangeCategoryFilter: PropTypes.func,
};

export default CategoryRangeSelector;
