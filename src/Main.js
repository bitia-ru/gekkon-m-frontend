import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SpotsIndex from './Spots/SpotsIndex';
import SpotsShow from './Spots/SpotsShow';
import CragsIndex from './Crags/CragsIndex';

const Main = () => (
  <main className="page">
    <Switch>
      <Route exact path="/" component={SpotsIndex} />
      <Route exact path="/crags" component={CragsIndex} />
      <Route path="/spots/:id/sectors/:sector_id/routes/new" component={SpotsShow} />
      <Route path="/spots/:id/sectors/:sector_id/routes/:route_id" component={SpotsShow} />
      <Route path="/spots/:id/sectors/:sector_id/routes/:route_id/edit" component={SpotsShow} />
      <Route path="/spots/:id/sectors/:sector_id" component={SpotsShow} />
      <Route path="/spots/:id/routes/:route_id" component={SpotsShow} />
      <Route path="/spots/:id/routes/:route_id/edit" component={SpotsShow} />
      <Route path="/spots/:id" component={SpotsShow} />
    </Switch>
  </main>
);

export default Main;
