import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import CragsIndex from './components/Crags/CragsIndex';
import V2 from '@/v2/V2';
import BootingScreen from './components/BootingScreen/BootingScreen';

const Main = ({ currentUserId }) => (
  <main className="page">
    {
      currentUserId === undefined
        ? (
          <BootingScreen />
        )
        : (
          <Switch>
            <Route exact path="/crags" component={CragsIndex} />
            <Route path={['/', '/spots']} component={V2} />
          </Switch>
        )
    }
  </main>
);

const mapStateToProps = state => ({
  currentUserId: state.usersStore.currentUserId,
});

export default withRouter(connect(mapStateToProps)(Main));
