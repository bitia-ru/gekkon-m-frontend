import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import SpotsIndex from './components/Spots/SpotsIndex';
import SpotsShow from './components/Spots/SpotsShow';
import CragsIndex from './components/Crags/CragsIndex';
import About from './components/About/About';
import Faq from './components/Faq/Faq';
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
            <Route exact path="/" component={SpotsIndex} />
            <Route exact path="/crags" component={CragsIndex} />
            <Route exact path="/about" component={About} />
            <Route exact path="/faq" component={Faq} />
            <Route path="/spots/:id/sectors/:sector_id/routes" component={SpotsShow} />
            <Route path="/spots/:id/sectors/:sector_id" component={SpotsShow} />
            <Route path="/spots/:id/routes" component={SpotsShow} />
            <Route path="/spots/:id" component={SpotsShow} />
          </Switch>
        )
    }
  </main>
);

const mapStateToProps = state => ({
  currentUserId: state.usersStore.currentUserId,
});

export default withRouter(connect(mapStateToProps)(Main));
