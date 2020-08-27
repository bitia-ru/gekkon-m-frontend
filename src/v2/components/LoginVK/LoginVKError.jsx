import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const LoginVKError = ({ location }) => {
  const params = new URLSearchParams(location.search);

  return (
    <div dangerouslySetInnerHTML={{ __html: params.get('msg') }} />
  );
};

LoginVKError.propTypes = { location: PropTypes.object };

export default withRouter(LoginVKError);
