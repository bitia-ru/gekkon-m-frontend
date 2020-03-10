import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { currentUser } from '@/v2/redux/user_session/utils';
import MainNavLayout from './MainNavLayout';


class MainNav extends React.PureComponent {
  render() {
    const { user } = this.props;

    return (
      <MainNavLayout user={user} />
    );
  }
}

MainNav.propTypes = {
  user: PropTypes.object,
  history: PropTypes.object,
};

const mapStateToProps = state => ({
  user: currentUser(state),
});

export default connect(mapStateToProps)(withRouter(MainNav));
