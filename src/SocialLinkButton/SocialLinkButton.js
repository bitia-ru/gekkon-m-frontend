import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './SocialLinkButton.css';

const SocialLinkButton = ({
  dark, active, withRemoveButton, unactive, href, onClick, xlinkHref,
}) => {
  const aClassNames = classNames({
    'social-links__link': true,
    'social-links__link_dark': dark,
    'social-links__link_active': active,
    'social-link__with_remove': withRemoveButton,
    'social-link__with_remove_unactive': unactive,
  });

  return (
    <React.Fragment>
      <a
        href={href}
        onClick={onClick}
        className={aClassNames}
      >
        <svg>
          <use xlinkHref={xlinkHref} />
        </svg>
      </a>
    </React.Fragment>
  );
};

SocialLinkButton.propTypes = {
  href: PropTypes.string,
  dark: PropTypes.bool,
  active: PropTypes.bool,
  unactive: PropTypes.bool,
  onClick: PropTypes.func,
  withRemoveButton: PropTypes.bool,
  xlinkHref: PropTypes.string.isRequired,
};

SocialLinkButton.defaultProps = {
  href: null,
  dark: false,
  active: false,
  unactive: false,
  onClick: null,
  withRemoveButton: false,
};

export default SocialLinkButton;
