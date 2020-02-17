import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import BootingScreen from './screens/BootingScreen';
import { currentUser as currentUserObtainer } from './redux/user_session/utils';
import SpotsShow from '@/v2/screens/SpotsShow';


const V2 = ({ currentUser }) => (
  <>
    {
      currentUser !== undefined ? (
        <Switch>
          <Route path="/spots/:id/sectors/:sector_id" component={SpotsShow} />
          <Route path="/spots/:id" component={SpotsShow} />
        </Switch>
      ) : (
        <BootingScreen />
      )
    }
  </>
);

const mapStateToProps = state => ({
  currentUser: currentUserObtainer(state),
});

export default connect(mapStateToProps)(V2);
