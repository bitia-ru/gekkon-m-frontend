import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import './MenuList.css';

const MenuList = ({
  textFieldName, items, onClick,
}) => {
  const mapIndexed = R.addIndex(R.map);
  return (
    <ul className="m-menu__list">
      {mapIndexed((item, index) => (
        <li
          key={index}
          style={{ listStyleType: 'none' }}
          className="m-menu__list-item"
        >
          {
            item.separator
              ? ''
              : (
                <div
                  role="button"
                  tabIndex="0"
                  onClick={item.clickable ? (() => onClick(item.id)) : null}
                  className={
                    item.clickable
                      ? 'm-menu__list-link m-menu__list-link-clickable'
                      : 'm-menu__list-link'
                  }
                  style={{ cursor: item.clickable ? 'pointer' : '' }}
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

MenuList.propTypes = {
  onClick: PropTypes.func,
  textFieldName: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
};

MenuList.defaultProps = {
  onClick: null,
};

export default MenuList;
