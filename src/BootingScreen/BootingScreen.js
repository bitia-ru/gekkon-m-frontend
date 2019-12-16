import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signIn } from '../../v1/stores/users/utils';

class BootingScreen extends Component {
  componentDidMount() {
    const {
      signIn: signInProp,
    } = this.props;
    signInProp();
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
  signIn: afterSignIn => dispatch(signIn(afterSignIn)),
});

export default withRouter(connect(null, mapDispatchToProps)(BootingScreen));
