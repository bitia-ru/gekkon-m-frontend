import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SpotsIndex from './Spots/SpotsIndex';
import SpotsShow from './Spots/SpotsShow';
import CragsIndex from './Crags/CragsIndex';
import About from './About/About';
import Faq from './Faq/Faq';

const Main = () => (
  <main className="page">
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
  </main>
);

export default Main;
