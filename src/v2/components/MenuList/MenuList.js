import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { StyleSheet, css } from '../../aphrodite';

const MenuList = ({
  textFieldName, items, onClick,
}) => {
  const mapIndexed = R.addIndex(R.map);
  return (
    <ul className={css(styles.mMenuList)}>
      {mapIndexed((item, index) => (
        <li
          key={index}
          style={{ listStyleType: 'none' }}
          className={css(styles.mMenuListItem)}
        >
          {
            item.separator
              ? ''
              : (
                <div
                  role="button"
                  tabIndex="0"
                  onClick={item.clickable ? (() => onClick(item.id)) : null}
                  className={css(styles.mMenuListLink)}
                  style={{ cursor: item.clickable ? 'pointer' : '', outline: 'none' }}
                >
                  {item[textFieldName]}
                </div>
              )
          }
        </li>
      ), items)}
    </ul>
  );
};

const styles = StyleSheet.create({
  mMenuList: {
    margin: 0,
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingTop: 0,
    paddingBottom: 0,
    ':not(:last-child)': { borderBottom: '8px solid #F0F0F0' },
  },
  mMenuListItem: {
    listStyle: 'none',
    ':not(:last-child)': { borderBottom: '1px solid #E1E1E1' },
  },
  mMenuListLink: {
    display: 'block',
    color: '#1F1F1F',
    fontFamily: 'GilroyRegular, sans-serif',
    fontSize: '16px',
    textDecoration: 'none',
    lineHeight: '24px',
    paddingTop: '14px',
    paddingBottom: '14px',
    ':hover': { color: '#006CEB' },
    ':focus': { color: '#006CEB' },
    ':active': { color: '#006CEB' },
  },
});

MenuList.propTypes = {
  onClick: PropTypes.func,
  textFieldName: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
};

MenuList.defaultProps = {
  onClick: null,
};

export default MenuList;
