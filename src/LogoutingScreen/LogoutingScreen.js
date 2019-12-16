import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { logOut } from '../../v1/stores/users/utils';

class LogoutingScreen extends Component {
  componentDidMount() {
    const {
      logOut: logOutProp,
    } = this.props;
    logOutProp(() => { window.location.href = '/'; });
  }

  render() {
    return (
      <div>
        Загрузка...
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logOut: afterLogOut => dispatch(logOut(afterLogOut)),
});

export default withRouter(connect(null, mapDispatchToProps)(LogoutingScreen));
