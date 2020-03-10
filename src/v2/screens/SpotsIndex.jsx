import React from 'react';
import { withRouter } from 'react-router-dom';
import { default as SpotsIndexComponent } from '@/v3/components/spots/SpotsIndex/SpotsIndex';
import ScrollToTopOnMount from '@/v1/components/ScrollToTopOnMount';
import MainScreen from '@/v2/layouts/MainScreen/MainScreen';

class SpotsIndex extends React.PureComponent {
  render() {
    return (
      <>
        <ScrollToTopOnMount />
        <MainScreen>
          <SpotsIndexComponent />
        </MainScreen>
      </>
    );
  }
}

export default withRouter(SpotsIndex);
