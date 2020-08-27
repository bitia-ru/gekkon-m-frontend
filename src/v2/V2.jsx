import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import BootingScreen from './screens/BootingScreen';
import { currentUser as currentUserObtainer } from './redux/user_session/utils';
import SpotsShow from '@/v2/screens/SpotsShow';
import SpotsIndex from '@/v2/screens/SpotsIndex';
import LoginVKError from '@/v2/components/LoginVK/LoginVKError';
import LoginVKSuccess from '@/v2/components/LoginVK/LoginVKSuccess';

const V2 = ({ currentUser }) => (
  <>
    {
      currentUser !== undefined ? (
        <Switch>
          <Route exact path={['/', '/spots']} component={SpotsIndex} />
          <Route path="/spots/:id/sectors/:sector_id" component={SpotsShow} />
          <Route path="/spots/:id" component={SpotsShow} />
          <Route path="/error" component={LoginVKError} />
          <Route path="/integrations/vk/actions/success" component={LoginVKSuccess} />
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
