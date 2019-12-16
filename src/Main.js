import React from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { Switch, Route, withRouter } from 'react-router-dom';
import SpotsIndex from './Spots/SpotsIndex';
import SpotsShow from './Spots/SpotsShow';
import CragsIndex from './Crags/CragsIndex';
import About from './About/About';
import Faq from './Faq/Faq';
import { notAvail } from './Utils';
import BootingScreen from './BootingScreen/BootingScreen';
import LogoutingScreen from './LogoutingScreen/LogoutingScreen';

const Main = ({ user }) => (
  <main className="page">
    {
      Cookies.get('user_session_token') !== undefined && notAvail(user)
        ? (
          <BootingScreen />
        )
        : (
          <Switch>
            <Route exact path="/" component={SpotsIndex} />
            <Route exact path="/logout" component={LogoutingScreen} />
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
  user: state.usersStore.users[state.usersStore.currentUserId],
});

export default withRouter(connect(mapStateToProps)(Main));
